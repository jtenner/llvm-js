async function main() {
  const myMod = await import("./build/index.js");
  const llvm = await myMod.load();
  console.log(llvm._malloc(2000))
  console.log(llvm._malloc(2000))
  console.log(llvm._malloc(2000))
}


main();