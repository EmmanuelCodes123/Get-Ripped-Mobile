import { Audio } from "expo-av";

export type SoundType = "tick" | "bell" | "triple-bell";

export const configureAudioMode = async () => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
  } catch (e) {
    console.error("Failed to configure audio mode", e);
  }
};

export const playWorkoutSound = async (type: SoundType, isMuted: boolean) => {
  if (isMuted) return;

  try {
    // Map the actual file names directly
    let soundFile;
    switch (type) {
      case "tick":
        soundFile = require("../../assets/sounds/tick.mp3");
        break;
      case "bell":
        soundFile = require("../../assets/sounds/bell.mp3");
        break;
      case "triple-bell":
        soundFile = require("../../assets/sounds/triple-bell.mp3");
        break;
    }

    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();

    // Cleanup memory immediately after playback finishes
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error(`Error playing ${type} sound:`, error);
  }
};
