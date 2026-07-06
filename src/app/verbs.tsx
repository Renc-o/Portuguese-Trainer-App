import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

const tenses = ["presente", "passado", "futuro"] as const;

const tenseLabels = {
  presente: "Presente",
  passado: "Passado",
  futuro: "Futuro",
};

type Filter = "all" | "presente" | "passado" | "futuro";

export default function PlayScreen() {
  const inputRefs = useRef<Record<string, TextInput | null>>({});
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [verb, setVerb] = useState<Verb | null>(null);

  const [tense, setTense] =
    useState<(typeof tenses)[number]>("presente");

  const [filter, setFilter] = useState<Filter>("all");

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
    buttonBg: isDark ? "#2a2a2a" : "#363636",
    subtitle: isDark ? "#9e9e9e" : "#444",
  };

  /**
   * LOAD VERBS
   */
  useEffect(() => {
    async function init() {
      const data = await loadVerbs();
      setVerbs(data);

      if (data.length === 0) return;

      const first = Math.floor(Math.random() * data.length);

      const randomTense =
        filter === "all"
          ? tenses[Math.floor(Math.random() * tenses.length)]
          : filter;

      setCurrentIndex(first);
      setVerb(data[first]);
      setTense(randomTense);
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

    const correct = verb.conjugations[tense];
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
    if (verbs.length === 0) return;

    let randomIndex = Math.floor(Math.random() * verbs.length);

    while (verbs.length > 1 && randomIndex === currentIndex) {
      randomIndex = Math.floor(Math.random() * verbs.length);
    }

    const randomTense =
      filter === "all"
        ? tenses[Math.floor(Math.random() * tenses.length)]
        : filter;

    setCurrentIndex(randomIndex);
    setVerb(verbs[randomIndex]);
    setTense(randomTense);

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
    <ScrollView 
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}    
      >

      {/* FILTRES */}
      <View style={styles.filters}>

        <TouchableOpacity
          onPress={() => setFilter("all")}
          style={[
            styles.filterBtn,
            { backgroundColor: filter === "all" ? "#007AFF" : colors.buttonBg },
          ]}
        >
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilter("presente")}
          style={[
            styles.filterBtn,
            { backgroundColor: filter === "presente" ? "#34C759" : colors.buttonBg },
          ]}
        >
          <Text style={styles.filterText}>Presente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilter("passado")}
          style={[
            styles.filterBtn,
            { backgroundColor: filter === "passado" ? "#34C759" : colors.buttonBg },
          ]}
        >
          <Text style={styles.filterText}>Passado</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilter("futuro")}
          style={[
            styles.filterBtn,
            { backgroundColor: filter === "futuro" ? "#34C759" : colors.buttonBg },
          ]}
        >
          <Text style={styles.filterText}>Futuro</Text>
        </TouchableOpacity>

      </View>

      {/* TITRE */}
      <Text style={[styles.title, { color: colors.text }]}>
        {capitalize(verb.infinitive)}
      </Text>

      <Text style={[styles.subtitle, { color: colors.subtitle }]}>
        {tenseLabels[tense]}
      </Text>

      {/* TABLE */}
      <View style={styles.table}>
        {pronouns.map((p) => (
          <View key={p.key} style={styles.row}>
            <Text style={[styles.pronoun, { color: colors.text }]}>
              {p.label}
            </Text>

            <TextInput
              ref={(ref) => {
                inputRefs.current[p.key] = ref;
              }}
              keyboardType="visible-password"
              style={[styles.input, { color: colors.text }]}
              value={answers[p.key]}
              onChangeText={(text) => handleChange(p.key, text)}
              autoCorrect={false}
              autoCapitalize="none"
              spellCheck={false}
              textContentType="none"
              autoComplete="off"
              returnKeyType="next"
              onSubmitEditing={() => {
                const order = ["eu", "tu", "ele", "nos", "eles"] as const;

                const currentIndex = order.indexOf(p.key);
                const nextKey = order[currentIndex + 1];

                if (nextKey) {
                  inputRefs.current[nextKey]?.focus();
                } else {
                  // dernier input → vérifier
                  checkAnswers();
                }
              }}
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
      <TouchableOpacity style={[styles.button, {backgroundColor: colors.buttonBg}]} onPress={checkAnswers}>
        <Text style={styles.buttonText}>Vérifier</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={next}
        style={[styles.button, { backgroundColor: colors.buttonBg }]}
      >
        <Text style={styles.buttonText}>Suivant</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/AllVerbs")}
        style={[styles.button, { backgroundColor: colors.buttonBg }]}
      >
        <Text style={styles.buttonText}>Tous les verbes</Text>
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

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    marginBottom: 20,
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

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  filterBtn: {
    padding: 10,
    borderRadius: 8,
  },

  filterText: {
    color: "white",
    fontWeight: "600",
  },
});