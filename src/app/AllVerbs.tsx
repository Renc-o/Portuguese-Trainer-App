import { ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from "react-native";

import { useEffect, useState } from "react";
import { loadVerbs, Verb } from "../data/loadVerbs";

const pronouns = [
  { key: "eu", label: "Eu" },
  { key: "tu", label: "Tu" },
  { key: "ele", label: "Ele / Ela / Você" },
  { key: "nos", label: "Nós" },
  { key: "eles", label: "Eles / Elas / Vocês" },
] as const;

export default function AllVerbs() {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [search, setSearch] = useState("");
    const filteredVerbs = verbs
    .filter((verb) =>
        verb.infinitive.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.infinitive.localeCompare(b.infinitive));
    useEffect(() => {
        loadVerbs().then(setVerbs);
    }, []);

  const isDark = useColorScheme() === "dark";

  const colors = {
    background: isDark ? "#121212" : "#fff",
    text: isDark ? "#fff" : "#000",
    card: isDark ? "#1f1f1f" : "#f5f5f5",
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
        <TextInput
            placeholder="Rechercher un verbe..."
            placeholderTextColor={isDark ? "#888" : "#666"}
            value={search}
            onChangeText={setSearch}
            style={[
                styles.searchInput,
                {
                color: colors.text,
                backgroundColor: colors.card,
                borderColor: "#888",
                },
            ]}
            />
      {filteredVerbs.map((verb) => (
        <View key={verb.infinitive} style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            {verb.infinitive}
          </Text>

          {Object.entries(verb.conjugations).map(([tense, conjugation]) => (
            <View key={tense} style={{ marginTop: 15 }}>
              <Text style={styles.tense}>{tense.toUpperCase()}</Text>

              {pronouns.map((p) => (
                <View key={p.key} style={styles.row}>
                  <Text style={[styles.pronoun, { color: colors.text }]}>
                    {p.label}
                  </Text>

                  <Text style={{ color: colors.text }}>
                    {conjugation[p.key]}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tense: {
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  pronoun: {
    fontWeight: "600",
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
    },
});