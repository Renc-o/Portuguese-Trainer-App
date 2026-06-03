const VERSION_URL =
  "https://raw.githubusercontent.com/Renc-o/Portuguese-Trainer-App/refs/heads/main/src/data/version.json";

export async function checkForUpdates() {
  try {
    const response = await fetch(VERSION_URL);
    const remoteVersion = await response.json();

    const localVersion =
      localStorage.getItem("wordsVersion") || "0";

    if (remoteVersion.version !== localVersion) {
      await downloadWords();

      localStorage.setItem(
        "wordsVersion",
        remoteVersion.version
      );

      console.log("Vocabulaire mis à jour");
    }
  } catch (error) {
    console.error(error);
  }
}

async function downloadWords() {
  const response = await fetch(
    "https://raw.githubusercontent.com/toncompte/tonrepo/main/data/words.json"
  );

  const words = await response.json();

  localStorage.setItem(
    "words",
    JSON.stringify(words)
  );
}