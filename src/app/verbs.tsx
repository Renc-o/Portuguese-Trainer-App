import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { loadVerbs, Verb } from "../data/loadVerbs";

/**
 * Pronoms portugais
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
const [verbs, setVerbs] = useState<Verb[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [verb, setVerb] = useState<Verb | null>(null);

  const [answers, setAnswers] = useState<Answers>({
    eu: "",
    tu: "",
    ele: "",
    nos: "",
    eles: "",
  });

  const [result, setResult] = useState<ResultMap>({});

  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const colors = {
    background: isDark ? "#121212" : "#fff",
    text: isDark ? "#fff" : "#000",
    input: isDark ? "#2a2a2a" : "#fff",
    border: isDark ? "#444" : "#ccc",
    buttonBg: isDark ? "#2a2a2a" : "#e6e6e6",
  };

  /**
   * LOAD VERBS
   */
useEffect(() => {
  async function init() {
    const data = await loadVerbs();

    console.log("Verbes chargés :", data);

    setVerbs(data);

    const first = Math.floor(Math.random() * data.length);

    console.log("Premier index :", first);
    console.log("Premier verbe :", data[first].infinitive);

    setCurrentIndex(first);
    setVerb(data[first]);
  }

  init();
}, []);

  /**
   * INPUT
   */
  const handleChange = (key: AnswerKey, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * CHECK
   */
  const checkAnswers = () => {
    if (!verb) return;

    const correct = verb.conjugations.presente;

    const res: ResultMap = {};

    pronouns.forEach((p) => {
      const user = answers[p.key];
      const good = correct[p.key];

      res[p.key] = {
        isCorrect:
          String(user).trim().toLowerCase() ===
          String(good).trim().toLowerCase(),
        correct: good,
      };
    });

    setResult(res);
  };

  /**
   * NEXT VERB
   */
const next = () => {
  console.log("----------- NEXT -----------");
  console.log("Nombre de verbes :", verbs.length);
  console.log("Index actuel :", currentIndex);
  console.log("Verbe actuel :", verb?.infinitive);

  if (verbs.length === 0) {
    console.log("Aucun verbe chargé");
    return;
  }

  let randomIndex = Math.floor(Math.random() * verbs.length);

  while (verbs.length > 1 && randomIndex === currentIndex) {
    randomIndex = Math.floor(Math.random() * verbs.length);
  }

  console.log("Nouvel index :", randomIndex);
  console.log("Nouveau verbe :", verbs[randomIndex].infinitive);

  setCurrentIndex(randomIndex);
  setVerb(verbs[randomIndex]);

  setAnswers({
    eu: "",
    tu: "",
    ele: "",
    nos: "",
    eles: "",
  });

  setResult({});
};

  const capitalize = (word?: string) =>
    word ? word.charAt(0).toUpperCase() + word.slice(1) : "";

  if (!verb) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* TITRE */}
      <Text style={[styles.title, { color: colors.text }]}>
        {capitalize(verb.infinitive)}
      </Text>

      <Text style={styles.subtitle}>Présent</Text>

      {/* TABLE */}
      <View style={styles.table}>
        {pronouns.map((p) => (
          <View key={p.key} style={styles.row}>
            <Text style={[styles.pronoun, { color: colors.text}]}>{p.label}</Text>

            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={answers[p.key]}
              onChangeText={(text) => handleChange(p.key, text)}
              autoCorrect={false}
              autoCapitalize="none"
              spellCheck={false}
            />

            {result[p.key] && (
              <Text
                style={{
                  marginLeft: 10,
                  color: result[p.key].isCorrect ? "green" : "red",
                }}
              >
                {result[p.key].isCorrect
                  ? "✅"
                  : `❌ ${result[p.key].correct}`}
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* BUTTONS */}
      <TouchableOpacity style={styles.button} onPress={checkAnswers}>
        <Text style={[styles.buttonText, {color: colors.text}]}>Vérifier</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={next}
        style={[styles.button, { backgroundColor: colors.buttonBg }]}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>
          Suivant
        </Text>
      </TouchableOpacity>

      {/* Tous les verbes */}
        <TouchableOpacity
          onPress={() => router.push("/AllVerbs")}
          style={[styles.button, { backgroundColor: colors.buttonBg }]}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Tous les verbes
          </Text>
        </TouchableOpacity>
    </ScrollView>
  );
}

/**
 * STYLES
 */
const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 80 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 20, color: "gray" },
  table: { width: "100%" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  pronoun: { width: 120, fontSize: 16, },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
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