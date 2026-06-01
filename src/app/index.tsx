import { router } from "expo-router";
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

export default function Home() {

    // 🌗 MODE SOMBRE AUTO
    const scheme = useColorScheme();
    const isDark = scheme === "dark";

    const colors = {
    background: isDark ? "#121212" : "#ffffff",
    text: isDark ? "#ffffff" : "#000000",
    card: isDark ? "#1e1e1e" : "#f2f2f2",
    input: isDark ? "#2a2a2a" : "#ffffff",
    border: isDark ? "#444" : "#ccc",
    button: isDark ? "#444" : "#ccc",
    buttonBg: isDark ? "#2a2a2a" : "#e6e6e6"
    };

    return (
    <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: colors.background }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
        <ScrollView
                contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
                keyboardShouldPersistTaps="handled"
        >
            <Text
            style={{
                fontSize: 28,
                marginBottom: 20,
                color: colors.text,
            }}
            >
            Portugais 🇵🇹
            </Text>
    <View
      style={{
        flexDirection: "row",
        width: "90%",
        marginTop: 1,
      }}
    >
      <TouchableOpacity
        onPress={() => router.push("/portuguese-to-french")}
        style={{
            flex: 1,
            padding: 12,
            borderRadius: 100,
            marginRight: 10, 
            backgroundColor: colors.buttonBg
      }}>
        <Text
            style={{
                fontSize: 28,
                color: colors.text,
                fontWeight: "600",
                textAlign: "center"
            }}
            >
            🇵🇹 ➡️ 🇫🇷
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
            onPress={() => router.push("/french-to-portuguese")}
            style={{
            flex: 1,
            padding: 12,
            borderRadius: 100,
            marginRight: 10, 
            backgroundColor: colors.buttonBg
      }}>
        <Text
            style={{
                fontSize: 28,
                color: colors.text,
                fontWeight: "600",
                textAlign: "center"
            }}
            >
            🇫🇷 ➡️ 🇵🇹
        </Text>
    </TouchableOpacity>
    </View>
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

    buttonsRow: {
        flexDirection: "row",
        width: "90%",
        marginTop: 10
    },
});