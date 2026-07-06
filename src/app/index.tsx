import { router } from "expo-router";
import { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from "react-native";
import { checkForUpdates } from "../services/update";


export default function Home() {
  useEffect(() => {
    checkForUpdates();
  }, []);

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
  
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            fontSize: 28,
            marginBottom: 20,
            color: colors.text,
            fontWeight: "700",
          }}
        >
          Portugais 🇵🇹
        </Text>

        {/* Ligne des deux boutons principaux */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={() => router.push("/portuguese-to-french")}
            style={[
              styles.button,
              { backgroundColor: colors.buttonBg, marginRight: 10 },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                { color: colors.text },
              ]}
            >
              🇵🇹 ➡️ 🇫🇷
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/french-to-portuguese")}
            style={[
              styles.button,
              { backgroundColor: colors.buttonBg },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                { color: colors.text },
              ]}
            >
              🇫🇷 ➡️ 🇵🇹
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bouton Daily Quiz */}
        <View
          style={{
            width: "90%",
            marginTop: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/dailyQuiz")}
            style={[
              styles.button,
              {
                backgroundColor: colors.buttonBg,
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                { color: colors.text },
              ]}
            >
              🎯 Daily Quiz
            </Text>
          </TouchableOpacity>

        {/* Bouton Verbes */}
          <View
          style={{
            width: "100%",
            marginTop: 15,
          }}
          >
          <TouchableOpacity
            onPress={() => router.push("/verbs")}
            style={[
              styles.button,
              {
                backgroundColor: colors.buttonBg,
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                { color: colors.text },
              ]}
            >
              📋 Verbes
            </Text>
          </TouchableOpacity>
          </View>
        
        {/* Bouton Suggestion */}
          <View
          style={{
            width: "100%",
            marginTop: 15,
          }}
          >
          <TouchableOpacity
            onPress={() => router.push("/suggestion-mots")}
            style={[
              styles.button,
              {
                backgroundColor: colors.buttonBg,
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                { color: colors.text },
              ]}
            >
              Suggestions
            </Text>
          </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 160,
    alignItems: "center",
  },

  buttonsRow: {
    flexDirection: "row",
    width: "90%",
    marginTop: 10,
  },

  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
});