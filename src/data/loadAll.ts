const BASE_URL =
  "https://raw.githubusercontent.com/Renc-o/Portuguese-Trainer-App/main/src/data/";

async function loadJSON(file: string) {
  try {
    const res = await fetch(BASE_URL + file + "?v=" + Date.now());

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.log("❌ Erreur chargement JSON :", file, err);
    return [];
  }
}

export async function loadAll() {
  const json = await loadJSON(BASE_URL + "words.json");

  // IMPORTANT : on s'assure que c'est un tableau
  return Array.isArray(json) ? json : [];
}