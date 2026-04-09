// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { gsap } from "gsap";
// import { z } from "zod";

// // Validation (Even Whis checks his inputs before training)
// const loginSchema = z.object({
//   email: z.string().email("That email format is weaker than Yamcha! Try again."),
//   password: z.string().min(1, "Password is required! You can't fight without your Ki!"),
// });

// // ✅ Canvas Animation (Gathering energy for the Spirit Bomb!)
// const AnimeCanvasBackground = () => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     let animationFrameId;
//     let kiBlasts = []; // Hey, it's me, Goku! Let's make some Ki blasts!

//     const resize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
//     window.addEventListener("resize", resize);
//     resize();

//     class KiBlast {
//       constructor() {
//         this.x = Math.random() * canvas.width;
//         this.y = Math.random() * canvas.height - canvas.height;
//         this.size = Math.random() * 3 + 2;
//         this.speedX = Math.random() * 2 - 1;
//         this.speedY = Math.random() * 2 + 1;
//         this.angle = Math.random() * 360;
//         this.spin = (Math.random() - 0.5) * 0.1;

//         // Colors of Super Saiyan Gold, Kamehameha Blue, and Kaio-ken Red!
//         const colors = ["#fbbf24", "#60a5fa", "#ffffff", "#f87171"];
//         this.color = colors[Math.floor(Math.random() * colors.length)];
//       }

//       update() {
//         this.x += this.speedX;
//         this.y += this.speedY;
//         this.angle += this.spin;

//         // If the blast goes off screen, Instant Transmission it back to the top!
//         if (this.y > canvas.height) {
//           this.y = -10;
//           this.x = Math.random() * canvas.width;
//         }
//       }

//       draw() {
//         ctx.save();
//         ctx.translate(this.x, this.y);
//         ctx.rotate(this.angle);
//         ctx.beginPath();
//         ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
//         ctx.fillStyle = this.color;
//         ctx.globalAlpha = 0.6;
//         ctx.fill();
//         ctx.restore();
//       }
//     }

//     const init = () => {
//       kiBlasts = [];
//       for (let i = 0; i < 80; i++) {
//         kiBlasts.push(new KiBlast());
//       }
//     };

//     init();

//     const animate = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       kiBlasts.forEach((blast) => {
//         blast.update();
//         blast.draw();
//       });

//       animationFrameId = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       cancelAnimationFrame(animationFrameId);
//       window.removeEventListener("resize", resize);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="absolute inset-0 w-full h-full"
//       style={{ background: "#020617" }} // The dark void of space on the way to Namek
//     />
//   );
// };

// // ✅ MAIN COMPONENT (The World Martial Arts Tournament Registration)
// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const [isPoweringUp, setIsPoweringUp] = useState(false); // Replaced isLoading with pure Saiyan energy

//   const navigate = useNavigate();
//   const pageRef = useRef(null);

//   useEffect(() => {
//     // Instant Transmission into the UI!
//     const ctx = gsap.context(() => {
//       gsap.from(".loginForm", { opacity: 0, y: 50, duration: 0.8 });
//     }, pageRef);

//     return () => ctx.revert();
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setErrors({});

//     // Scanning power level with the scouter...
//     const result = loginSchema.safeParse({ email, password });

//     if (!result.success) {
//       const fieldErrors = {};
//       result.error.issues.forEach((err) => {
//         fieldErrors[err.path[0]] = err.message;
//       });
//       setErrors(fieldErrors);
//       return;
//     }

//     setIsPoweringUp(true); // Kaio-ken times TEN!

//     try {
//       // Firing the Kamehameha at the backend!
//       const res = await axios.post("https://plant-disease-10.onrender.com/api/auth/login", {
//         email,
//         password,
//       });

//       // Grab the Senzu bean (token) and fly to the next route
//       localStorage.setItem("token", res.data.token);
//       navigate("/home"); // Flying Nimbus, away!
//     } catch {
//       // Oh no, Frieza dodged the attack!
//       setErrors({ general: "Invalid email or password. Is your power level under 9000?!" });
//     } finally {
//       setIsPoweringUp(false); // Dropping out of Super Saiyan to save stamina
//     }
//   };

//   return (
//     <div ref={pageRef} className="relative min-h-screen flex">
//       <AnimeCanvasBackground />

//       <div className="w-full flex items-center justify-center z-10">
//         <form
//           onSubmit={handleLogin}
//           className="loginForm bg-black/70 backdrop-blur-lg p-8 rounded-xl w-full max-w-sm space-y-4"
//         >
//           <h2 className="text-2xl text-white text-center font-bold">
//             Hyperbolic Time Chamber Login
//           </h2>

//           {errors.general && (
//             <p className="text-red-400 text-center">{errors.general}</p>
//           )}

//           <input
//             type="email"
//             placeholder="Email (or Capsule Corp ID)"
//             className="w-full p-3 rounded bg-gray-800 text-white"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           {errors.email && <p className="text-red-400">{errors.email}</p>}

//           <input
//             type="password"
//             placeholder="Secret Technique (Password)"
//             className="w-full p-3 rounded bg-gray-800 text-white"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           {errors.password && <p className="text-red-400">{errors.password}</p>}

//           {/* ✅ BUTTON FIXED (Now with 100% more screaming) */}
//           <button
//             type="submit"
//             className="w-full bg-green-600 py-3 rounded text-white font-bold"
//             disabled={isPoweringUp}
//           >
//             {isPoweringUp ? "Powering up... HAAAAA!" : "Login (Instant Transmission)"}
//           </button>

//           <p className="text-center text-white">
//             Don’t have an account?{" "}
//             <Link to="/signup" className="text-green-400">
//               Join the Z-Fighters
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";

// Validation Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const Background = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#f8fafc] overflow-hidden pointer-events-none">
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{ 
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', 
          backgroundSize: '32px 32px' 
        }}
      ></div>
      
      {/* Animated Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-sky-100/30 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((err) => { fieldErrors[err.path[0]] = err.message; });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("https://plant-disease-10.onrender.com/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (err) {
      setErrors({ general: "Invalid email or password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <Background />

      <div className={`relative z-10 w-full max-w-[440px] transition-all duration-1000 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-10">
              <div className="group relative inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-8 shadow-2xl shadow-blue-200 transition-transform duration-500 hover:rotate-12">
                <svg className="w-10 h-10 text-white transition-transform duration-500 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <div className="absolute inset-0 bg-blue-400 rounded-2xl animate-ping opacity-20 group-hover:opacity-0 transition-opacity"></div>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                Welcome Back
              </h1>
              <p className="text-slate-500 font-medium">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-red-600 text-sm font-semibold text-center animate-shake">
                  {errors.general}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    className={`w-full bg-white/50 border-2 ${errors.email ? 'border-red-400' : 'border-slate-100'} px-5 py-4 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 placeholder:text-slate-400 font-medium`}
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs font-bold mt-1 ml-2 animate-fadeIn">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="block text-sm font-bold text-slate-700">
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="password"
                    className={`w-full bg-white/50 border-2 ${errors.password ? 'border-red-400' : 'border-slate-100'} px-5 py-4 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 placeholder:text-slate-400 font-medium`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs font-bold mt-1 ml-2 animate-fadeIn">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out"></div>
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm font-medium">
                New to the platform?{" "}
                <Link to="/signup" className="text-blue-600 font-extrabold hover:text-blue-700 transition-colors inline-block hover:translate-x-1 duration-300">
                  Create Account →
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <div className={`mt-10 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
            Secure Enterprise Encryption
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        body { 
          margin: 0; 
          background-color: #f8fafc;
          font-family: 'Plus Jakarta Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        /* Smooth scroll and selection */
        ::selection {
          background-color: rgba(37, 99, 235, 0.1);
          color: #2563eb;
        }
      `}</style>
    </div>
  );
}

// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { gsap } from "gsap";
// import { z } from "zod";

// // Ninja Scroll Validation (Byakugan checks your inputs!)
// const loginSchema = z.object({
//   email: z.string().email("Please enter a valid email address, dattebayo!"),
//   password: z.string().min(1, "A true ninja never forgets their password!"),
// });

// // ✅ Canvas Animation (Chakra / Rasengan Style)
// const AnimeCanvasBackground = () => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     let animationFrameId;
//     let chakraParticles = [];

//     const resize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
//     window.addEventListener("resize", resize);
//     resize();

//     // The building block of our visual jutsu
//     class ChakraParticle {
//       constructor() {
//         this.x = Math.random() * canvas.width;
//         this.y = Math.random() * canvas.height - canvas.height;
//         this.size = Math.random() * 3 + 2;
//         this.speedX = Math.random() * 2 - 1;
//         this.speedY = Math.random() * 2 + 1;
//         this.angle = Math.random() * 360;
//         this.spin = (Math.random() - 0.5) * 0.1;

//         // Naruto Theme Colors: Kyuubi Orange, Rasengan Blue, Kunai Silver
//         const colors = ["#f97316", "#3b82f6", "#ffffff", "#fb923c"];
//         this.color = colors[Math.floor(Math.random() * colors.length)];
//       }

//       update() {
//         this.x += this.speedX;
//         this.y += this.speedY;
//         this.angle += this.spin;

//         // Flying Thunder God technique: teleport to top when out of bounds
//         if (this.y > canvas.height) {
//           this.y = -10;
//           this.x = Math.random() * canvas.width;
//         }
//       }

//       draw() {
//         ctx.save();
//         ctx.translate(this.x, this.y);
//         ctx.rotate(this.angle);
//         ctx.beginPath();
//         ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
//         ctx.fillStyle = this.color;
//         ctx.globalAlpha = 0.6;
//         ctx.fill();
//         ctx.restore();
//       }
//     }

//     const init = () => {
//       chakraParticles = [];
//       // Multi Shadow Clone Jutsu! (Creating 80 clones)
//       for (let i = 0; i < 80; i++) {
//         chakraParticles.push(new ChakraParticle());
//       }
//     };

//     init();

//     const animate = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       chakraParticles.forEach((p) => {
//         p.update();
//         p.draw();
//       });

//       animationFrameId = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       // Release the Genjutsu (cleanup)
//       cancelAnimationFrame(animationFrameId);
//       window.removeEventListener("resize", resize);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="absolute inset-0 w-full h-full"
//       style={{ background: "#020617" }}
//     />
//   );
// };

// // ✅ MAIN COMPONENT - The Chunin Exam Registration
// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const [isGatheringChakra, setIsGatheringChakra] = useState(false);

//   const navigate = useNavigate();
//   const pageRef = useRef(null);

//   useEffect(() => {
//     // Body Flicker Technique (Shunshin no Jutsu) for entry animation
//     const ctx = gsap.context(() => {
//       gsap.from(".loginForm", { opacity: 0, y: 50, duration: 0.8 });
//     }, pageRef);

//     return () => ctx.revert();
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setErrors({});

//     // Sharingan! Analyzing the inputs...
//     const result = loginSchema.safeParse({ email, password });

//     if (!result.success) {
//       const fieldErrors = {};
//       result.error.issues.forEach((err) => {
//         fieldErrors[err.path[0]] = err.message;
//       });
//       setErrors(fieldErrors);
//       return;
//     }

//     setIsGatheringChakra(true);

//     try {
//       // Summoning Jutsu: API Call!
//       const res = await axios.post("https://plant-disease-10.onrender.com/api/auth/login", {
//         email,
//         password,
//       });

//       // Storing the scroll of sealing (token)
//       localStorage.setItem("token", res.data.token);
//       navigate("/home");
//     } catch {
//       // Caught in Tsukuyomi!
//       setErrors({ general: "Genjutsu detected! Invalid email or password." });
//     } finally {
//       setIsGatheringChakra(false);
//     }
//   };

//   return (
//     <div ref={pageRef} className="relative min-h-screen flex">
//       <AnimeCanvasBackground />

//       <div className="w-full flex items-center justify-center z-10">
//         <form
//           onSubmit={handleLogin}
//           className="loginForm bg-black/70 backdrop-blur-lg p-8 rounded-xl w-full max-w-sm space-y-4"
//         >
//           <h2 className="text-2xl text-white text-center font-bold">
//             Hidden Leaf Login
//           </h2>

//           {errors.general && (
//             <p className="text-red-400 text-center">{errors.general}</p>
//           )}

//           <input
//             type="email"
//             placeholder="Ninja Email"
//             className="w-full p-3 rounded bg-gray-800 text-white"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           {errors.email && <p className="text-red-400">{errors.email}</p>}

//           <input
//             type="password"
//             placeholder="Secret Hand Signs (Password)"
//             className="w-full p-3 rounded bg-gray-800 text-white"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           {errors.password && <p className="text-red-400">{errors.password}</p>}

//           {/* ✅ BUTTON FIXED - Believe it! */}
//           <button
//             type="submit"
//             className="w-full bg-green-600 py-3 rounded text-white font-bold"
//             disabled={isGatheringChakra}
//           >
//             {isGatheringChakra ? "Gathering Chakra..." : "Unlock Inner Gates"}
//           </button>

//           <p className="text-center text-white">
//             Not a ninja yet?{" "}
//             <Link to="/signup" className="text-green-400">
//               Join the Academy
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }