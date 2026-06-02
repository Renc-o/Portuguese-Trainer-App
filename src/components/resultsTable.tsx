import { StyleSheet, Text, View } from "react-native";
import { QuizSummary } from "../types/vocabulary";

interface Props {
  summary: QuizSummary;
}

export default function ResultsTable({ summary }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Résultats</Text>

      <Text style={styles.score}>
        Score : {summary.score}/{summary.total}
      </Text>

      <Text style={styles.percent}>
        Pourcentage : {summary.percentage}%
      </Text>

      {summary.results.map((result, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.word}>
            {result.word}
          </Text>

          <Text>{result.answer}</Text>

          <Text>{result.expected}</Text>

          <Text>
            {result.correct ? "✅" : "❌"}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
  },
  percent: {
    fontSize: 18,
    marginBottom: 20,
  },
  row: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  word: {
    fontWeight: "600",
  },
});