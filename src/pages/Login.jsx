import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import { z } from "zod";

/**
 * CUSTOM STYLES & ANIMATIONS
 * Injecting anime-style keyframes for the "Aura" and "Shake" effects
 */
const styleTag = `
@keyframes aura-pulse {
  0% { box-shadow: 0 0 10px rgba(251, 191, 36, 0.4), 0 0 20px rgba(251, 191, 36, 0.2); }
  50% { box-shadow: 0 0 25px rgba(251, 191, 36, 0.8), 0 0 50px rgba(251, 191, 36, 0.4); }
  100% { box-shadow: 0 0 10px rgba(251, 191, 36, 0.4), 0 0 20px rgba(251, 191, 36, 0.2); }
}
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
.anime-aura { animation: aura-pulse 2s infinite ease-in-out; }
.shake-error { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
.manga-border { border: 3px solid #000; box-shadow: 6px 6px 0px #000; }
.btn-charging:hover { transform: scale(1.02) translateY(-2px); transition: all 0.2s; }
`;

const loginSchema = z.object({
  email: z.string().email("That email format is weaker than Yamcha! Try again."),
  password: z.string().min(1, "Password is required! You can't fight without your Ki!"),
});

const AnimeCanvasBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = -(Math.random() * 2 + 0.5);
        this.alpha = Math.random() * 0.5 + 0.2;
        const colors = ["#fbbf24", "#60a5fa", "#f87171", "#ffffff"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y < -10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        // Add a small glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
      }
    }

    const init = () => {
      particles = Array.from({ length: 120 }, () => new Particle());
    };
    init();

    const animate = () => {
      ctx.fillStyle = "rgba(2, 6, 23, 0.15)"; // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" style={{ background: "#020617" }} />;
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isPoweringUp, setIsPoweringUp] = useState(false);
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();
  const pageRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anime-card", { 
        duration: 1.2, 
        y: 100, 
        opacity: 0, 
        ease: "elastic.out(1, 0.75)" 
      });
      gsap.from(".form-item", { 
        duration: 0.8, 
        x: -30, 
        opacity: 0, 
        stagger: 0.2, 
        delay: 0.5,
        ease: "power2.out"
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      triggerShake();
      return;
    }

    setIsPoweringUp(true);

    try {
      const res = await axios.post("https://plant-disease-10.onrender.com/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      
      // Flash animation before navigating
      gsap.to(".anime-card", { scale: 1.1, opacity: 0, duration: 0.5, onComplete: () => navigate("/home") });
    } catch {
      setErrors({ general: "Invalid credentials! Your power level is too low!" });
      triggerShake();
    } finally {
      setIsPoweringUp(false);
    }
  };

  return (
    <div ref={pageRef} className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-sans">
      <style>{styleTag}</style>
      <AnimeCanvasBackground />

      <div className={`anime-card z-10 w-full max-w-md ${shake ? 'shake-error' : ''}`}>
        <div className="relative bg-white p-1 manga-border anime-aura rounded-sm">
          {/* Inner Decorative Frame */}
          <div className="bg-slate-900 p-6 md:p-10 border-2 border-black">
            
            {/* Scouter Header */}
            <div className="flex justify-between items-center mb-8 border-b-2 border-blue-500 pb-2">
              <h2 className="text-2xl md:text-3xl text-white font-black italic tracking-tighter uppercase">
                Time <span className="text-blue-400">Chamber</span>
              </h2>
              <div className="text-right">
                <div className="text-[10px] text-blue-400 font-mono uppercase leading-none">Target Locked</div>
                <div className="text-xs text-blue-500 font-mono font-bold">LVL 9001+</div>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {errors.general && (
                <div className="bg-red-500/20 border-l-4 border-red-500 p-2 mb-4">
                  <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{errors.general}</p>
                </div>
              )}

              <div className="form-item group">
                <label className="block text-blue-400 text-[10px] font-bold uppercase mb-1 tracking-widest group-focus-within:text-yellow-400 transition-colors">
                  Capsule Corp ID
                </label>
                <input
                  type="email"
                  placeholder="name@capsule.com"
                  className="w-full p-3 bg-slate-800 border-2 border-slate-700 text-white focus:outline-none focus:border-yellow-400 transition-all rounded-none placeholder:text-slate-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{errors.email}</p>}
              </div>

              <div className="form-item group">
                <label className="block text-blue-400 text-[10px] font-bold uppercase mb-1 tracking-widest group-focus-within:text-yellow-400 transition-colors">
                  Secret Technique
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 bg-slate-800 border-2 border-slate-700 text-white focus:outline-none focus:border-yellow-400 transition-all rounded-none placeholder:text-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isPoweringUp}
                className="form-item w-full relative group overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 transition-transform duration-300 ${isPoweringUp ? 'translate-y-0' : 'translate-y-full'} group-hover:translate-y-0`}></div>
                <div className="relative border-2 border-white py-3 bg-transparent text-white font-black uppercase tracking-tighter text-lg btn-charging">
                  {isPoweringUp ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      CHARGING...
                    </span>
                  ) : (
                    "Initiate Transmission"
                  )}
                </div>
              </button>

              <p className="form-item text-center text-slate-400 text-xs uppercase tracking-widest">
                New to the Dojo?{" "}
                <Link to="/signup" className="text-yellow-500 hover:text-white transition-colors font-bold underline decoration-2 underline-offset-4">
                  Join Z-Fighters
                </Link>
              </p>
            </form>
          </div>
        </div>
        
        {/* Decorative corner elements */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-yellow-500 z-20"></div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-blue-500 z-20"></div>
      </div>
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