import React, { useState } from "react";
import jsPDF from "jspdf";

const Home = () => {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setImage(file);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:2000/api/predict", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error(error);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };
  const speakResult = () => {
  if (!result) return;

  const text = `
  Plant ${result.plant}.
  Disease ${result.disease}.
  Confidence ${(result.confidence * 100).toFixed(1)} percent.
  Explanation ${result.explanation}.
  Treatment ${result.treatment.join(", ")}.
  `;

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-IN";
  speech.rate = 0.95;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
};

const getStoreLinks = (item) => ({
  amazon: `https://www.amazon.in/s?k=${encodeURIComponent(item)}`,
  flipkart: `https://www.flipkart.com/search?q=${encodeURIComponent(item)}`
});

const openMaps = () => {
  const query = `${result.disease} plant medicine store near me`;
  const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
  window.open(url, "_blank");
};

const downloadPDF = () => {
  if (!result) return;

  const pdf = new jsPDF();
  pdf.setFontSize(18);
  pdf.text("Plant Disease Diagnosis Report", 14, 20);

  pdf.setFontSize(12);
  pdf.text(`Plant: ${result.plant}`, 14, 35);
  pdf.text(`Disease: ${result.disease}`, 14, 45);
  pdf.text(`Confidence: ${(result.confidence * 100).toFixed(1)}%`, 14, 55);

  pdf.text("Explanation:", 14, 70);
  pdf.text(result.explanation, 14, 80, { maxWidth: 180 });

  pdf.text("Treatment:", 14, 110);
  result.treatment.forEach((t, i) => {
    pdf.text(`- ${t}`, 18, 120 + i * 8);
  });

  pdf.text("Prevention:", 14, 150);
  result.prevention.forEach((p, i) => {
    pdf.text(`- ${p}`, 18, 160 + i * 8);
  });

  pdf.save("plant_diagnosis_report.pdf");
};
  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Plant Disease Detection 🌿
        </h2>
        <p className="text-gray-500">
          Upload a leaf image and let AI analyze plant health
        </p>
      </div>

      {/* Upload */}
      <div className="bg-white rounded-3xl border shadow-lg p-6 space-y-6">
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-8 text-center hover:bg-emerald-50 transition">
            <p className="font-semibold text-gray-700">
              Click to upload leaf image
            </p>
            <p className="text-xs text-gray-400">JPG, PNG</p>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </label>

        {image && (
          <div className="space-y-3">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="rounded-xl max-h-64 mx-auto"
            />
            <p className="text-center text-sm text-gray-600">
              📷 {fileName}
            </p>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!image || loading}
        className={`w-full py-4 rounded-2xl font-bold transition ${
          image
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "bg-gray-200 text-gray-400"
        }`}
      >
        {loading ? "Analyzing with AI..." : "Analyze Plant"}
      </button>

      {/* Result */}
{result?.notPlant && (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
    ❌ <strong>Please provide a clear plant leaf image</strong>
  </div>
)}

{result && !result.notPlant && (
  <div className="bg-gray-50 rounded-xl p-5 border space-y-3">
    <h3 className="font-bold text-xl text-emerald-700">
      🌱 {result.plant}
    </h3>

    <p>
      <strong>Disease:</strong> {result.disease}
    </p>

    <p>
      <strong>Confidence:</strong>{" "}
      {(result.confidence * 100).toFixed(1)}%
    </p>

    <p className="text-gray-700">
      <strong>Explanation:</strong> {result.explanation}
    </p>

<div>
  <strong>Treatment:</strong>
  <ul className="list-disc ml-6 text-sm space-y-2">
    {Array.isArray(result.treatment) &&
      result.treatment.map((t, i) => {
        const links = getStoreLinks(t);
        return (
          <li key={i}>
            {t}
            <div className="flex gap-3 mt-1 text-xs">
              <a
                href={links.amazon}
                target="_blank"
                className="text-blue-600 underline"
              >
                Amazon
              </a>
              <a
                href={links.flipkart}
                target="_blank"
                className="text-pink-600 underline"
              >
                Flipkart
              </a>
            </div>
          </li>
        );
      })}
  </ul>
</div>
    <div>
      <strong>Prevention:</strong>
      <ul className="list-disc ml-6 text-sm">
        {result.prevention.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
    <button
  onClick={speakResult}
  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
>
  🔊 Listen Diagnosis
</button>
<button
  onClick={openMaps}
  className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
>
  🗺️ Find Nearby Plant Stores
</button>
<button
  onClick={downloadPDF}
  className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
>
  📄 Download Report (PDF)
</button>
  </div>
  
)}

        {/* Footer Note */}
        <footer className="mt-6">
      <p className="text-center text-xs text-gray-400">
        🔒 Image processed securely and not stored
      </p>
    </footer>
  </div>
);
};

export default Home;
