// This file talks ONLY to your backend AI API

export const analyzePlant = async (base64Image) => {
  try {
    const res = await fetch("https://plant-disease-10.onrender.com/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: base64Image
      })
    });

    if (!res.ok) {
      throw new Error("Prediction failed");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};

// Google Maps (no API key needed)
export const findNearbyNurseries = (lat, lng) => {
  window.open(
    `https://www.google.com/maps/search/plant+nursery/@${lat},${lng},14z`,
    "_blank"
  );
};

// Text-to-speech (browser built-in)
export const speakReport = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  utterance.rate = 0.95;
  speechSynthesis.speak(utterance);
};
