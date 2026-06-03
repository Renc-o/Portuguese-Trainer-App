const fs = require("fs");
const path = require("path");

const DATA_FOLDER = "src/data";
const OUTPUT_FILE = "./words.json";

const mergedWords = [];

const files = fs
  .readdirSync(DATA_FOLDER)
  .filter(
    (file) =>
      file.endsWith(".json") &&
      file !== "words.json"
  );

for (const file of files) {
  const filePath = path.join(DATA_FOLDER, file);

  const category = path.basename(file, ".json");

  const content = JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );

  if (!Array.isArray(content)) {
    console.warn(`${file} ignoré : ce n'est pas un tableau.`);
    continue;
  }

  const wordsWithCategory = content.map((item) => ({
    ...item,
    category,
  }));

  mergedWords.push(...wordsWithCategory);
}

fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify(mergedWords, null, 2),
  "utf8"
);

console.log(
  `✅ ${mergedWords.length} entrées fusionnées dans ${OUTPUT_FILE}`
);