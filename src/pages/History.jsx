import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HistoryTab from "../components/HistoryTab";

const History = () => {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

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
    };

    fetchHistory();
  }, [navigate]);

  const handleClear = async () => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:2000/api/scans", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRecords([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 🔙 Back to Scan Button */}
      <button
        onClick={() => navigate("/home")}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
      >
        ⬅ Back to Scan
      </button>

      <HistoryTab
        records={records}
        onSelect={(r) =>
          alert("Selected: " + r.diagnosis.plantName)
        }
        onClear={handleClear}
      />
    </div>
  );
};

export default History;
