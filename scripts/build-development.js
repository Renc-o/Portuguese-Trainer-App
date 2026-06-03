const { execSync } = require("child_process");

try {
  console.log("🚀 Lancement du build Android (development)...");

  execSync(
    "eas build --platform android --profile development",
    { stdio: "inherit" }
  );

  console.log("✅ Build lancé avec succès !");
} catch (error) {
  console.error("❌ Erreur pendant le build :", error.message);
  process.exit(1);
}