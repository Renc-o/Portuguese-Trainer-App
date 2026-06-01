const fs = require("fs");
const Papa = require("papaparse");

function convert(fileName, outputName) {
  const file = fs.readFileSync(`./csv/${fileName}`, "utf8");

  const result = Papa.parse(file, { skipEmptyLines: true });

  const json = result.data
    .filter(row => row[0] && row[1])
    .map(row => ({
      pt: row[0],
      fr: row[1]
    }));

  fs.writeFileSync(
    `Portuguese-App/${outputName}`,
    JSON.stringify(json, null, 2)
  );

  console.log(`✔ Converted ${fileName} → ${outputName}`);
}

convert("activite.csv", "activite.json");
convert("banquedemots.csv", "banquedemots.json");
convert("comparaison.csv", "comparaison.json");
convert("couleurs.csv", "couleurs.json");
convert("date.csv", "date.json");
convert("famille.csv", "famille.json");
convert("humeur.csv", "humeur.json");
convert("identite.csv", "identite.json");
convert("metiers.csv", "metiers.json");
convert("nombresordinaux.csv", "nombresordinaux.json");
convert("orientation.csv", "orientation.json");
convert("physiquemoral.csv", "physiquemoral.json");
convert("possessif.csv", "possessif.json");
convert("temps.csv", "temps.json");
convert("corpshumain.csv", "corpshumain.json");