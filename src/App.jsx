// import React, { useState } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Header from "./components/Header";
// import DashboardTab from "./components/DashboardTab";
// import HistoryTab from "./components/HistoryTab";

// // Dummy Home page (scan page)
// const Home = () => (
//   <div className="text-center py-20">
//     <h2 className="text-2xl font-bold text-gray-900 mb-2">
//       Scan Your Plant 🌿
//     </h2>
//     <p className="text-gray-500">
//       Upload a plant image to detect diseases
//     </p>
//   </div>
// );

// const App = () => {
//   const [records, setRecords] = useState([]);

//   const handleSelectRecord = (record) => {
//     alert(`Selected: ${record.diagnosis.plantName}`);
//   };

//   const handleClearHistory = () => {
//     if (window.confirm("Clear all scan history?")) {
//       setRecords([]);
//     }
//   };

//   return (
//     <BrowserRouter>
//       <Header />

//       <main className="max-w-4xl mx-auto px-4 py-6">
//         <Routes>
//           {/* Home / Scan */}
//           <Route path="/" element={<Home />} />

//           {/* Dashboard */}
//           <Route
//             path="/dashboard"
//             element={<DashboardTab records={records} />}
//           />

//           {/* History */}
//           <Route
//             path="/history"
//             element={
//               <HistoryTab
//                 records={records}
//                 onSelect={handleSelectRecord}
//                 onClear={handleClearHistory}
//               />
//             }
//           />
//         </Routes>
//       </main>
//     </BrowserRouter>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Header from "./components/Header";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

const App = () => {
  return (
    <Router>
      {/* <Header /> */}
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
