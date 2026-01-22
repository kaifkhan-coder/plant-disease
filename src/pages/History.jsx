import React from "react";
import HistoryTab from "../components/HistoryTab";

const History = () => {
  const records = []; // later connect with state or backend

  const handleSelect = (record) => {
    alert("Selected scan: " + record.diagnosis.plantName);
  };

  const handleClear = () => {
    alert("History cleared");
  };

  return (
    <div>
      <HistoryTab
        records={records}
        onSelect={handleSelect}
        onClear={handleClear}
      />
    </div>
  );
};

export default History;
