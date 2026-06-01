const fs = require("fs");
const path = require("path");

// dossier JSON
const DATA_DIR = "./src/data";

// liste des fichiers à merger
const files = [
  "activite.json",
  "banquedemots.json",
  "comparaison.json",
  "couleurs.json",
  "date.json",
  "famille.json",
  "humeur.json",
  "identite.json",
  "metiers.json",
  "nombres-ordinaux.json",
  "orientation.json",
  "physique-moral.json",
  "possessif.json",
  "temps.json"
];

let allWords = [];

// lecture + merge
files.forEach((file) => {
  const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf8");
  const json = JSON.parse(raw);

  const category = file.replace(".json", "");

  const enriched = json.map(word => ({
    ...word,
    cat: category
  }));

  allWords = allWords.concat(enriched);
});

// sauvegarde final
fs.writeFileSync(
  path.join(DATA_DIR, "touslesmots.json"),
  JSON.stringify(allWords, null, 2)
);

console.log("✔ touslesmots.json généré !");