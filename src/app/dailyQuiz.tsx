import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import vocabulary from "../data/touslesmots.json";

import {
  QuizAnswer,
  VocabularyWord,
} from "../types/vocabulary";

import {
  buildQuizSummary,
  generateDailyQuiz,
} from "../services/dailyQuiz";

import ResultsTable from "../components/resultsTable";

export default function DailyQuiz() {
  const questions = useMemo(
    () =>
      generateDailyQuiz(
        vocabulary as VocabularyWord[]
      ),
    []
  );

  const [answers, setAnswers] = useState<
    QuizAnswer[]
  >([]);

  const [submitted, setSubmitted] =
    useState(false);

  const updateAnswer = (
    questionId: string,
    value: string
  ) => {
    setAnswers((prev) => {
      const existing = prev.find(
        (a) => a.questionId === questionId
      );

      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId
            ? { ...a, userAnswer: value }
            : a
        );
      }

      return [
        ...prev,
        { questionId, userAnswer: value },
      ];
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const summary = buildQuizSummary(
    questions,
    answers
  );

  if (submitted) {
    return <ResultsTable summary={summary} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Quiz du jour
      </Text>

      <Text style={styles.subtitle}>
        Traduis les mots proposés dans la langue opposée.
      </Text>

      {questions.map((question, index) => (
        <View key={question.id} style={styles.card}>
          <Text style={styles.questionNumber}>
            Question {index + 1}
          </Text>

          <Text style={styles.direction}>
            {question.sourceLanguage === "fr"
              ? "Français → Portugais"
              : "Portugais → Français"}
          </Text>

          <Text style={styles.word}>
            {question.sourceWord}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ta réponse"
            onChangeText={(text) =>
              updateAnswer(question.id, text)
            }
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>
          Valider le quiz
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  card: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
  },
  questionNumber: {
    fontWeight: "700",
  },
  direction: {
    marginTop: 5,
    color: "gray",
  },
  word: {
    fontSize: 22,
    marginTop: 10,
    fontWeight: "600",
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
  },
});