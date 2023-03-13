let LLVM;
export async function load() {
    // @ts-expect-error
    const llvm = await import("./llvm-wasm.mjs");
    const mod = await llvm.default();
    LLVM = mod;
    return mod;
}
export function lower(str) {
    str += "0";
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
    for (let i = 0; i < elementCount; i++) {
        LLVM.HEAPU32[ptr >>> 2] = elements[i];
    }
    return ptr;
}
//# sourceMappingURL=index.js.map