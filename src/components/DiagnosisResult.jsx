import React, { useState } from "react";
import { findNearbyNurseries } from "../services/geminiService";

const DiagnosisResult = ({ diagnosis, onReset }) => {
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingPlaces(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const places = await findNearbyNurseries(
            position.coords.latitude,
            position.coords.longitude
          );
          setNearbyPlaces(places);
        } catch (err) {
          console.error("Failed to find nearby places", err);
        } finally {
          setLoadingPlaces(false);
        }
      },
      () => {
        alert("Please enable location services to find nearby clinics.");
        setLoadingPlaces(false);
      }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div
        className={`p-6 rounded-3xl border ${
          diagnosis.isHealthy
            ? "bg-emerald-50 border-emerald-100"
            : "bg-amber-50 border-amber-100"
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {diagnosis.plantName}
            </h2>
            <p className="text-sm italic text-gray-500 font-medium">
              {diagnosis.scientificName}
            </p>
          </div>

          <div
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
              diagnosis.isHealthy
                ? "bg-emerald-200 text-emerald-800"
                : "bg-amber-200 text-amber-800"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                diagnosis.isHealthy
                  ? "bg-emerald-600"
                  : "bg-amber-600"
              }`}
            />
            {diagnosis.isHealthy ? "Healthy" : "Diseased"}
          </div>
        </div>

        {!diagnosis.isHealthy && (
          <div className="mt-4 p-4 bg-white/50 rounded-2xl border border-white">
            <h3 className="text-lg font-bold text-amber-900">
              Diagnosis: {diagnosis.diseaseName}
            </h3>
            <p className="text-sm text-amber-800 mt-1">
              Analysis Confidence:{" "}
              {(diagnosis.confidence * 100).toFixed(1)}%
            </p>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Symptoms */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-4">
            Symptoms
          </h4>
          <ul className="space-y-3">
            {diagnosis.symptoms.map((s, i) => (
              <li
                key={i}
                className="text-sm text-gray-600 flex gap-3"
              >
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5" />
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* Treatment */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-4">
            Treatment
          </h4>
          <ul className="space-y-3">
            {diagnosis.treatment.map((t, i) => (
              <li
                key={i}
                className="text-sm text-gray-600 flex gap-3"
              >
                <span className="font-black text-rose-200 text-xs">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Sources */}
      {diagnosis.sources && diagnosis.sources.length > 0 && (
        <section className="bg-slate-100/50 p-6 rounded-3xl border border-slate-200/50">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
            Verification Sources
          </h4>
          <div className="flex flex-wrap gap-2">
            {diagnosis.sources.map((source, i) => (
              <a
                key={i}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-white border rounded-xl text-xs font-bold text-slate-700 hover:border-emerald-300 transition-all"
              >
                {source.title}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Nearby Help */}
      {!diagnosis.isHealthy && (
        <div className="bg-white p-6 rounded-3xl shadow border">
          <div className="flex justify-between mb-6">
            <div>
              <h4 className="font-bold text-gray-900">
                Need Professional Help?
              </h4>
              <p className="text-sm text-gray-500">
                Find nearby plant nurseries.
              </p>
            </div>

            <button
              onClick={handleFindNearby}
              disabled={loadingPlaces}
              className={`p-3 rounded-2xl ${
                loadingPlaces
                  ? "bg-gray-100 text-gray-400"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {loadingPlaces ? "Loading..." : "Find"}
            </button>
          </div>

          {nearbyPlaces.length > 0 && (
            <div className="space-y-3">
              {nearbyPlaces.map((place, i) => (
                <a
                  key={i}
                  href={place.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border"
                >
                  {i + 1}. {place.name}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest"
      >
        Start New Scan
      </button>
    </div>
  );
};

export default DiagnosisResult;
