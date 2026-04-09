import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HistoryTab from "../components/HistoryTab";

const History = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:2000/api/scans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await res.json();
        setRecords(data);
      } catch (error) {
        console.error("Failed to fetch records", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to clear your journey history? 🌸")) return;
    
    const token = localStorage.getItem("token");
    await fetch("https://plant-disease-10.onrender.com/api/scans", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRecords([]);
  };

  return (
    <div className="min-h-screen bg-[#f0f9f4] py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Anime Background Motifs */}
      <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          .anime-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            border: 2px solid #a7f3d0;
            box-shadow: 0 8px 0 #10b981;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .anime-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 0 #059669;
          }
          .btn-anime {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 700;
          }
          .btn-anime:active {
            transform: scale(0.95);
          }
          .fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <button
            onClick={() => navigate("/home")}
            className="btn-anime group flex items-center justify-center space-x-2 px-6 py-3 bg-white text-emerald-600 border-2 border-emerald-500 rounded-full hover:bg-emerald-50 transition-all shadow-sm"
          >
            <span className="group-hover:-translate-x-1 transition-transform">⬅</span>
            <span>Back to Lab</span>
          </button>
          
          <div className="text-center md:text-right">
            <h1 className="text-3xl md:text-4xl font-black text-emerald-900 tracking-tight">
              SCAN <span className="text-pink-500">ARCHIVES</span>
            </h1>
            <p className="text-emerald-600 font-medium italic">Your botanical journey so far ✨</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-emerald-700 font-bold animate-bounce">Loading Records...</p>
          </div>
        ) : (
          <div className="anime-card rounded-3xl p-6 md:p-8 fade-in-up">
            {records.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🍃</div>
                <h3 className="text-xl font-bold text-emerald-800">No records found!</h3>
                <p className="text-emerald-600 mt-2">Start your first scan to see it here.</p>
              </div>
            ) : (
              <HistoryTab
                records={records}
                onSelect={(r) =>
                  alert(`🌸 Diagnosis: ${r.diagnosis.plantName}\nStatus: ${r.diagnosis.status}`)
                }
                onClear={handleClear}
              />
            )}
          </div>
        )}

        <footer className="mt-12 text-center text-emerald-400 text-sm font-medium">
          © {new Date().getFullYear()} PlantSense • Data is updated in real-time
        </footer>
      </div>
    </div>
  );
};

export default History;