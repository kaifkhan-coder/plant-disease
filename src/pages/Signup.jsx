import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async () => {
    if (!email || !password) return alert("Please fill in all fields");
    setIsLoading(true);
    try {
      const res = await axios.post("https://plant-disease-10.onrender.com/api/auth/signup", {
        email,
        password,
      });

      alert(res.data.message);
      navigate("/");
    } catch (err) {
      alert("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
      {/* Anime-style Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full animate-float"
            style={{
              width: Math.random() * 10 + 5 + 'px',
              height: Math.random() * 10 + 5 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDuration: Math.random() * 10 + 10 + 's',
              animationDelay: Math.random() * 5 + 's',
            }}
          ></div>
        ))}
      </div>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateY(-100vh) translateX(50px) rotate(360deg); opacity: 0; }
          }
          .animate-float {
            animation: float linear infinite;
          }
          .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
          .anime-input {
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .anime-input:focus {
            border-color: #10b981;
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
            transform: translateY(-2px);
          }
          .btn-gradient {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          .btn-gradient:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.5);
          }
          .btn-gradient:active {
            transform: translateY(0);
          }
          .btn-gradient::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
            transform: rotate(45deg);
            transition: 0.5s;
          }
          .btn-gradient:hover::after {
            left: 100%;
          }
        `}
      </style>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="glass-card p-8 md:p-10 rounded-3xl transform transition-all duration-500 hover:scale-[1.01]">
          <div className="text-center mb-8">
            <div className="inline-block p-3 rounded-2xl bg-emerald-500/10 mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white mb-2">
              Join the <span className="text-emerald-400">Archive</span>
            </h2>
            <p className="text-slate-400 text-sm">Begin your journey into plant health</p>
          </div>

          <div className="space-y-4">
            <div className="group">
              <label className="block text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <input
                className="w-full p-4 rounded-xl anime-input text-white outline-none"
                placeholder="name@example.com"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1.5 ml-1">Secret Key</label>
              <input
                className="w-full p-4 rounded-xl anime-input text-white outline-none"
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={signup}
              disabled={isLoading}
              className="w-full btn-gradient text-white py-4 rounded-xl font-bold text-lg mt-6 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Initialize Signup</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>

          <p className="text-sm text-center mt-8 text-slate-400">
            Already a member?{" "}
            <Link to="/" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors underline underline-offset-4 decoration-emerald-500/30">
              Return to Login
            </Link>
          </p>
        </div>
        
        {/* Subtle Footer */}
        <p className="text-center text-slate-600 text-[10px] mt-8 uppercase tracking-[0.2em]">
          System Version 2.0.4 // Plant Disease Detection
        </p>
      </div>
    </div>
  );
}