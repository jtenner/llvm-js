//--------- LLVM Bindings Generator ---------//
import { execFile as execFileCb } from "node:child_process";
import { promisify } from "node:util";
import { writeFile } from "fs/promises"
const execFile = promisify(execFileCb);

const includeFlags = [
  "-I",
  "llvm-project/llvm/include/",
  "-I",
  "build-emscripten/include",
];

const { stdout } = await execFile(
  "emcc",
  [
    "src/everything.c",
    "-O0",
    ...includeFlags,
    "-fsyntax-only",
    "-Xclang",
    "-ast-dump=json",
  ],
  {
    stdio: ["ignore", "pipe", "inherit"],
    maxBuffer: undefined,
  }
);

//--- Extract all the nodes ---//
const parent = JSON.parse(stdout);
const nodeMap = new Map();
const visit = node => {
  nodeMap.set(node.id, node);
  if (node.inner) {
    for (const inner of node.inner) {
      visit(inner)
    }
  }
}
visit(parent);

const nodes = Array.from(nodeMap.values());

//--- Extract necessary information ---//
const filterOut = new Set([
  "_LLVMInitializeAllAsmParsers",
  "_LLVMInitializeAllAsmPrinters",
  "_LLVMInitializeAllDisassemblers",
  "_LLVMInitializeAllTargetInfos",
  "_LLVMInitializeAllTargetMCs",
  "_LLVMInitializeAllTargets",
  "_LLVMInitializeNativeAsmParser",
  "_LLVMInitializeNativeAsmPrinter",
  "_LLVMInitializeNativeDisassembler",
  "_LLVMInitializeNativeTarget",
]);

const added = ["_malloc", "_free"];
const typedefs = new Array();
const funcs = new Array();
const type_map = (qualType) => {
  if(qualType.startsWith("enum")) return "number";
  switch(qualType)
  {
    case "char **":                            return "Pointer<LLVMStringRef[]>"; break;
    case "const char *":                       return "LLVMStringRef"; break;
    case "int":                                return "number"; break;
    case "long":                               return "number"; break;
    case "long long":                          return "bigint"; break;
    case "unsigned int *":                     return "Pointer<number>"; break;
    case "const unsigned int *":               return "Pointer<number>"; break;
    case "char *":                             return "LLVMStringRef"; break;
    case "void *":                             return "Pointer<any>"; break;
    case "unsigned int":                       return "number"; break;
    case "size_t":                             return "number"; break;
    case "uint64_t":                           return "number"; break;
    case "size_t *":                           return "Pointer<number>"; break;
    case "unsigned long long":                 return "bigint"; break;
    case "const uint64_t *":                   return "Pointer<bigint>"; break;
    case "uint8_t":                            return "number"; break;
    case "uint8_t *":                          return "Pointer<number>"; break;
    case "double":                             return "number"; break;
    case "int64_t":                            return "bigint"; break;
    case "uint32_t":                           return "number"; break;
    case "uint64_t *":                         return "Pointer<bigint>"; break;
    case "uint16_t":                           return "number"; break;
    case "struct LLVMMCJITCompilerOptions *":  return "any"; break;
    case "const char *const *":                return "Pointer<LLVMStringRef[]>"; break;
    case "void":                               return "void"; break;
    default:  {
      return qualType.endsWith("*") ? `Pointer<${qualType.split(' ')[0]}[]>` : qualType.split(' ')[0];
    }
  }
}

nodes.forEach(element => {
  if(!element?.name?.startsWith("LLVM"))  return;

  if(element?.kind == "TypedefDecl")
  {
    typedefs.push(element.name);
  }
  else if(element?.kind == "FunctionDecl")
  {
    element.name = "_" + element.name;
    if(!filterOut.has(element.name))
      funcs.push(element);
    
    element.params = new Array();
    element.inner?.forEach(e => {
      if(e?.kind != "ParmVarDecl")  return;

      element.params.push({name: e.name, type: type_map(e.type.qualType)});
    });
    let t = element.type.qualType;
    
    element.type = type_map(element.type.qualType.split('(')[0].trim());
  }
});
typedefs.splice(typedefs.indexOf("LLVMBool"), 1);

//--- Write Bindings and Typings ---//
let llvm_ts = "";
let llvm_exports = "";

//- Exported functions -//
llvm_exports = llvm_exports.concat("[");
added.forEach(element => {  llvm_exports = llvm_exports.concat("\""+element+"\","); });
funcs.forEach(element => {  llvm_exports = llvm_exports.concat("\""+element.name+"\","); });
llvm_exports = llvm_exports.slice(0, llvm_exports.length-1);
llvm_exports = llvm_exports.concat("]")

//- Header -//
llvm_ts = llvm_ts.concat(`
let LLVM!: Module;

export async function load(): Promise<Module> {
  // @ts-expect-error
  const llvm = await import("./llvm-wasm.mjs");
  const mod = await llvm.default();
  LLVM = mod;
  return mod;
}

export type Pointer<T> = number & { type: T };\n\n`)

//- LLVM Struct Typings -//
llvm_ts = llvm_ts.concat("export type LLVMBool = 1|0;\n");
llvm_ts = llvm_ts.concat("export type LLVMStringRef = Pointer<\"LLVMStringRef\">;\n");
typedefs.forEach(element => {
  llvm_ts = llvm_ts.concat("export type " + element + " = Pointer<\"" + element + "\">;\n");
});

llvm_ts = llvm_ts.concat(`
export interface Module {
  HEAPU8: Uint8Array;
  HEAPU32: Uint32Array;
  ready: Promise<Module>;
  _malloc<T>(size: number): Pointer<T>;
  _free(ptr: Pointer<any>): void;
`)

//- LLVM Function Typings -//
funcs.forEach(element => {
  let func_proto = "";

  func_proto = func_proto.concat("  "+element.name + "(");
  
  element.params.forEach((param, index) => {
    let name = param.name;
    if(name == undefined)
    {
      if(index == 0)  name = "Builder";
      else if(index == 1) name = "Type";
      else name = "x"+index;
    }
    else if(name == "B")  name = "Builder";
    else if(name == "C")  name = "Context";
    else if(name == "M")  name = "Module";
    func_proto = func_proto.concat(name + ": " + param.type + ", ");
  });
  if(element.params.length > 0) func_proto = func_proto.slice(0, func_proto.length-2);
  
  func_proto = func_proto.concat("): " + element.type + ";\n");
  llvm_ts = llvm_ts.concat(func_proto);
});
llvm_ts = llvm_ts.concat("}\n");

//- Lifting/lowering -//
llvm_ts = llvm_ts.concat(`
export function lower(str: string): LLVMStringRef {
  str += "0";
  const length = Buffer.byteLength(str);
  const ptr = LLVM._malloc<"LLVMStringRef">(length);
  Buffer.from(LLVM.HEAPU8.buffer, ptr).write(str, "utf-8");
  return ptr;
}

export function lift(ptr: Pointer<"LLVMStringRef">): string {
  const index = LLVM.HEAPU8.indexOf(0, ptr);
  return Buffer.from(LLVM.HEAPU8.buffer).toString("utf-8", ptr, index);
}

export function lowerPointerArray<T extends number>(elements: T[]): Pointer<T[]> {
  const elementCount = elements.length;
  const ptr = LLVM._malloc<T[]>(elementCount << 2);
  const index = ptr >>> 2;
  for (let i = 0; i < elementCount; i++) {
    LLVM.HEAPU32[index + i] = elements[i];
  }
  return ptr;
}\n\n`)

//--- Write to respective files ---//
await writeFile("./src/index.ts", llvm_ts);
await writeFile("./llvm.exports", llvm_exports);