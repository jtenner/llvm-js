const mod = await import("./build/llvm.mjs");
const llvm = await mod.default();

function lower(str) {
  const byteLength = Buffer.byteLength(str, "utf-8");
  const ptr = llvm._malloc(byteLength + 1);
  
}

