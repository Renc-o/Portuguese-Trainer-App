import { useEffect, useState } from "react";
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

import { loadAll } from "../data/loadAll";
  type Word = {
  pt: string;
  fr: string;
  category: string;
};

export default function App() {
  // ✅ STATES OBLIGATOIRES
  const [data, setData] = useState<Word[]>([]);  
  const [shuffled, setShuffled] = useState<any[]>([]);
  const [category, setCategory] = useState("touslesmots");
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const check = () => {
    const user = input.trim().toLowerCase();
  const correct = (word.pt ?? "").toLowerCase();
  const diff = countDiff(user, correct);
    setResult(diff <= 1 ? "✅ Correct !" : `❌ Faux → ${word.pt}`);
      };
      const next = () => {
      setInput("");
      setResult(null);
      setIndex((prev) =>
        prev + 1 < shuffled.length ? prev + 1 : 0
      );
    };
  const categoryLabels = (() => {
    const labels: Record<string, string> = {
      touslesmots: "Tout",
      banquedemots: "Banque de Mots",
      corpshumain: "Corps Humain",
      nombresordinaux: "Nombres Ordinaux",
      physiquemoral: "Physique et Moral"
    };
    data.forEach((word) => {
      if (word.category && !labels[word.category]) {
        // transformation propre du texte
        labels[word.category] =
          word.category.charAt(0).toUpperCase() +
          word.category.slice(1);
      }
    });
  return labels;
  })();
  const categories = [
  "touslesmots",
  ...new Set((data ?? []).map((w) => w.category))
  ];

  // 🌗 mode sombre
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const colors = {
    background: isDark ? "#121212" : "#fff",
    text: isDark ? "#fff" : "#000",
    input: isDark ? "#2a2a2a" : "#fff",
    border: isDark ? "#444" : "#ccc",
    buttonBg: isDark ? "#2a2a2a" : "#e6e6e6"
  };

  // ✅ SHUFFLE DOIT ÊTRE DANS LE FICHIER
  function shuffle(array: any[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ✅ LOAD DATA
  useEffect(() => {
    const load = async () => {
      const result = await loadAll();
      setData(result);
      setShuffled(shuffle(result));
    };

    load();
  }, []);

  // ✅ CHANGE CATEGORY
  const changeCategory = (cat: string) => {
    setCategory(cat);

    const filtered =
      cat === "touslesmots"
        ? data
        : data.filter((w) => w.category === cat);

    setShuffled(shuffle(filtered));
    setIndex(0);
    setInput("");
    setResult(null);
  };

  const word = shuffled[index] ?? { fr: "", pt: ""};
  function countDiff(a: string, b: string) {
    let diff = 0;
    const len = Math.max(a.length, b.length);

    for (let i = 0; i < len; i++) {
      if (a[i] !== b[i]) diff++;
    }

    return diff;
  }

  return (
    <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: colors.background }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[styles.title, { color: colors.text }]}>
              🇫🇷 Français vers Portugais 🇵🇹
            </Text>
    
            {/* category */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((cat) => (
                <TouchableOpacity key={cat} onPress={() => changeCategory(cat)}>
                  <Text
                    style={
                      category === cat
                        ? [styles.active, { color: colors.text }]
                        : [styles.tab, { color: colors.text }]
                    }
                  >
                    {categoryLabels[cat] ?? cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
    
            {/* MOT */}
            <Text style={[styles.word, { color: colors.text }]}>
              {word.fr}
            </Text>
    
            {/* INPUT */}
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  color: colors.text,
                  borderColor: colors.border
                }
              ]}
              placeholder="Traduction"
              placeholderTextColor={isDark ? "#aaa" : "#666"}
              value={input}
              onChangeText={setInput}
            />
    
            {/* BOUTONS */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity onPress={check}
                style={[
                styles.button,
                { backgroundColor: colors.buttonBg }
                ]}>
                <Text style={[styles.buttonText, { color: colors.text }]}>
                Vérifier
                </Text>
              </TouchableOpacity>
    
              <TouchableOpacity onPress={next}
                style={[
                styles.button,
                { backgroundColor: colors.buttonBg }
                ]}>
                <Text style={[styles.buttonText, { color: colors.text }]}>
                Suivant
                </Text>
              </TouchableOpacity>
            </View>
    
            {/* RESULTAT */}
            {result && (
              <Text style={[styles.result, { color: colors.text }]}>
                {result}
              </Text>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
container: {
  padding: 20,
  paddingTop: 160,
  alignItems: "center"
},

  title: {
    fontSize: 28,
    marginBottom: 20
  },

  tab: {
    marginHorizontal: 10,
    marginBottom: 20,
    fontSize: 14,
    opacity: 0.6
  },

  active: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: "bold"
  },

  word: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20
  },

  input: {
    width: "90%",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },

  buttonsRow: {
    flexDirection: "row",
    width: "90%",
    marginTop: 10
  },

  button: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginRight: 5
  },

  next: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginLeft: 5
  },

  buttonText: {
    textAlign: "center"
  },

  result: {
    marginTop: 10,
    fontSize: 18
  }
});