const llvmModule = await import("./build/llvm.mjs");
const {
  _free,
  _LLVMAddFunction,
  _LLVMAppendBasicBlock,
  _LLVMBuildAdd,
  _LLVMBuildRet,
  _LLVMCreateBuilder,
  _LLVMDisposeMessage,
  _LLVMFunctionType,
  _LLVMGetParam,
  _LLVMInt32Type,
  _LLVMModuleCreateWithName,
  _LLVMPositionBuilderAtEnd,
  _LLVMVerifyModule,
  _LLVMWriteBitcodeToMemoryBuffer,
  _malloc,
  HEAPU32,
  HEAPU8,
} = await llvmModule.default();

// typedef enum {
//   LLVMAbortProcessAction, /* verifier will print to stderr and abort() */
//   LLVMPrintMessageAction, /* verifier will print to stderr and return 1 */
//   LLVMReturnStatusAction  /* verifier will just return 1 */
// } LLVMVerifierFailureAction;
const LLVMAbortProcessAction = 0;
const LLVMPrintMessageAction = 1;
const LLVMReturnStatusAction = 2;

function lower(str) {
  str += "\0";
  const byteLength = Buffer.byteLength(str, "utf-8");
  const ptr = _malloc(byteLength);
  Buffer.from(HEAPU8.buffer).write(str, ptr, "utf-8");
  return ptr;
}

function lift(ptr) {
  const buff = Buffer.from(HEAPU8.buffer);
  const end = buff.indexOf("\0", ptr);
  return buff.toString("utf-8", ptr, end);
}

function storeu32(ptr, value) {
  HEAPU32[ptr >>> 2] = value;
}

function loadu32(ptr) {
  return HEAPU32[ptr >>> 2]
}

const moduleName = lower("whacko");
const mod = _LLVMModuleCreateWithName(moduleName);
const paramTypes = _malloc(8);
storeu32(paramTypes, _LLVMInt32Type());
storeu32(paramTypes + 4, _LLVMInt32Type());

const retType = _LLVMFunctionType(_LLVMInt32Type(), paramTypes, 2, 0);
const sum = _LLVMAddFunction(mod, lower("sum"), retType);

const entry = _LLVMAppendBasicBlock(sum, lower("entry"));

const builder = _LLVMCreateBuilder();
_LLVMPositionBuilderAtEnd(builder, entry);
const param1 = _LLVMGetParam(sum, 0);
const param2 = _LLVMGetParam(sum, 1);

// it breaks here
const tmp = _LLVMBuildAdd(builder, param1, param2, lower("tmp"));

_LLVMBuildRet(builder, tmp);

const error = _malloc(4);
_LLVMVerifyModule(mod, LLVMAbortProcessAction, error);
_LLVMDisposeMessage(error);
_free(error);
const modPtr = _LLVMWriteBitcodeToMemoryBuffer(mod);
const modStart = loadu32(modPtr);
const modEnd = loadu32(modPtr + 4);
console.log(modStart, modEnd);
