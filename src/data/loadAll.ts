const BASE_URL =
  "https://raw.githubusercontent.com/Renc-o/Portuguese-Trainer-App/refs/heads/main/src/data/";

async function loadJSON(file: string) {
  try {
    const res = await fetch(BASE_URL + file);

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status} for ${file}`);
    }

    return await res.json();
  } catch (err) {
    console.log("❌ Erreur chargement JSON :", file);
    console.log(err);

    return []; // fallback pour éviter crash app
  }
}

export async function loadAll() {
  const files = {
    activite: "activite.json",
    banquedemots: "banquedemots.json",
    comparaison: "comparaison.json",
    couleurs: "couleurs.json",
    date: "date.json",
    famille: "famille.json",
    humeur: "humeur.json",
    identite: "identite.json",
    metiers: "metiers.json",
    nombresordinaux: "nombresordinaux.json",
    orientation: "orientation.json",
    physiquemoral: "physiquemoral.json",
    possessif: "possessif.json",
    temps: "temps.json",
    touslesmots: "touslesmots.json",
    corpshumain: "corpshumain.json"
  };

  const data: Record<string, any[]> = {};

  await Promise.all(
    Object.entries(files).map(async ([key, file]) => {
      const json = await loadJSON(file);
      data[key] = Array.isArray(json) ? json : [];
    })
  );

  return data;
}