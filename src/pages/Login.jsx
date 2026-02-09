import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import PlantScene from "../components/PlantScene";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const pageRef = useRef(null);

  useEffect(() => {
    gsap.from(pageRef.current, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out",
    });
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
      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-5 bg-white p-8 rounded-2xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-emerald-700 text-center">
            Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700">
            Login
          </button>

          <p className="text-sm text-center">
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
