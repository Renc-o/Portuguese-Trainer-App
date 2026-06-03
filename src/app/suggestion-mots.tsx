import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
} from "react-native";

type Word = {
  pt: string;
  fr: string;
  category: string;
};

type Suggestion = Word;

export async function getSuggestions(): Promise<Suggestion[]> {
  const data = await AsyncStorage.getItem("suggestions");
  return data ? JSON.parse(data) : [];
}

export default function SuggestionScreen() {
  const [data, setData] = useState<Word[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("touslesmots");

  const [inputPt, setInputPt] = useState("");
  const [inputFr, setInputFr] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const colors = {
    background: isDark ? "#121212" : "#fff",
    text: isDark ? "#fff" : "#000",
    input: isDark ? "#2a2a2a" : "#fff",
    buttonBg: isDark ? "#2a2a2a" : "#e6e6e6"
  };

  // LOAD WORDS (pour récupérer catégories)
  useEffect(() => {
    const load = async () => {
      const res = await fetch(
        "https://raw.githubusercontent.com/Renc-o/Portuguese-Trainer-App/main/src/data/words.json"
      );
      const json = await res.json();
      setData(json);
    };

    load();
  }, []);

  const categories = [
    "touslesmots",
    ...Array.from(new Set(data.map((w) => w.category)))
  ];

  const categoryLabels: Record<string, string> = {
    touslesmots: "Tout"
  };

  data.forEach((w) => {
    if (w.category && !categoryLabels[w.category]) {
      categoryLabels[w.category] =
        w.category.charAt(0).toUpperCase() + w.category.slice(1);
    }
  });

  async function addSuggestion() {
    const newSuggestion: Suggestion = {
      pt: inputPt,
      fr: inputFr,
      category: selectedCategory
    };

    const existing = await AsyncStorage.getItem("suggestions");
    const list = existing ? JSON.parse(existing) : [];

    const updated = [...list, newSuggestion];

    await AsyncStorage.setItem("suggestions", JSON.stringify(updated));

    setSuccessMessage("✅ Suggestion envoyée !");

    setInputPt("");
    setInputFr("");

    setTimeout(() => setSuccessMessage(""), 2000);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Suggestions de mots ✍️
      </Text>

      <TextInput
        placeholder="Portugais"
        placeholderTextColor="#888"
        value={inputPt}
        onChangeText={setInputPt}
        style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
      />

      <TextInput
        placeholder="Français"
        placeholderTextColor="#888"
        value={inputFr}
        onChangeText={setInputFr}
        style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
      />

      <Picker
        selectedValue={selectedCategory}
        onValueChange={(v) => setSelectedCategory(v)}
        style={{ color: colors.text, width: "100%", backgroundColor: colors.buttonBg }}
      >
        {categories.map((cat) => (
          <Picker.Item
            key={cat}
            label={categoryLabels[cat] ?? cat}
            value={cat}
          />
        ))}
      </Picker>

      <TouchableOpacity onPress={addSuggestion} style={styles.button}>
        <Text style={{ color: "white" }}>Envoyer</Text>
      </TouchableOpacity>

      {successMessage ? (
        <Text style={{ color: "green", marginTop: 10 }}>
          {successMessage}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 120
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8
  },
  button: {
    backgroundColor: "#2a2a2a",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10
  }
});