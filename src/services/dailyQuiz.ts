import {
  VocabularyWord,
  QuizQuestion,
  QuizAnswer,
  QuizResult,
  QuizSummary
} from "../types/vocabulary";

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function createSeed(date: Date): number {
  const seedString =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");

  return Number(seedString);
}

function seededRandom(seed: number): () => number {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function shuffle<T>(array: T[], random: () => number): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function generateDailyQuiz(
  vocabulary: VocabularyWord[]
): QuizQuestion[] {
  const seed = createSeed(new Date());

  const random = seededRandom(seed);

  const shuffledVocabulary = shuffle(vocabulary, random);

  const selectedWords = shuffledVocabulary.slice(0, 10);

  const frenchQuestions = selectedWords
    .slice(0, 5)
    .map<QuizQuestion>((word, index) => ({
      id: `fr-${index}`,
      sourceLanguage: "fr",
      sourceWord: word.fr,
      expectedAnswer: word.pt
    }));

  const portugueseQuestions = selectedWords
    .slice(5, 10)
    .map<QuizQuestion>((word, index) => ({
      id: `pt-${index}`,
      sourceLanguage: "pt",
      sourceWord: word.pt,
      expectedAnswer: word.fr
    }));

  return shuffle(
    [...frenchQuestions, ...portugueseQuestions],
    random
  );
}

export function buildQuizSummary(
  questions: QuizQuestion[],
  answers: QuizAnswer[]
): QuizSummary {
  const results: QuizResult[] = questions.map((question) => {
    const answer = answers.find(
      (a) => a.questionId === question.id
    );

    const userAnswer = answer?.userAnswer ?? "";

    const correct =
      normalize(userAnswer) ===
      normalize(question.expectedAnswer);

    return {
      word: question.sourceWord,
      expected: question.expectedAnswer,
      answer: userAnswer,
      correct
    };
  });

  const score = results.filter((r) => r.correct).length;

  return {
    score,
    total: results.length,
    percentage: Math.round(
      (score / results.length) * 100
    ),
    results
  };
}