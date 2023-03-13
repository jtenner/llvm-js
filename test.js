async function main() {
  const myMod = await import("./build/index.js");

  const loaded = await myMod.load();
  console.log("Testing!");
  console.log(loaded);
}


main();