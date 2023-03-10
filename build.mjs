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

const funcs = nodes.filter(e => e?.kind == "FunctionDecl" && e?.name.startsWith("LLVM"))
  .map(e => "_" + e.name)
  .filter(e => !filterOut.has(e))
  .concat(added);

await writeFile("./llvm.exports", JSON.stringify(funcs));

