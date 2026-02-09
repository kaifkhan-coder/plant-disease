import React from "react";

const HistoryTab = ({ records = [], onSelect, onClear }) => {
  // Safety check
  if (!Array.isArray(records) || records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          🕒
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No history yet
        </h3>
        <p className="text-gray-500 max-w-xs">
          Your analyzed plants will appear here for easy reference.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">
          Recent Scans
        </h2>

        <button
          onClick={onClear}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 uppercase tracking-widest"
        >
          Clear All
        </button>
      </div>

      {/* History Cards */}
      <div className="grid gap-3">
        {records.map((record) => (
          <button
            key={record._id}
            onClick={() => onSelect(record)}
            className="flex items-center gap-4 bg-white p-3 rounded-2xl border shadow-sm hover:border-emerald-300 transition-all text-left"
          >
            {/* Image */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
              <img
                src={record.imageUrl}
                alt={record.diagnosis?.plantName || "Plant"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900">
                  {record.diagnosis?.plantName}
                </h4>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    record.diagnosis?.isHealthy
                      ? "bg-green-100 text-green-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {record.diagnosis?.isHealthy ? "Healthy" : "Diseased"}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                {new Date(record.createdAt).toLocaleDateString()} •{" "}
                {new Date(record.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              {record.diagnosis?.diseaseName && (
                <p className="text-xs font-medium text-amber-700 mt-1 truncate">
                  {record.diagnosis.diseaseName}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryTab;
