const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "public", "recipes.da.json");
const assetsDir = path.join(__dirname, "..", "public", "assets");

const raw = fs.readFileSync(dataPath, "utf8");
const imgs = new Set();
raw.replace(/"image"\s*:\s*"\/assets\/([^"]+)"/g, (_, name) => imgs.add(name));

const assets = fs.readdirSync(assetsDir);

const missing = [];
for (const img of imgs) {
  if (!assets.includes(img)) missing.push(img);
}

console.log("Total referenced images:", imgs.size);
console.log("Assets present:", assets.length);
if (missing.length === 0) console.log("No missing images.");
else {
  console.log("Missing images:");
  missing.forEach((m) => console.log("-", m));
}
process.exit(missing.length ? 1 : 0);
