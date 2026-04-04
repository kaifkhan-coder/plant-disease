import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import { z } from "zod";

// Validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// ✅ Canvas Animation (Anime Style)
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
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 + 1;
        this.angle = Math.random() * 360;
        this.spin = (Math.random() - 0.5) * 0.1;

        const colors = ["#fbcfe8", "#f472b6", "#ffffff", "#ec4899"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.spin;

        if (this.y > canvas.height) {
          this.y = -10;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
      }
    };

    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "#020617" }}
    />
  );
};

// ✅ MAIN COMPONENT
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".loginForm", { opacity: 0, y: 50, duration: 0.8 });
    }, pageRef);

    return () => ctx.revert();
  }, []);

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
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("https://plant-disease-10.onrender.com/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch {
      setErrors({ general: "Invalid email or password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={pageRef} className="relative min-h-screen flex">
      <AnimeCanvasBackground />

      <div className="w-full flex items-center justify-center z-10">
        <form
          onSubmit={handleLogin}
          className="loginForm bg-black/70 backdrop-blur-lg p-8 rounded-xl w-full max-w-sm space-y-4"
        >
          <h2 className="text-2xl text-white text-center font-bold">
            Login
          </h2>

          {errors.general && (
            <p className="text-red-400 text-center">{errors.general}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-800 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {errors.email && <p className="text-red-400">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-800 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errors.password && <p className="text-red-400">{errors.password}</p>}

          {/* ✅ BUTTON FIXED */}
          <button
            type="submit"
            className="w-full bg-green-600 py-3 rounded text-white font-bold"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>

          <p className="text-center text-white">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-green-400">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}