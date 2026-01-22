import React from "react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Dashboard 📊
      </h2>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Scans</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-2">12</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Healthy Plants</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">7</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Diseased</h3>
          <p className="text-3xl font-bold text-rose-600 mt-2">5</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="font-bold text-gray-900 mb-2">
          Insights
        </h3>
        <p className="text-sm text-gray-600">
          Most detected issue: <strong>Leaf Blight</strong>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
