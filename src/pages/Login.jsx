import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import PlantScene from "../components/PlantScene";

const handleTiltMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const midX = rect.width / 2;
  const midY = rect.height / 2;

  const rotateY = ((x - midX) / midX) * 10; // left-right
  const rotateX = -((y - midY) / midY) * 10; // up-down

  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
};

const handleTiltLeave = (e) => {
  e.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
};

const FloatingDots = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-24 h-24 rounded-full blur-3xl opacity-30"
          style={{
            left: `${(i * 11) % 100}%`,
            top: `${(i * 17) % 100}%`,
            background: i % 2 ? "rgba(16,185,129,0.55)" : "rgba(59,130,246,0.45)",
            animation: `float${i} ${10 + i}s ease-in-out infinite`,
          }}
        />
      ))}

      <style>{`
        ${Array.from({ length: 10 })
          .map(
            (_, i) => `
          @keyframes float${i} {
            0% { transform: translate(0,0) scale(1); }
            50% { transform: translate(${i % 2 ? 60 : -60}px, ${i % 3 ? -70 : 70}px) scale(1.2); }
            100% { transform: translate(0,0) scale(1); }
          }
        `
          )
          .join("")}
      `}</style>
    </div>
  );
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const pageRef = useRef(null);

useEffect(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline();

    tl.from(".loginForm", { opacity: 0, y: 50, duration: 0.8, ease: "power3.out" })
      .from(".loginTitle", { opacity: 0, y: 20, duration: 0.5 }, "-=0.4")
      .from(".loginInput", { opacity: 0, y: 15, stagger: 0.12, duration: 0.45 }, "-=0.3")
      .from(".loginBtn", { opacity: 0, scale: 0.9, duration: 0.4 }, "-=0.2");

    gsap.to(".glowRing", {
      opacity: 0.7,
      scale: 1.08,
      duration: 2.2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  }, pageRef);

  return () => ctx.revert();
}, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:2000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch {
      alert("Invalid email or password");
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen flex">
      
      {/* 3D Section */}
      <div className="hidden md:block w-1/2 bg-gradient-to-br from-green-900 to-emerald-600">
        <PlantScene />
      </div>

      {/* Form */}
<div className="relative w-full md:w-1/2 flex items-center justify-center px-6">
  <FloatingDots />

  <form
    onSubmit={handleLogin}
    onMouseMove={handleTiltMove}
    onMouseLeave={handleTiltLeave}
    className="loginForm w-full max-w-sm space-y-5 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/50 transition-transform duration-150"
    style={{ transformStyle: "preserve-3d" }}
  >
    {/* Glow ring behind title */}
    <div className="glowRing absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-400 blur-3xl opacity-40" />

    <h2
      className="loginTitle text-3xl font-bold text-emerald-700 text-center"
      style={{ transform: "translateZ(35px)" }}
    >
      Login
    </h2>

    <input
      type="email"
      placeholder="Email"
      className="loginInput w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      style={{ transform: "translateZ(20px)" }}
    />

    <input
      type="password"
      placeholder="Password"
      className="loginInput w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      style={{ transform: "translateZ(20px)" }}
    />

    <button
      className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 active:scale-95 transition"
      style={{ transform: "translateZ(25px)" }}
    >
      Login
    </button>

    <p className="text-sm text-center" style={{ transform: "translateZ(15px)" }}>
      Don’t have an account?{" "}
      <Link to="/signup" className="text-emerald-600 font-semibold">
        Create account
      </Link>
    </p>
  </form>
</div>
    </div>
  );
}
