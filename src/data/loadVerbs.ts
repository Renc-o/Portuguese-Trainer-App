export type Pronoun = "je" | "tu" | "il" | "nous" | "vous" | "ils";

export type Tense = "present" | "passeCompose" | "futur";

export interface Verb {
  infinitive: string;
  group: number;
  conjugations: Record<Tense, Record<Pronoun, string>>;
}

const URL =
  "https://raw.githubusercontent.com/Renc-o/Portuguese-Trainer-App/main/src/data/verbs.json";

/**
 * Charge les verbes depuis GitHub
 */
export async function loadVerbs(): Promise<Verb[]> {
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error("Impossible de charger les verbes");
  }

  return await response.json();
}

/**
 * Choisit un verbe aléatoire
 */
export function getRandomVerb(verbs: Verb[]): Verb {
  return verbs[Math.floor(Math.random() * verbs.length)];
}