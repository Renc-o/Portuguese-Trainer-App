export type Pronoun = "eu" | "tu" | "ele" | "nos" | "eles";

export type Tense = "presente" | "passado" | "futuro";

export interface Verb {
  infinitive: string;
  group: number;
  conjugations: Record<Tense, Record<Pronoun, string>>;
}

const URL =
  "https://raw.githubusercontent.com/Renc-o/Portuguese-Trainer-App/refs/heads/main/src/data/verbs.json";

/**
 * Charge les verbes depuis GitHub
 */
export async function loadVerbs() {
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error("Impossible de charger les verbes");
  }

  const data = await response.json();

  console.log("RAW DATA:", data);

  // 🔥 force array
  return Array.isArray(data) ? data : [data];
}

/**
 * Choisit un verbe aléatoire
 */
export function getRandomVerb(verbs: Verb[]): Verb {
  return verbs[Math.floor(Math.random() * verbs.length)];
}