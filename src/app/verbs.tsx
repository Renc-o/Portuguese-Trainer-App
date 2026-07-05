import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { getRandomVerb, loadVerbs, Verb } from "../data/loadVerbs";

const pronouns = ["je", "tu", "il", "nous", "vous", "ils"] as const;

export default function PlayScreen() {
  const [verb, setVerb] = useState<Verb | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({
    je: "",
    tu: "",
    il: "",
    nous: "",
    vous: "",
    ils: "",
  });

  useEffect(() => {
    async function init() {
      const verbs = await loadVerbs();
      setVerb(getRandomVerb(verbs));
    }

    init();
  }, []);

  const handleChange = (key: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const checkAnswers = () => {
    if (!verb) return;

    const correct = verb.conjugations.present;

    const result = pronouns.map((p) => ({
      pronoun: p,
      user: answers[p],
      correct: correct[p],
      isCorrect: answers[p]?.trim().toLowerCase() === correct[p],
    }));

    console.log(result);
  };

  if (!verb) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Verbe : {verb.infinitive}
      </Text>

      <Text style={styles.subtitle}>
        Présent
      </Text>

      <View style={styles.table}>
        {pronouns.map((p) => (
          <View key={p} style={styles.row}>
            <Text style={styles.pronoun}>{p}</Text>

            <TextInput
              style={styles.input}
              value={answers[p]}
              onChangeText={(text) => handleChange(p, text)}
              placeholder="..."
            />
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={checkAnswers}
      >
        <Text style={styles.buttonText}>
          Vérifier
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "gray",
  },
  table: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  pronoun: {
    width: 80,
    fontSize: 18,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});