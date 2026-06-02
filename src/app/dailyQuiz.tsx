import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
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

  // 🌗 Mode sombre automatique
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const colors = {
    background: isDark ? "#121212" : "#ffffff",
    text: isDark ? "#ffffff" : "#000000",
    card: isDark ? "#1e1e1e" : "#f2f2f2",
    input: isDark ? "#2a2a2a" : "#ffffff",
    border: isDark ? "#444" : "#ccc",
    button: isDark ? "#444" : "#ccc",
    buttonBg: isDark ? "#2a2a2a" : "#e6e6e6",
  };

  const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
    color: colors.text
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.text
  },
  card: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  questionNumber: {
    fontWeight: "700",
    color: colors.text
  },
  direction: {
    marginTop: 5,
    color: "gray",
  },
  word: {
    fontSize: 22,
    marginTop: 10,
    fontWeight: "600",
    color: colors.text
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    color: colors.text
  },
  button: {
    marginBottom: 60,
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

  if (submitted) {
    return <ResultsTable summary={summary} />;
  }

  return (
  <KeyboardAvoidingView
    style={{
      flex: 1,
      backgroundColor: colors.background,
    }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={1}
  >
    <ScrollView
      style={{ 
        flex: 1,
        backgroundColor: colors.background
      }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
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
            placeholderTextColor={
              isDark ? "#999999" : "#666666"
            }
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
  </KeyboardAvoidingView>
);
}

