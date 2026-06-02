import { ScrollView, StyleSheet, Text, useColorScheme } from "react-native";
import { QuizSummary } from "../types/vocabulary";

interface Props {
  summary: QuizSummary;
}

export default function ResultsTable({ summary }: Props) {
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
    flex: 1,
    padding: 20,
    paddingBottom: 200,
    backgroundColor: colors.background
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 60,
    marginBottom: 10,
    color: colors.text
  },
  score: {
    fontSize: 18,
  },
  percent: {
    fontSize: 18,
    marginBottom: 20,
    color: colors.text
  },
  row: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    color: colors.text
  },
  word: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text
  },
});

  return (
    <ScrollView style={{flex : 1}}
    contentContainerStyle={{
    padding: 10,
    paddingBottom: 50,
    backgroundColor: colors.background
  }}
    >
      <Text style={styles.title}>Résultats</Text>

      <Text style={{
        fontSize: 18,
        color: summary.score < 5 ? "#f44336" : "#8fce00"
      }}>
        Score : {summary.score}/{summary.total}
      </Text>

      <Text style={{
        fontSize: 18,
        marginBottom: 20,
        color: summary.percentage <= 50 ? "#f44336" : "#8fce00"
      }}>
        Pourcentage : {summary.percentage}%
      </Text>

      {summary.results.map((result, index) => (
        <ScrollView key={index} style={styles.row}>
          <Text style={styles.word}>
            {result.word} 👉 {result.expected}
          </Text>

          <Text style={{
            fontSize: 18,
            color: result.answer == result.expected ? "#8fce00" : "#f44336"
          }}>
                {result.correct ? "✅" : "❌"} {result.answer}
          </Text>
        </ScrollView>
      ))}
    </ScrollView>
  );
}