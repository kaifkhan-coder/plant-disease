import React from "react";
import { useNavigate,  Link } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

      const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
              <path d="M7 12h10" />
              <path d="M12 7v10" />
            </svg>
          </div>

          <h1 className="text-xl font-bold text-gray-900">
            Plant Disease <span className="text-emerald-600">AI</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-emerald-600">
            Scan
          </Link>
          <Link to="/history" className="text-sm font-medium hover:text-emerald-600">
            History
          </Link>
            <button
        onClick={logout}
        className="bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold"
      >
        Logout
      </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
