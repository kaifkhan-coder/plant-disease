// import React, { useState, useEffect, useRef } from "react";
// import jsPDF from "jspdf";
// import { useNavigate } from "react-router-dom";
// import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

// // --- ANIME & CYBERPUNK BACKGROUND (Neo-Tokyo / Sandevistan Vibe) ---
// const AnimeCyberBackground = () => {
//   const petals = Array.from({ length: 25 });
//   const orbs = Array.from({ length: 10 });

//   return (
//     <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#050505]">
//       {/* Cyberspace Grid */}
//       <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom opacity-30" />

//       {/* Floating Data Orbs */}
//       {orbs.map((_, i) => (
//         <motion.div
//           key={`orb-${i}`}
//           className="absolute rounded-full blur-[40px] opacity-40"
//           style={{
//             width: 150 + i * 20,
//             height: 150 + i * 20,
//             left: `${Math.random() * 100}%`,
//             top: `${Math.random() * 100}%`,
//             background: i % 2 === 0 ? "rgba(236, 72, 153, 0.3)" : "rgba(6, 182, 212, 0.3)", // Hot Pink & Cyan
//           }}
//           animate={{
//             x: [0, 100, -50, 0],
//             y: [0, -120, 60, 0],
//             scale: [1, 1.2, 1],
//           }}
//           transition={{
//             duration: 15 + i * 2,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />
//       ))}

//       {/* Falling Sakura Petals (Anime Touch) */}
//       {petals.map((_, i) => (
//         <motion.div
//           key={`petal-${i}`}
//           className="absolute bg-pink-400/40"
//           style={{
//             width: Math.random() * 12 + 6,
//             height: Math.random() * 8 + 4,
//             borderRadius: "50% 0 50% 0", // Sakura petal shape
//             left: `${Math.random() * 100}%`,
//             top: "-5%",
//             boxShadow: "0 0 10px rgba(244, 114, 182, 0.5)",
//           }}
//           animate={{
//             y: ["0vh", "110vh"],
//             x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
//             rotate: [0, 360, 720],
//           }}
//           transition={{
//             duration: Math.random() * 5 + 7,
//             repeat: Infinity,
//             ease: "linear",
//             delay: Math.random() * 5,
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// // Kiroshi Optics active! 3D Tilt Card
// const TiltCard = ({ children, className = "" }) => {
//   const mx = useMotionValue(0);
//   const my = useMotionValue(0);

//   const rx = useTransform(my, [-40, 40], [8, -8]);
//   const ry = useTransform(mx, [-40, 40], [-8, 8]);

//   const srx = useSpring(rx, { stiffness: 150, damping: 20 });
//   const sry = useSpring(ry, { stiffness: 150, damping: 20 });

//   const onMove = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const px = e.clientX - rect.left - rect.width / 2;
//     const py = e.clientY - rect.top - rect.height / 2;
//     mx.set(px);
//     my.set(py);
//   };

//   const onLeave = () => {
//     mx.set(0);
//     my.set(0);
//   };

//   return (
//     <motion.div
//       onMouseMove={onMove}
//       onMouseLeave={onLeave}
//       style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
//       className={`will-change-transform ${className}`}
//     >
//       <div style={{ transform: "translateZ(30px)" }}>{children}</div>
//     </motion.div>
//   );
// };

// const Home = () => {
//   const [image, setImage] = useState(null);
//   const [fileName, setFileName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [isCameraOn, setIsCameraOn] = useState(false);
//   const navigate = useNavigate();
//   const videoRef = useRef(null);

//   const isLowConfidence = result && result.confidence < 0.6;

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFileName(file.name);
//       setImage(file);
//       setResult(null);
//     }
//   };

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "environment" },
//       });
//       videoRef.current.srcObject = stream;
//       setIsCameraOn(true);
//     } catch (err) {
//       alert("Camera access denied or unavailable. Maelstrom interference!");
//     }
//   };

//   const captureFromCamera = () => {
//     const canvas = document.createElement("canvas");
//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(videoRef.current, 0, 0);

//     canvas.toBlob((blob) => {
//       const file = new File([blob], "camera.jpg", { type: "image/jpeg" });
//       setImage(file);
//       setFileName("Live Capture (Kiroshi)");

//       const stream = videoRef.current.srcObject;
//       const tracks = stream.getTracks();
//       tracks.forEach((track) => track.stop());
//       setIsCameraOn(false);
//     }, "image/jpeg");
//   };

//   const generateSmartWaterRecommendation = (plant, confidence, isHealthy, weather) => {
//     const plantWaterBase = {
//       tomato: 0.7, potato: 0.6, rice: 1.2, wheat: 0.5, cotton: 0.8, default: 0.6,
//     };
//     const base = plantWaterBase[plant?.toLowerCase()] || plantWaterBase.default;
//     let water = base;

//     if (weather.temperature > 35) water += 0.2;
//     else if (weather.temperature < 20) water -= 0.1;
//     if (weather.humidity > 80) water -= 0.1;
//     if (weather.rain) water = 0;
//     if (!isHealthy && confidence > 0.8) water *= 0.7;

//     return {
//       perDayLiters: water.toFixed(2),
//       perWeekLiters: (water * 7).toFixed(2),
//       notes: weather.rain
//         ? "Acid rain expected in Neo-Tokyo. No watering needed today."
//         : "Water adjusted based on current atmospheric conditions.",
//     };
//   };

//   const generateIrrigationSchedule = (weather, isHealthy, confidence) => {
//     if (weather.rain) return "No irrigation today (Acid storms expected)";
//     if (!isHealthy && confidence > 0.8) return "Irrigate lightly in the morning only";
//     if (weather.temperature > 35) return "Irrigate twice: Early morning & Late evening";
//     return "Irrigate once in the early morning";
//   };

//   const handleAnalyze = async () => {
//     if (!image) {
//       alert("You lack an image, Choom. Please select one! Nova!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", image);
//     setLoading(true);

//     try {
//       const response = await fetch("https://plant-disease-10.onrender.com/api/predict", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Failed to analyze image. NetWatch ICE detected!");

//       const data = await response.json();
//       const normalizedDisease = data.disease?.toLowerCase() || "";
//       const isHealthy =
//         data.confidence > 0.6 &&
//         (normalizedDisease === "healthy" || normalizedDisease === "no disease" || normalizedDisease === "none");

//       let weather = { temperature: 30, humidity: 60, rain: false };
      
//       setResult({
//         ...data,
//         isHealthy,
//         waterRecommendation: generateSmartWaterRecommendation(data.plant, data.confidence, isHealthy, weather),
//         irrigationSchedule: generateIrrigationSchedule(weather, isHealthy, data.confidence),
//       });

//       const token = localStorage.getItem("token");
//       if (token) {
//         await fetch("https://plant-disease-10.onrender.com/api/scans", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             imageUrl: data.imageUrl || URL.createObjectURL(image),
//             diagnosis: {
//               plantName: data.plant,
//               isHealthy,
//               diseaseName: isHealthy ? null : data.disease,
//               confidenceScore: data.confidence,
//             },
//           }),
//         });
//       }
//     } catch (error) {
//       console.error("Blackwall breach detected! Error:", error);
//       alert("Prediction failed. Maelstrom gangers must be interfering.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const speakResult = () => {
//     if (!result) return;
//     const text = `Plant ${result.plant}. Disease ${result.disease}. Confidence ${(result.confidence * 100).toFixed(1)} percent. Explanation ${result.explanation}. Treatment ${(result.treatment || []).join(", ")}.`;
//     const speech = new SpeechSynthesisUtterance(text);
//     speech.lang = "en-IN";
//     speech.rate = 0.95;
//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(speech);
//   };

//   const getStoreLinks = (item) => ({
//     amazon: `https://www.amazon.in/s?k=${encodeURIComponent(item)}`,
//     flipkart: `https://www.flipkart.com/search?q=${encodeURIComponent(item)}`,
//   });

//   const openMaps = () => {
//     const query = `${result.disease} plant medicine store near me`;
//     const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
//     window.open(url, "_blank");
//   };

//   const toBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });

//   const downloadPDF = async () => {
//     if (!result || !image) return;
//     const pdf = new jsPDF();
//     const imgData = await toBase64(image);

//     pdf.setFontSize(18);
//     pdf.text("Neo-Tokyo Plant Diagnosis Shard", 14, 20);
//     pdf.addImage(imgData, "JPEG", 14, 28, 60, 60);
//     pdf.setFontSize(12);
//     pdf.text(`Plant: ${result.plant}`, 80, 35);

//     if (result.isHealthy) {
//       pdf.text("Status: Healthy (Chrome is preem!)", 80, 45);
//     } else {
//       pdf.text(`Disease: ${result.disease}`, 80, 45);
//     }

//     pdf.text(`Confidence: ${(result.confidence * 100).toFixed(1)}%`, 80, 55);

//     if (result.confidence < 0.6) {
//       pdf.setTextColor(180, 120, 0);
//       pdf.text("⚠ Low AI Confidence: Scan blurry. Result may be a braindance hallucination.", 80, 65, { maxWidth: 110 });
//       pdf.setTextColor(0, 0, 0);
//     }

//     pdf.text("Gig Details (Explanation):", 14, 100);
//     pdf.text(result.explanation, 14, 110, { maxWidth: 180 });

//     let y = 140;
//     if (!result.isHealthy) {
//       pdf.text("Ripperdoc Treatment:", 14, y);
//       y += 10;
//       result.treatment.forEach((t) => {
//         pdf.text(`- ${t}`, 18, y);
//         y += 8;
//       });
//       y += 5;
//       pdf.text("Cyberware Defense (Prevention):", 14, y);
//       y += 10;
//       result.prevention.forEach((p) => {
//         pdf.text(`- ${p}`, 18, y);
//         y += 8;
//       });
//     }
//     pdf.save("neo_tokyo_plant_diagnosis.pdf");
//   };

//   const healthScore = result
//     ? result.isHealthy
//       ? Math.round(result.confidence * 100)
//       : Math.round((1 - result.confidence) * 100)
//     : 0;

//   const diseaseStats = result
//     ? {
//         Healthy: result.isHealthy ? Math.round(result.confidence * 100) : 0,
//         Diseased: !result.isHealthy ? Math.round(result.confidence * 100) : 0,
//       }
//     : { Healthy: 0, Diseased: 0 };

//   const AICharacter = ({ result }) => {
//     return (
//       <motion.div
//         className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 flex items-end gap-3 pointer-events-none"
//         initial={{ opacity: 0, x: 80 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
//       >
//         <motion.div
//           className="bg-zinc-900/90 backdrop-blur-md border-2 border-cyan-400 px-4 py-3 rounded-2xl rounded-br-none shadow-[0_0_15px_rgba(6,182,212,0.5)] text-xs sm:text-sm max-w-[180px] sm:max-w-[220px] text-cyan-50"
//           animate={{ y: [0, -5, 0] }}
//           transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
//         >
//           {result
//             ? result.isHealthy
//               ? "✨ This plant's chrome is preem! Max vitality!"
//               : "⚠️ Cyberpsychosis detected! Trauma Team required!"
//             : "👋 Upload a leaf shard, I'll analyze its neural network!"}
//         </motion.div>

//         <motion.div
//           className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-pink-500 bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center text-2xl sm:text-3xl shadow-[0_0_20px_rgba(236,72,153,0.6)] overflow-hidden"
//           animate={{ y: [0, -10, 0] }}
//           transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
//         >
//           <span className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">🦊</span>
//         </motion.div>
//       </motion.div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans relative overflow-x-hidden pb-24">
//       <AnimeCyberBackground />

//       <motion.div
//         className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 space-y-8"
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//       >
//         {/* Header */}
//         <div className="text-center space-y-3">
//           <motion.h2
//             className="text-3xl sm:text-5xl font-black text-center uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400"
//             animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
//             transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
//             style={{ backgroundSize: "200% auto" }}
//           >
//             Plant AI
//           </motion.h2>
//           <p className="text-zinc-400 text-sm sm:text-base font-medium tracking-wide">
//             UPLOAD LEAF SHARD // INITIATE NEURAL SCAN
//           </p>
//         </div>

//         {/* Upload Section */}
//         <TiltCard className="bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-zinc-700 shadow-[0_0_30px_rgba(0,0,0,0.5)] p-4 sm:p-8 space-y-6">
//           <label className="block cursor-pointer group">
//             <div className="border-2 border-dashed border-cyan-500/50 rounded-xl p-8 sm:p-12 text-center transition-all duration-300 group-hover:bg-cyan-500/10 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
//               <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">💾</div>
//               <p className="font-bold text-cyan-400 tracking-wide uppercase text-sm sm:text-base">
//                 Slot a Shard (Upload Image)
//               </p>
//               <p className="text-xs text-zinc-500 mt-2">JPG, PNG ACCEPTED</p>
//               <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
//             </div>
//           </label>

//           <div className="flex justify-center">
//             <button
//               onClick={startCamera}
//               className="text-xs sm:text-sm font-bold text-pink-400 border border-pink-500/50 px-4 py-2 rounded-lg hover:bg-pink-500/20 transition-colors uppercase tracking-widest"
//             >
//               [ Activate Kiroshi Optics ]
//             </button>
//           </div>

//           <AnimatePresence>
//             {isCameraOn && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="mt-4 flex flex-col items-center"
//               >
//                 <div className="relative w-full rounded-xl overflow-hidden border-2 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]">
//                   <video ref={videoRef} autoPlay className="w-full aspect-video object-cover" />
//                   <div className="absolute inset-0 pointer-events-none border-[4px] border-pink-500/30 m-4 rounded-lg" />
//                   <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-pink-400" />
//                   <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-pink-400" />
//                   <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-pink-400" />
//                   <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-pink-400" />
//                 </div>
//                 <button
//                   onClick={captureFromCamera}
//                   className="mt-4 px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg uppercase tracking-wider shadow-[0_0_15px_rgba(236,72,153,0.6)] transition-all active:scale-95"
//                 >
//                   Capture Frame
//                 </button>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {image && (
//             <motion.div className="space-y-3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
//               <div className="relative w-full max-w-xs mx-auto">
//                 <img
//                   src={URL.createObjectURL(image)}
//                   alt="Preview"
//                   className="rounded-xl border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] w-full object-cover"
//                 />
//                 <div className="absolute -bottom-3 -right-3 bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase">
//                   Ready
//                 </div>
//               </div>
//               <p className="text-center text-xs text-cyan-300 font-mono truncate px-4">
//                 FILE: {fileName}
//               </p>
//             </motion.div>
//           )}
//         </TiltCard>

//         {/* Analyze Button */}
//         <motion.button
//           onClick={handleAnalyze}
//           whileHover={{ scale: 1.02, boxShadow: "0px 0px 25px rgba(250, 204, 21, 0.6)" }}
//           whileTap={{ scale: 0.95 }}
//           className="w-full py-4 sm:py-5 rounded-xl font-black text-lg sm:text-xl bg-yellow-400 text-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(250,204,21,0.4)] relative overflow-hidden group"
//         >
//           <span className="relative z-10">Jack In & Analyze ⚡</span>
//           <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
//         </motion.button>

//         {/* Loading State */}
//         {loading && (
//           <motion.div className="flex flex-col justify-center items-center mt-8 space-y-4">
//             <motion.div
//               className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-cyan-400 border-r-pink-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
//               animate={{ rotate: 360 }}
//               transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//             />
//             <p className="text-cyan-400 font-mono text-sm animate-pulse">BYPASSING ICE... ANALYZING SHARD...</p>
//           </motion.div>
//         )}

//         {/* Result Not Plant */}
//         {result?.notPlant && (
//           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-900/40 border-2 border-red-500 rounded-xl p-6 text-center shadow-[0_0_20px_rgba(239,68,68,0.4)]">
//             <span className="text-3xl block mb-2">❌</span>
//             <strong className="text-red-400 text-lg tracking-wide">NOT A PLANT. SYNTHETIC BRAINDANCE DETECTED!</strong>
//           </motion.div>
//         )}

//         {/* Result Card */}
//         {result && !result.notPlant && (
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ type: "spring", stiffness: 120, damping: 20 }}
//           >
//             <TiltCard className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-zinc-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6">
//               <div className="bg-zinc-950/80 rounded-xl p-5 sm:p-6 border border-zinc-800 space-y-4 shadow-inner">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
//                   <h3 className="font-black text-2xl text-cyan-400 uppercase tracking-wider">
//                     🌱 {result.plant}
//                   </h3>
//                   <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${result.isHealthy ? "bg-green-900/30 text-green-400 border-green-500/50" : "bg-red-900/30 text-red-400 border-red-500/50"}`}>
//                     {result.isHealthy ? "Max Chrome (Healthy)" : "Virus Detected"}
//                   </div>
//                 </div>

//                 {!result.isHealthy && (
//                   <p className="text-red-400 text-lg font-bold">
//                     <span className="text-zinc-500 text-sm uppercase block mb-1">Diagnosis</span>
//                     {result.disease}
//                   </p>
//                 )}

//                 <div className="flex items-center gap-3">
//                   <span className="text-zinc-400 text-sm uppercase">Kiroshi Confidence:</span>
//                   <span className="text-xl font-mono font-bold text-yellow-400">{(result.confidence * 100).toFixed(1)}%</span>
//                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${result.confidence >= 0.6 ? "bg-cyan-900/50 text-cyan-400" : "bg-yellow-900/50 text-yellow-400"}`}>
//                     {result.confidence >= 0.6 ? "Reliable" : "Low Intel"}
//                   </span>
//                 </div>

//                 <div className="bg-zinc-900 rounded-lg p-4 border-l-4 border-cyan-500">
//                   <p className="text-sm text-zinc-300 leading-relaxed">
//                     <strong className="text-cyan-400 block mb-1 uppercase text-xs">Netrunner Intel:</strong>
//                     {result.explanation}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//                   {result?.waterRecommendation && (
//                     <motion.div className="bg-blue-950/40 p-4 rounded-xl border border-blue-900/50" whileHover={{ scale: 1.02 }}>
//                       <h4 className="font-bold text-blue-400 mb-2 uppercase text-xs flex items-center gap-2">
//                         <span>💧</span> Hydration Cyberware
//                       </h4>
//                       <div className="space-y-1 font-mono text-sm text-blue-200">
//                         <p>Daily: {result.waterRecommendation.perDayLiters}L</p>
//                         <p>Weekly: {result.waterRecommendation.perWeekLiters}L</p>
//                         <p className="text-[10px] text-blue-400/70 mt-2 font-sans leading-tight">{result.waterRecommendation.notes}</p>
//                       </div>
//                     </motion.div>
//                   )}

//                   {result.irrigationSchedule && (
//                     <motion.div className="bg-green-950/40 p-4 rounded-xl border border-green-900/50" whileHover={{ scale: 1.02 }}>
//                       <h4 className="font-bold text-green-400 mb-2 uppercase text-xs flex items-center gap-2">
//                         <span>📅</span> Irrigation Protocol
//                       </h4>
//                       <p className="text-sm text-green-200">{result.irrigationSchedule}</p>
//                     </motion.div>
//                   )}
//                 </div>

//                 {!result.isHealthy && (
//                   <div className="space-y-4 mt-6">
//                     <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
//                       <strong className="text-pink-400 uppercase text-xs block mb-3">Ripperdoc Treatment:</strong>
//                       <ul className="space-y-3">
//                         {result.treatment.map((t, i) => {
//                           const links = getStoreLinks(t);
//                           return (
//                             <li key={i} className="text-sm text-zinc-300 flex flex-col gap-2">
//                               <span className="flex items-start gap-2"><span className="text-pink-500 mt-0.5">▸</span> {t}</span>
//                               <div className="flex gap-3 ml-4 text-[10px] font-bold uppercase">
//                                 <a href={links.amazon} target="_blank" rel="noreferrer" className="text-yellow-500 hover:text-yellow-400 transition-colors">
//                                   [ Amazon Black Market ]
//                                 </a>
//                                 <a href={links.flipkart} target="_blank" rel="noreferrer" className="text-cyan-500 hover:text-cyan-400 transition-colors">
//                                   [ Flipkart Black Market ]
//                                 </a>
//                               </div>
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     </div>

//                     <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
//                       <strong className="text-cyan-400 uppercase text-xs block mb-3">Cyberware Defense (Prevention):</strong>
//                       <ul className="space-y-2">
//                         {result.prevention.map((p, i) => (
//                           <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
//                             <span className="text-cyan-500 mt-0.5">▸</span> {p}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 )}

//                 <div className="mt-8 pt-6 border-t border-zinc-800">
//                   <div className="flex justify-between items-end mb-2">
//                     <span className="font-bold text-xs uppercase text-zinc-400">Chrome Vitality Score</span>
//                     <span className="font-mono font-bold text-lg text-white">{healthScore}/100</span>
//                   </div>
//                   <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden border border-zinc-700">
//                     <motion.div
//                       initial={{ width: 0 }}
//                       animate={{ width: `${healthScore}%` }}
//                       transition={{ duration: 1.5, ease: "easeOut" }}
//                       className={`h-full ${healthScore > 70 ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : healthScore > 40 ? "bg-yellow-400 shadow-[0_0_10px_#facc15]" : "bg-red-500 shadow-[0_0_10px_#ef4444]"}`}
//                     />
//                   </div>

//                   <div className="mt-6 grid grid-cols-2 gap-6">
//                     <div>
//                       <span className="text-[10px] uppercase text-zinc-500 font-bold block mb-1">Healthy Probability</span>
//                       <div className="bg-zinc-900 h-2 rounded-full overflow-hidden">
//                         <motion.div initial={{ width: 0 }} animate={{ width: `${diseaseStats.Healthy}%` }} transition={{ duration: 1 }} className="bg-green-500 h-full" />
//                       </div>
//                     </div>
//                     <div>
//                       <span className="text-[10px] uppercase text-zinc-500 font-bold block mb-1">Disease Probability</span>
//                       <div className="bg-zinc-900 h-2 rounded-full overflow-hidden">
//                         <motion.div initial={{ width: 0 }} animate={{ width: `${diseaseStats.Diseased}%` }} transition={{ duration: 1 }} className="bg-red-500 h-full" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {isLowConfidence && (
//                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 bg-yellow-900/20 border border-yellow-500/50 p-4 rounded-xl">
//                     <strong className="text-yellow-400 text-sm flex items-center gap-2 uppercase"><span className="text-lg">⚠️</span> Relic Malfunction Suspected</strong>
//                     <p className="text-xs text-yellow-200/70 mt-2">The uploaded image may be unclear. For better results:</p>
//                     <ul className="text-xs text-yellow-200/70 mt-1 ml-5 list-disc">
//                       <li>Use good lighting (Optic Flash not required)</li>
//                       <li>Capture a single leaf in focus</li>
//                       <li>Take a close-up image</li>
//                     </ul>
//                   </motion.div>
//                 )}
//               </div>

//               {/* Action Buttons Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={speakResult}
//                   className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-xs sm:text-sm font-bold uppercase tracking-wider py-3 px-2 rounded-xl text-cyan-400 transition-colors flex flex-col items-center justify-center gap-1"
//                 >
//                   <span className="text-lg">🔊</span> Synth Voice
//                 </motion.button>
                
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={openMaps}
//                   className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-xs sm:text-sm font-bold uppercase tracking-wider py-3 px-2 rounded-xl text-pink-400 transition-colors flex flex-col items-center justify-center gap-1"
//                 >
//                   <span className="text-lg">🗺️</span> Ripperdoc Map
//                 </motion.button>
                
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={downloadPDF}
//                   className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-xs sm:text-sm font-bold uppercase tracking-wider py-3 px-2 rounded-xl text-yellow-400 transition-colors flex flex-col items-center justify-center gap-1"
//                 >
//                   <span className="text-lg">📄</span> Save Shard
//                 </motion.button>
//               </div>
//             </TiltCard>
//           </motion.div>
//         )}

//         <footer className="mt-12 pb-8">
//           <p className="text-center text-xs text-zinc-600 font-mono uppercase tracking-widest">
//             🔒 Image processed securely by NetWatch. No data retained.
//           </p>
//         </footer>
//       </motion.div>

//       <AICharacter result={result} />
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (err) {
      alert("Camera access denied or unavailable.");
    }
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

      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setIsCameraOn(false);
    }, "image/jpeg");
  };

  const generateSmartWaterRecommendation = (plant, confidence, isHealthy, weather) => {
    const plantWaterBase = {
      tomato: 0.7, potato: 0.6, rice: 1.2, wheat: 0.5, cotton: 0.8, default: 0.6,
    };
    const base = plantWaterBase[plant?.toLowerCase()] || plantWaterBase.default;
    let water = base;

    if (weather.temperature > 35) water += 0.2;
    else if (weather.temperature < 20) water -= 0.1;
    if (weather.humidity > 80) water -= 0.1;
    if (weather.rain) water = 0;
    if (!isHealthy && confidence > 0.8) water *= 0.7;

    return {
      perDayLiters: water.toFixed(2),
      perWeekLiters: (water * 7).toFixed(2),
      notes: weather.rain
        ? "Rain expected. No watering needed today."
        : "Water adjusted based on current atmospheric conditions.",
    };
  };

  const generateIrrigationSchedule = (weather, isHealthy, confidence) => {
    if (weather.rain) return "No irrigation today (Rain expected)";
    if (!isHealthy && confidence > 0.8) return "Irrigate lightly in the morning only";
    if (weather.temperature > 35) return "Irrigate twice: Early morning & Late evening";
    return "Irrigate once in the early morning";
  };

  const handleAnalyze = async () => {
    if (!image) {
      alert("Please select an image to analyze.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    setLoading(true);

    try {
const response = await fetch("https://plant-disease-10.onrender.com/api/predict", {
  method: "POST",
  body: formData,
});

const text = await response.text();
console.log("RAW RESPONSE:", text);

if (!response.ok) {
  throw new Error(text);
}

const data = JSON.parse(text);
      const normalizedDisease = data.disease?.toLowerCase() || "";
      const isHealthy =
        data.confidence > 0.6 &&
        (normalizedDisease === "healthy" || normalizedDisease === "no disease" || normalizedDisease === "none");

      let weather = { temperature: 30, humidity: 60, rain: false };
      
      setResult({
        ...data,
        isHealthy,
        waterRecommendation: generateSmartWaterRecommendation(data.plant, data.confidence, isHealthy, weather),
        irrigationSchedule: generateIrrigationSchedule(weather, isHealthy, data.confidence),
      });

      const token = localStorage.getItem("token");
      if (token) {
        await fetch("https://plant-disease-10.onrender.com/api/scans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imageUrl: data.imageUrl || URL.createObjectURL(image),
            diagnosis: {
              plantName: data.plant,
              isHealthy,
              diseaseName: isHealthy ? null : data.disease,
              confidenceScore: data.confidence,
            },
          }),
        });
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const speakResult = () => {
    if (!result) return;
    const text = `Plant ${result.plant}. Disease ${result.disease}. Confidence ${(result.confidence * 100).toFixed(1)} percent.`;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  const getStoreLinks = (item) => ({
    amazon: `https://www.amazon.in/s?k=${encodeURIComponent(item)}`,
    flipkart: `https://www.flipkart.com/search?q=${encodeURIComponent(item)}`,
  });

  const openMaps = () => {
    const query = `${result.disease} plant medicine store near me`;
    const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    window.open(url, "_blank");
  };

  const downloadPDF = async () => {
    if (!result || !image) return;
    const pdf = new jsPDF();
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const imgData = reader.result;
      pdf.setFontSize(20);
      pdf.text("Plant Health Diagnosis Report", 14, 20);
      pdf.addImage(imgData, "JPEG", 14, 30, 50, 50);
      pdf.setFontSize(12);
      pdf.text(`Plant: ${result.plant}`, 70, 40);
      pdf.text(`Status: ${result.isHealthy ? "Healthy" : "Diseased"}`, 70, 50);
      pdf.text(`Disease: ${result.isHealthy ? "N/A" : result.disease}`, 70, 60);
      pdf.text(`Confidence: ${(result.confidence * 100).toFixed(1)}%`, 70, 70);
      pdf.text("Explanation:", 14, 100);
      pdf.text(result.explanation, 14, 110, { maxWidth: 180 });
      pdf.save("plant_report.pdf");
    };
  };

  const healthScore = result
    ? result.isHealthy
      ? Math.round(result.confidence * 100)
      : Math.round((1 - result.confidence) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans relative overflow-x-hidden">
      {/* Soft Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-teal-50/50 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-24 text-center">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Plant Disease Detection 🌿</h1>
          <p className="text-slate-500 text-lg">Upload a leaf image and let AI analyze plant health</p>
        </header>

        {/* Upload Card */}
        <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 mb-8 border border-slate-100">
          <label className="block cursor-pointer group">
            <div className="border-2 border-dashed border-emerald-200 rounded-[30px] p-16 bg-emerald-50/30 group-hover:bg-emerald-50 transition-all duration-300">
              <div className="flex flex-col items-center justify-center gap-4">
                {!image ? (
                  <>
                    <p className="text-xl font-semibold text-slate-700">Click to upload leaf image</p>
                    <p className="text-slate-400 text-sm">JPG, PNG</p>
                  </>
                ) : (
                  <div className="space-y-4">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="max-h-64 rounded-2xl mx-auto shadow-md"
                    />
                    <p className="text-emerald-600 font-medium">{fileName}</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
          </label>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={startCamera}
              className="px-6 py-2 rounded-full border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Use Camera
            </button>
          </div>

          {isCameraOn && (
            <div className="mt-8 flex flex-col items-center">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white max-w-md w-full">
                <video ref={videoRef} autoPlay className="w-full aspect-square object-cover" />
              </div>
              <button
                onClick={captureFromCamera}
                className="mt-6 px-8 py-3 bg-slate-800 text-white font-bold rounded-full hover:bg-slate-700 transition-all"
              >
                Capture Photo
              </button>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading || !image}
          className={`w-full max-w-md py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
            !image 
              ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
              : "bg-slate-800 text-white hover:bg-slate-900 active:scale-[0.98]"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze Plant"}
        </button>

        <p className="mt-6 text-slate-400 text-sm flex items-center justify-center gap-2">
          <span>🔒</span> Image processed securely and not stored
        </p>

        {/* Results Section */}
        {result && !result.notPlant && (
          <div className="mt-16 text-left space-y-8">
            <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">{result.plant}</h2>
                  <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${result.isHealthy ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {result.isHealthy ? "Healthy" : "Infection Detected"}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Confidence</p>
                  <p className="text-3xl font-mono font-bold text-slate-800">{(result.confidence * 100).toFixed(1)}%</p>
                </div>
              </div>

              {!result.isHealthy && (
                <div className="mb-8">
                  <p className="text-slate-500 text-sm uppercase font-bold mb-2">Diagnosis</p>
                  <p className="text-2xl font-bold text-red-600">{result.disease}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <span className="text-blue-500">💧</span> Watering Guide
                  </h3>
                  <p className="text-sm text-slate-600 mb-2">Daily: <span className="font-bold text-slate-800">{result.waterRecommendation.perDayLiters}L</span></p>
                  <p className="text-xs text-slate-400 italic">{result.waterRecommendation.notes}</p>
                </div>
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <span className="text-emerald-500">📅</span> Schedule
                  </h3>
                  <p className="text-sm text-slate-600">{result.irrigationSchedule}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-800 mb-3">Analysis Details</h3>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">{result.explanation}</p>
                </div>

                {!result.isHealthy && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-slate-800 mb-3">Recommended Treatment</h3>
                      <ul className="space-y-2">
                        {/* {result.treatment.map((t, i) => ( */}
                        {(result.treatment || []).map((t, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-emerald-500 mt-1">•</span> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 mb-3">Prevention Tips</h3>
                      <ul className="space-y-2">
                        {/* {result.prevention.map((p, i) => ( */}
                        {(result.prevention || []).map((p, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-12 pt-10 border-t border-slate-100 flex flex-wrap gap-4">
                <button onClick={speakResult} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-semibold text-sm transition-colors">Listen to Result</button>
                <button onClick={downloadPDF} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-semibold text-sm transition-colors">Download PDF</button>
                {!result.isHealthy && (
                  <button onClick={openMaps} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-semibold text-sm transition-colors">Find Local Treatment</button>
                )}
              </div>
            </div>
          </div>
        )}

        {result?.notPlant && (
          <div className="mt-12 bg-red-50 border border-red-100 p-8 rounded-[30px] text-red-700">
            <p className="font-bold text-xl mb-1">Image Not Recognized</p>
            <p>The uploaded image does not appear to be a plant leaf. Please try again with a clearer photo.</p>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>© 2026 Plant Disease AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;