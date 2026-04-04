import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// --- 3D BACKGROUND ---
const Floating3DBackground = () => {
  const shapes = Array.from({ length: 15 });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-2xl opacity-30"
          style={{
            width: 120 + i * 10,
            height: 120 + i * 10,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background:
              i % 2 === 0
                ? "rgba(34,197,94,0.5)"
                : "rgba(59,130,246,0.4)",
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -120, 60, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 12 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
const ChakraBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-30"
          style={{
            width: 200 + i * 20,
            height: 200 + i * 20,
            background: "rgba(34,197,94,0.4)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
};

const TiltCard = ({ children, className = "" }) => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rx = useTransform(my, [-40, 40], [12, -12]);
  const ry = useTransform(mx, [-40, 40], [-12, 12]);

  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top - rect.height / 2;
    mx.set(px);
    my.set(py);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformStyle: "preserve-3d",
      }}
      className={`will-change-transform ${className}`}
    >
      <div style={{ transform: "translateZ(28px)" }}>{children}</div>
    </motion.div>
  );
};


const Home = () => {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const navigate = useNavigate();
  
  
  const videoRef = useRef(null);

    const isLowConfidence = result && result.confidence < 0.6;
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setImage(file);
      setResult(null);
    }
  };
  const startCamera = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  });

  videoRef.current.srcObject = stream;
  setIsCameraOn(true);
};

const captureFromCamera = () => {
  const canvas = document.createElement("canvas");
  canvas.width = videoRef.current.videoWidth;
  canvas.height = videoRef.current.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoRef.current, 0, 0);

  canvas.toBlob((blob) => {
    const file = new File([blob], "camera.jpg", { type: "image/jpeg" });
    setImage(file);
    setFileName("Live Capture");

    // 🔥 STOP CAMERA
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());

    setIsCameraOn(false);
  }, "image/jpeg");
};

const generateSmartWaterRecommendation = (
  plant,
  confidence,
  isHealthy,
  weather
) => {
  const plantWaterBase = {
    tomato: 0.7,
    potato: 0.6,
    rice: 1.2,
    wheat: 0.5,
    cotton: 0.8,
    default: 0.6,
  };

  const base = plantWaterBase[plant?.toLowerCase()] || plantWaterBase.default;

  let water = base;

  // 🌡 Temperature adjustment
  if (weather.temperature > 35) {
    water += 0.2;
  } else if (weather.temperature < 20) {
    water -= 0.1;
  }

  // 💧 Humidity adjustment
  if (weather.humidity > 80) {
    water -= 0.1;
  }

  // 🌧 Rain forecast
  if (weather.rain) {
    water = 0; // skip watering
  }

  // 🌿 Disease severity adjustment
  if (!isHealthy && confidence > 0.8) {
    water *= 0.7;
  }

  const perDay = water.toFixed(2);
  const perWeek = (water * 7).toFixed(2);

  return {
    perDayLiters: perDay,
    perWeekLiters: perWeek,
    notes:
      weather.rain
        ? "Rain expected. No watering needed today."
        : "Water adjusted based on weather conditions.",
  };
};

const generateIrrigationSchedule = (weather, isHealthy, confidence) => {
  if (weather.rain) {
    return "No irrigation today (Rain expected)";
  }

  if (!isHealthy && confidence > 0.8) {
    return "Irrigate lightly in the morning only";
  }

  if (weather.temperature > 35) {
    return "Irrigate twice: Early morning & Late evening";
  }

  return "Irrigate once in the early morning";
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
    // 1️⃣ Send image to AI prediction endpoint
    const response = await fetch("https://plant-disease-10.onrender.com/api/predict", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to analyze image");

    const data = await response.json();
const normalizedDisease = data.disease?.toLowerCase() || "";

const isHealthy =
  data.confidence > 0.6 &&
  (normalizedDisease === "healthy" ||
   normalizedDisease === "no disease" ||
   normalizedDisease === "none");

let weather = { temperature: 30, humidity: 60, rain: false };

try {
} catch (err) {
  console.log("Weather fetch failed, using default values");
}
    // setResult({ ...data, isHealthy });
    const waterRecommendation = generateSmartWaterRecommendation(
  data.plant,
  data.confidence,
  isHealthy,
  weather
);

const irrigationSchedule = generateIrrigationSchedule(
    weather,
    isHealthy,
    data.confidence
)

setResult({
  ...data,
  isHealthy,
  irrigationSchedule: generateIrrigationSchedule(
    data.weather || {},  // optional if you send weather from backend
    isHealthy,
    data.confidence
  )
});

    // 2️⃣ Save to database
    // Assuming your backend has /api/scans endpoint and user is logged in
    const token = localStorage.getItem("token"); // your auth token
    await fetch("https://plant-disease-10.onrender.com/api/scans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        imageUrl: data.imageUrl || URL.createObjectURL(image), // store uploaded image URL
        diagnosis: {
          plantName: data.plant,
          isHealthy,
          diseaseName: isHealthy ? null : data.disease,
          confidenceScore: data.confidence,
        },
      }),
    });

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
  Treatment ${(result.treatment || []).join(", ")}.
  `;

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-IN";
  speech.rate = 0.95;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
};

const getWeatherData = async (city) => {
  const API_KEY = "0723a3e6a4282df6cfb8fde8c90441f4";

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  const data = await response.json();

  return {
    temperature: data.main.temp,
    humidity: data.main.humidity,
    rain: data.rain ? true : false,
  };
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

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  } 
);
const downloadPDF = async () => {
  if (!result || !image) return;

  const pdf = new jsPDF();

  // Convert image to Base64
  const imgData = await toBase64(image);

  // Title
  pdf.setFontSize(18);
  pdf.text("Plant Disease Diagnosis Report", 14, 20);

  // Image
  pdf.addImage(
    imgData,
    "JPEG",     // works for JPG/PNG both
    14,
    28,
    60,
    60
  );

  // Text starts after image
  pdf.setFontSize(12);
  pdf.text(`Plant: ${result.plant}`, 80, 35);

  if (result.isHealthy) {
    pdf.text("Status: Healthy", 80, 45);
  } else {
    pdf.text(`Disease: ${result.disease}`, 80, 45);
  }

  pdf.text(
    `Confidence: ${(result.confidence * 100).toFixed(1)}%`,
    80,
    55
  );
  // Low confidence warning in PDF
if (result.confidence < 0.6) {
  pdf.setTextColor(180, 120, 0); // yellow/orange
  pdf.text(
    "⚠ Low AI Confidence: Result may be inaccurate due to unclear image.",
    80,
    65,
    { maxWidth: 110 }
  );
  pdf.setTextColor(0, 0, 0); // reset
}

  // Explanation
  pdf.text("Explanation:", 14, 100);
  pdf.text(result.explanation, 14, 110, { maxWidth: 180 });

  // Treatment & Prevention (only if diseased)
  let y = 140;

  if (!result.isHealthy) {
    pdf.text("Treatment:", 14, y);
    y += 10;
    result.treatment.forEach((t) => {
      pdf.text(`- ${t}`, 18, y);
      y += 8;
    });

    y += 5;
    pdf.text("Prevention:", 14, y);
    y += 10;
    result.prevention.forEach((p) => {
      pdf.text(`- ${p}`, 18, y);
      y += 8;
    });
  }

  pdf.save("plant_diagnosis_report.pdf");
};

const healthScore = result
  ? result.isHealthy
    ? Math.round(result.confidence * 100)
    : Math.round((1 - result.confidence) * 100)
  : 0;

const diseaseStats = result
  ? {
      Healthy: result.isHealthy
        ? Math.round(result.confidence * 100)
        : 0,
      Diseased: !result.isHealthy
        ? Math.round(result.confidence * 100)
        : 0,
    }
  : { Healthy: 0, Diseased: 0 };
const AICharacter = ({ result }) => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex items-end gap-3"
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Speech Bubble */}
      <motion.div
        className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg text-sm max-w-[200px]"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {result
          ? result.isHealthy
            ? "✅ This plant looks healthy!"
            : "⚠️ Disease detected, check solution!"
          : "👋 Upload a leaf, I'll analyze it!"}
      </motion.div>

      {/* Character */}
      <motion.div
        className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center text-2xl shadow-xl"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
        }}
      >
        🧑‍🌾
      </motion.div>
    </motion.div>
  );
};
  return (
    
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>      

<ChakraBackground/>
      
    <div className="relative max-w-xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
<motion.h2
  className="text-4xl font-extrabold text-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
  animate={{
    textShadow: [
      "0 0 5px #22c55e",
      "0 0 20px #22c55e",
      "0 0 5px #22c55e",
    ],
  }}
  transition={{ duration: 2, repeat: Infinity }}
>
  🌿 Plant AI Analyzer
</motion.h2>
        <p className="text-gray-500">
          Upload a leaf image and let AI analyze plant health
        </p>
      </div>

      {/* Upload */}
<TiltCard className="bg-white rounded-3xl border shadow-lg p-6 space-y-6">
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-8 text-center hover:bg-emerald-50 transition">
            <p className="font-semibold text-gray-700">
              Click to upload leaf image
            </p>
            <p className="text-xs text-gray-400">JPG, PNG</p>

            <input
              type="file"
              accept="image/*"
              capture= "environment"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </label>
{isCameraOn && (
  <div className="mt-4">
    <video
      ref={videoRef}
      autoPlay
      className="rounded-xl w-full"
    />
    <button
      onClick={captureFromCamera}
      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg"
    >
      Capture & Analyze
    </button>
  </div>
)}
        {image && (
          <div className="space-y-3">
<motion.img
  src={URL.createObjectURL(image)}
  alt="Preview"
  className="rounded-xl max-h-64 mx-auto"
  initial={{ opacity: 0, y: 10, rotateX: 8 }}
  animate={{ opacity: 1, y: 0, rotateX: 0 }}
  whileHover={{ scale: 1.03, rotateZ: 0.7 }}
  transition={{  type: "spring", stiffness: 180, damping: 16 }}
/>
            <p className="text-center text-sm text-gray-600">
              📷 {fileName}
            </p>
          </div>
        )}
      </TiltCard>

      {/* Analyze Button */}
<motion.button
  onClick={handleAnalyze}
  whileHover={{
    scale: 1.05,
    boxShadow: "0px 0px 20px #22c55e",
  }}
  whileTap={{ scale: 0.95 }}
  className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-700 text-white"
>
  Analyze Plant ⚡
</motion.button>
{loading && (
  <motion.div className="flex justify-center items-center mt-4">
    <motion.div
      className="w-12 h-12 rounded-full border-4 border-red-600 border-t-transparent"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
  </motion.div>
)}

      {/* Result */}
{result?.notPlant && (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
    ❌ <strong>Please provide a clear plant leaf image</strong>
  </div>
)}

{result && !result.notPlant && (
  <motion.div
  initial={{ opacity: 0, y:18, rotateX: 10}}
  animate={{ opacity: 1, y:0,  rotateX: 0}}
  transition={{ type: "spring", stiffness: 160, damping: 18}}>

<TiltCard className="bg-white/30 backdrop-blur-lg rounded-xl p-5 border border-white/40 shadow-xl space-y-3">  
<div className="bg-gray-50 rounded-xl p-5 border space-y-3">
    <h3 className="font-bold text-xl text-emerald-700">
      🌱 {result.plant}
    </h3>

{result.isHealthy ? (
  <p className="text-green-700 font-semibold">
    ✅ Plant is Healthy
  </p>
) : (
  <p className="text-red-600">
    <strong>Disease:</strong> {result.disease}
  </p>
)}
<p>
  <strong>Confidence:</strong>{" "}
  {(result.confidence * 100).toFixed(1)}%
  <span
    className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
      result.confidence >= 0.6
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {result.confidence >= 0.6 ? "Reliable" : "Low"}
  </span>
</p>

    <p className="text-gray-700">
      <strong>Explanation:</strong> {result.explanation}
    </p>

    {result?.waterRecommendation && (
<motion.div
  className="mt-4 bg-blue-50 p-3 rounded-lg"
  animate={{ y: [0, -5, 0] }}
  transition={{ repeat: Infinity, duration: 2 }}
>    <h4 className="font-semibold">💧 Water Recommendation</h4>
<p>
  Per Day: {result?.waterRecommendation?.perDayLiters || 0} liters
</p>
<p>
  Per Week: {result?.waterRecommendation?.perWeekLiters || 0} liters
</p>
<p className="text-sm text-gray-600">
  {result?.waterRecommendation?.notes || "No recommendation available"}
</p>
  </motion.div>
)}
{result.irrigationSchedule && (
  <div className="mt-4 bg-green-50 p-3 rounded-lg">
    <h4 className="font-semibold">📅 Irrigation Schedule</h4>
    <p>{result.irrigationSchedule}</p>
  </div>
)}
{!result.isHealthy && (
  <div>
    <strong>Treatment:</strong>
    <ul className="list-disc ml-6 text-sm space-y-2">
      {result.treatment.map((t, i) => {
        const links = getStoreLinks(t);
        return (
          <li key={i}>
            {t}
            <div className="flex gap-3 mt-1 text-xs">
              <a href={links.amazon} target="_blank" className="text-blue-600 underline">
                Amazon
              </a>
              <a href={links.flipkart} target="_blank" className="text-pink-600 underline">
                Flipkart
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
)}
{!result.isHealthy && (
  <div>
    <strong>Prevention:</strong>
    <ul className="list-disc ml-6 text-sm">
      {result.prevention.map((p, i) => (
        <li key={i}>{p}</li>
      ))}
    </ul>
  </div>
)}
<div className="mt-4">
  <p className="font-semibold text-sm text-gray-700">
    🌱 Health Score: {healthScore}/100
  </p>
  <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
    <div
      className={`h-4 rounded-full transition-all ${
        healthScore > 70
          ? "bg-green-500"
          : healthScore > 40
          ? "bg-yellow-400"
          : "bg-red-500"
      }`}
      style={{ width: `${healthScore}%` }}
    />
  </div>
  <div className="mt-6">
  <h4 className="font-bold text-sm mb-2">📊 Disease Analytics</h4>

<div>
  Healthy
  <div className="bg-gray-200 h-3 rounded">
    <div
      className="bg-green-500 h-3 rounded"
      style={{ width: `${diseaseStats.Healthy}%` }}
    />
  </div>
</div>
<div>
  Diseased
  <div className="bg-gray-200 h-3 rounded">
    <div
      className="bg-red-500 h-3 rounded"
      style={{ width: `${diseaseStats.Diseased}%` }}
    />
  </div>
</div>
</div>
{isLowConfidence && (
  <div className="mt-3 bg-yellow-50 border border-yellow-300 text-yellow-800 p-3 rounded-lg text-sm">
    ⚠️ <strong>Low AI Confidence</strong>
    <p className="mt-1">
      The uploaded image may be unclear. For better results:
    </p>
    <ul className="list-disc ml-5 mt-1">
      <li>Use good lighting</li>
      <li>Capture a single leaf</li>
      <li>Take a close-up image</li>
    </ul>
  </div>
)}
</div>
    <motion.button
  onClick={speakResult}
  // className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
  className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl"
>
  🔊 Listen Diagnosis
</motion.button>
<br className="display: flex flex-direction: row;"></br>
<motion.button
  onClick={openMaps}
  // className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
  className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl"
>
  🗺️ Find Nearby Plant Stores
</motion.button>
<br />
<motion.button
  onClick={downloadPDF}
  // className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
  className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl"
>
  📄 Download Report (PDF)
</motion.button>
  </div>
  </TiltCard>
  </motion.div>
)}
        {/* Footer Note */}
        <footer className="mt-6">
      <p className="text-center text-xs text-gray-400">
        🔒 Image processed securely and not stored
      </p>
    </footer>
  </div>
  <AICharacter result={result} />
  </motion.div>
);
};

export default Home;
