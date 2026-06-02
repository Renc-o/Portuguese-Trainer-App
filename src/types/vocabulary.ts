export interface VocabularyWord {
  fr: string;
  pt: string;
}

export type Language = "fr" | "pt";

export interface QuizQuestion {
  id: string;
  sourceLanguage: Language;
  sourceWord: string;
  expectedAnswer: string;
}

export interface QuizAnswer {
  questionId: string;
  userAnswer: string;
}

export interface QuizResult {
  word: string;
  expected: string;
  answer: string;
  correct: boolean;
}

export interface QuizSummary {
  score: number;
  total: number;
  percentage: number;
  results: QuizResult[];
}