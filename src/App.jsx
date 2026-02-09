import React, { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Header from "./components/Header";
import Home from "./pages/Home";
import History from "./pages/History";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  const [history, setHistory] = useState([]);
  const location = useLocation();

  const hideHeader =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  const addScan = (scan) => {
    setHistory([scan, ...history]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <>
      {!hideHeader && <Header />}

      <main className="p-4">
<Routes>
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />

  <Route
    path="/home"
    element={
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    }
  />

  <Route
    path="/history"
    element={
      <ProtectedRoute>
        <History />
      </ProtectedRoute>
    }
  />
</Routes>

      </main>
    </>
  );
};

export default App;
