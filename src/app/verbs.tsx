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

/**
 * Pronoms portugais (UI + clés techniques)
 */
const pronouns = [
  { key: "eu", label: "Eu" },
  { key: "tu", label: "Tu" },
  { key: "ele", label: "Ele / Ela / Você" },
  { key: "nos", label: "Nós" },
  { key: "eles", label: "Eles / Elas / Vocês" },
] as const;

type AnswerKey = typeof pronouns[number]["key"];

type Answers = Record<AnswerKey, string>;

type ResultMap = Record<
  string,
  {
    isCorrect: boolean;
    correct: string;
  }
>;

export default function PlayScreen() {
  const [verb, setVerb] = useState<Verb | null>(null);

  const [answers, setAnswers] = useState<Answers>({
    eu: "",
    tu: "",
    ele: "",
    nos: "",
    eles: "",
  });

  const [result, setResult] = useState<ResultMap>({});

  /**
   * Chargement des verbes
   */
  useEffect(() => {
  async function init() {
    try {
      console.log("⏳ loading verbs...");

      const verbs = await loadVerbs();

      console.log("📦 verbs loaded:", verbs?.length);
      console.log("📦 sample verb:", verbs?.[0]);

      const random = getRandomVerb(verbs);

      console.log("🎯 random verb:", random);

      setVerb(random);
    } catch (e) {
      console.log("❌ ERREUR loadVerbs:", e);
    }
  }

  init();
}, []);

  /**
   * Update input
   */
  const handleChange = (key: AnswerKey, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Normalisation
   */
  const normalize = (v: unknown) =>
    String(v ?? "").trim().toLowerCase();

  /**
   * Vérification
   */
const checkAnswers = () => {
  if (!verb) return;

  const correct = verb.conjugations.present;

  const res: Record<string, any> = {};

  pronouns.forEach((p) => {
    const good = correct[p.key];
    const user = answers[p.key];

    res[p.key] = {
      isCorrect:
        String(user ?? "").trim().toLowerCase() ===
        String(good ?? "").trim().toLowerCase(),
      correct: good ?? "",
    };
  });

  setResult(res);
};

  if (!verb) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  console.log("USER:", answers);
console.log("CORRECT:", verb.conjugations.present);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* TITRE */}
      <Text style={styles.title}>
        {verb.infinitive}
      </Text>

      <Text style={styles.subtitle}>
        Présent
      </Text>

      {/* TABLE */}
      <View style={styles.table}>
        {pronouns.map((p) => (
          <View key={p.key} style={styles.row}>
            {/* PRONOM */}
            <Text style={styles.pronoun}>
              {p.label}
            </Text>

            {/* INPUT */}
            <TextInput
              style={styles.input}
              value={answers[p.key]}
              onChangeText={(text) =>
                handleChange(p.key, text)
              }
              placeholder="Traduction"
              autoCorrect={false}
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
              importantForAutofill="no"
              textContentType="none"
              keyboardType="visible-password"
              contextMenuHidden={true}
              disableFullscreenUI={true}
            />

            {/* CORRECTION INLINE */}
            {result[p.key] && (
              <Text
                style={[
                  styles.result,
                  {
                    color: result[p.key].isCorrect
                      ? "green"
                      : "red",
                  },
                ]}
              >
                {result[p.key].isCorrect
                  ? "✅"
                  : `❌ ${result[p.key].correct}`}
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* BOUTON */}
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

/**
 * STYLES
 */
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "gray",
  },

  table: {
    width: "100%",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  pronoun: {
    width: 120,
    fontSize: 16,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },

  result: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
  },

  button: {
    marginTop: 15,
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});