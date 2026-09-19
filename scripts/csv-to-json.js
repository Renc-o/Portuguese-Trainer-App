const fs = require("fs");
const Papa = require("papaparse");

function convert(fileName, outputName) {
  const file = fs.readFileSync(`./csv/${fileName}`, "utf8");

  const result = Papa.parse(file, { skipEmptyLines: true });

  const json = result.data
    .filter(row => row[0] && row[1])
    .map(row => ({
      pt: row[0],
      fr: row[1],
      category: row[2].toLowerCase().replace(/\s/g, "")
    }));

  fs.writeFileSync(
    outputName,
    JSON.stringify(json, null, 2)
  );

  console.log(`Converted ${fileName} → ${outputName}`);
}

convert("words.csv", "words.json");