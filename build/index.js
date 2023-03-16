let LLVM;
export async function load() {
    // @ts-expect-error
    const llvm = await import("./llvm-wasm.mjs");
    const mod = await llvm.default();
    LLVM = mod;
    return mod;
}
export var LLVMIntPredicate;
(function (LLVMIntPredicate) {
    LLVMIntPredicate[LLVMIntPredicate["Eq"] = 32] = "Eq";
    LLVMIntPredicate[LLVMIntPredicate["Ne"] = 33] = "Ne";
    LLVMIntPredicate[LLVMIntPredicate["Ugt"] = 34] = "Ugt";
    LLVMIntPredicate[LLVMIntPredicate["Uge"] = 35] = "Uge";
    LLVMIntPredicate[LLVMIntPredicate["Ult"] = 36] = "Ult";
    LLVMIntPredicate[LLVMIntPredicate["Ule"] = 37] = "Ule";
    LLVMIntPredicate[LLVMIntPredicate["Sgt"] = 38] = "Sgt";
    LLVMIntPredicate[LLVMIntPredicate["Sge"] = 39] = "Sge";
    LLVMIntPredicate[LLVMIntPredicate["Slt"] = 40] = "Slt";
    LLVMIntPredicate[LLVMIntPredicate["Sle"] = 41] = "Sle";
})(LLVMIntPredicate = LLVMIntPredicate || (LLVMIntPredicate = {}));
export var LLVMRealPredicate;
(function (LLVMRealPredicate) {
    LLVMRealPredicate[LLVMRealPredicate["Predicatefalse"] = 0] = "Predicatefalse";
    LLVMRealPredicate[LLVMRealPredicate["Oeq"] = 1] = "Oeq";
    LLVMRealPredicate[LLVMRealPredicate["Ogt"] = 2] = "Ogt";
    LLVMRealPredicate[LLVMRealPredicate["Oge"] = 3] = "Oge";
    LLVMRealPredicate[LLVMRealPredicate["Olt"] = 4] = "Olt";
    LLVMRealPredicate[LLVMRealPredicate["Ole"] = 5] = "Ole";
    LLVMRealPredicate[LLVMRealPredicate["One"] = 6] = "One";
    LLVMRealPredicate[LLVMRealPredicate["Ord"] = 7] = "Ord";
    LLVMRealPredicate[LLVMRealPredicate["Uno"] = 8] = "Uno";
    LLVMRealPredicate[LLVMRealPredicate["Ueq"] = 9] = "Ueq";
    LLVMRealPredicate[LLVMRealPredicate["Ugt"] = 10] = "Ugt";
    LLVMRealPredicate[LLVMRealPredicate["Uge"] = 11] = "Uge";
    LLVMRealPredicate[LLVMRealPredicate["Ult"] = 12] = "Ult";
    LLVMRealPredicate[LLVMRealPredicate["Ule"] = 13] = "Ule";
    LLVMRealPredicate[LLVMRealPredicate["Une"] = 14] = "Une";
    LLVMRealPredicate[LLVMRealPredicate["Predicatetrue"] = 15] = "Predicatetrue";
})(LLVMRealPredicate = LLVMRealPredicate || (LLVMRealPredicate = {}));
export var LLVMModuleFlagBehavior;
(function (LLVMModuleFlagBehavior) {
    LLVMModuleFlagBehavior[LLVMModuleFlagBehavior["Error"] = 0] = "Error";
    LLVMModuleFlagBehavior[LLVMModuleFlagBehavior["Warning"] = 1] = "Warning";
    LLVMModuleFlagBehavior[LLVMModuleFlagBehavior["Require"] = 2] = "Require";
    LLVMModuleFlagBehavior[LLVMModuleFlagBehavior["Override"] = 3] = "Override";
    LLVMModuleFlagBehavior[LLVMModuleFlagBehavior["Append"] = 4] = "Append";
    LLVMModuleFlagBehavior[LLVMModuleFlagBehavior["Appendunique"] = 5] = "Appendunique";
})(LLVMModuleFlagBehavior = LLVMModuleFlagBehavior || (LLVMModuleFlagBehavior = {}));
export var LLVMCodeGenFileType;
(function (LLVMCodeGenFileType) {
    LLVMCodeGenFileType[LLVMCodeGenFileType["LLVMAssemblyFile"] = 0] = "LLVMAssemblyFile";
    LLVMCodeGenFileType[LLVMCodeGenFileType["LLVMObjectFile"] = 1] = "LLVMObjectFile";
})(LLVMCodeGenFileType = LLVMCodeGenFileType || (LLVMCodeGenFileType = {}));
export var LLVMCodeModel;
(function (LLVMCodeModel) {
    LLVMCodeModel[LLVMCodeModel["LLVMCodeModelDefault"] = 0] = "LLVMCodeModelDefault";
    LLVMCodeModel[LLVMCodeModel["LLVMCodeModelJITDefault"] = 1] = "LLVMCodeModelJITDefault";
    LLVMCodeModel[LLVMCodeModel["LLVMCodeModelTiny"] = 2] = "LLVMCodeModelTiny";
    LLVMCodeModel[LLVMCodeModel["LLVMCodeModelSmall"] = 3] = "LLVMCodeModelSmall";
    LLVMCodeModel[LLVMCodeModel["LLVMCodeModelKernel"] = 4] = "LLVMCodeModelKernel";
    LLVMCodeModel[LLVMCodeModel["LLVMCodeModelMedium"] = 5] = "LLVMCodeModelMedium";
    LLVMCodeModel[LLVMCodeModel["LLVMCodeModelLarge"] = 6] = "LLVMCodeModelLarge";
})(LLVMCodeModel = LLVMCodeModel || (LLVMCodeModel = {}));
export var LLVMCodeGenOptLevel;
(function (LLVMCodeGenOptLevel) {
    LLVMCodeGenOptLevel[LLVMCodeGenOptLevel["LLVMCodeGenLevelNone"] = 0] = "LLVMCodeGenLevelNone";
    LLVMCodeGenOptLevel[LLVMCodeGenOptLevel["LLVMCodeGenLevelLess"] = 1] = "LLVMCodeGenLevelLess";
    LLVMCodeGenOptLevel[LLVMCodeGenOptLevel["LLVMCodeGenLevelDefault"] = 2] = "LLVMCodeGenLevelDefault";
    LLVMCodeGenOptLevel[LLVMCodeGenOptLevel["LLVMCodeGenLevelAggressive"] = 3] = "LLVMCodeGenLevelAggressive";
})(LLVMCodeGenOptLevel = LLVMCodeGenOptLevel || (LLVMCodeGenOptLevel = {}));
export var LLVMRelocMode;
(function (LLVMRelocMode) {
    LLVMRelocMode[LLVMRelocMode["LLVMRelocDefault"] = 0] = "LLVMRelocDefault";
    LLVMRelocMode[LLVMRelocMode["LLVMRelocStatic"] = 1] = "LLVMRelocStatic";
    LLVMRelocMode[LLVMRelocMode["LLVMRelocPIC"] = 2] = "LLVMRelocPIC";
    LLVMRelocMode[LLVMRelocMode["LLVMRelocDynamicNoPic"] = 3] = "LLVMRelocDynamicNoPic";
    LLVMRelocMode[LLVMRelocMode["LLVMRelocROPI"] = 4] = "LLVMRelocROPI";
    LLVMRelocMode[LLVMRelocMode["LLVMRelocRWPI"] = 5] = "LLVMRelocRWPI";
    LLVMRelocMode[LLVMRelocMode["LLVMRelocROPI_RWPI"] = 6] = "LLVMRelocROPI_RWPI";
})(LLVMRelocMode = LLVMRelocMode || (LLVMRelocMode = {}));
export function lower(str) {
    str += "\0";
    const length = Buffer.byteLength(str);
    const ptr = LLVM._malloc(length);
    Buffer.from(LLVM.HEAPU8.buffer, ptr).write(str, "utf-8");
    return ptr;
}
export function lift(ptr) {
    const index = LLVM.HEAPU8.indexOf(0, ptr);
    return Buffer.from(LLVM.HEAPU8.buffer).toString("utf-8", ptr, index);
}
export function lowerPointerArray(elements) {
    const elementCount = elements.length;
    const ptr = LLVM._malloc(elementCount << 2);
    const index = ptr >>> 2;
    for (let i = 0; i < elementCount; i++) {
        LLVM.HEAPU32[index + i] = elements[i];
    }
    return ptr;
}
//# sourceMappingURL=index.js.map