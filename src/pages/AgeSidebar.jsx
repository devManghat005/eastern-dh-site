import React, { useState } from "react";
import Papa from "papaparse";

export default function AgeSidebar() {
  const [rows, setRows] = useState([]);
  const [groups, setGroups] = useState({});
  const [detail, setDetail] = useState(null);

  // FIXED COLUMN NAME (you can change this if your CSV uses a different name)
  const col = "Age";

  // Normalize ages into 3 buckets
  const normalize = (raw) => {
    if (!raw) return "Unknown";

    const age = parseInt(raw);

    if (isNaN(age)) return "Unknown";
    if (age < 18) return "Child";
    if (age >= 18 && age < 45) return "Adult";
    return "Elder";
  };

  // GROUPED ANALYSIS
  const runAnalysis = (parsedRows) => {
    let map = { Child: 0, Adult: 0, Elder: 0, Unknown: 0 };

    parsedRows.forEach((r) => {
      const raw = r[col]?.trim();
      const grp = normalize(raw);
      map[grp] = (map[grp] || 0) + 1;
    });

    setGroups(map);
    setDetail(null);
  };

  // UPLOAD CSV → auto analyze
  const handleUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        setRows(res.data);
        runAnalysis(res.data);
      },
    });
  };

  // DRILL DOWN VIEW
  const drillDown = (category) => {
    let detailMap = {};

    rows.forEach((r) => {
      const raw = r[col]?.trim() || "";
      const grp = normalize(raw);

      if (grp === category) {
        // Use actual raw age values as keys
        detailMap[raw || "Unknown"] = (detailMap[raw || "Unknown"] || 0) + 1;
      }
    });

    setDetail({ category, items: detailMap });
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <h2 className="text-2xl font-semibold mb-2">Age Analysis</h2>
      <p className="text-gray-700 text-sm mb-4">
        This sidebar explores age distributions inside the dataset using grouped
        and detailed breakdown views. More explanation will be added here later.
      </p>

      {/* UPLOAD */}
      <label className="block text-sm font-semibold mb-1">Upload CSV</label>
      <input
        type="file"
        accept=".csv"
        onChange={handleUpload}
        className="text-sm mb-4"
      />

      {/* LEVEL 1 — GROUPED BARS */}
      {Object.keys(groups).length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-3">Age Groups</h3>

          <div className="flex items-end gap-6 mt-4 mb-10">
            {(() => {
              const maxVal = Math.max(...Object.values(groups));
              const maxHeight = 140;

              return Object.entries(groups).map(([label, value], idx) => {
                const h = (value / maxVal) * maxHeight;
                const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];

                return (
                  <div
                    key={label}
                    className="text-center cursor-pointer"
                    onClick={() => drillDown(label)}
                  >
                    <div
                      className="w-10 mx-auto rounded-t"
                      style={{
                        height: `${h}px`,
                        background: colors[idx],
                      }}
                    ></div>

                    <div className="text-sm mt-2">{label}</div>
                    <div className="text-xs text-gray-600">{value}</div>
                  </div>
                );
              });
            })()}
          </div>
        </>
      )}

      {/* LEVEL 2 — DETAILED BREAKDOWN */}
      {detail && (
        <>
          <hr className="my-6" />

          <h3 className="text-lg font-semibold mb-3">
            {detail.category} – Detailed Breakdown
          </h3>

          {Object.entries(detail.items).map(([label, value]) => (
            <div key={label} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span>{value}</span>
              </div>

              <div className="h-3 bg-gray-200 rounded">
                <div
                  className="h-full bg-blue-500 rounded"
                  style={{ width: `${Math.min(value * 3, 260)}px` }}
                ></div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
