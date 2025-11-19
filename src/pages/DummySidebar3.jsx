import React, { useState } from "react";
import Papa from "papaparse";

export default function DummySidebar3() {
  const [rows, setRows] = useState([]);
  const [groups, setGroups] = useState({});
  const [detail, setDetail] = useState(null);

  // Dummy column name — change later
  const col = "DummyColumn3";

  // Dummy grouping
  const normalize = (raw) => {
    if (!raw) return "GroupA";
    const v = raw.toLowerCase();
    if (v.includes("a")) return "GroupA";
    if (v.includes("b")) return "GroupB";
    return "Other";
  };

  const runAnalysis = (parsedRows) => {
    let map = { GroupA: 0, GroupB: 0, Other: 0 };

    parsedRows.forEach((r) => {
      const raw = r[col]?.trim();
      const grp = normalize(raw);
      map[grp] = (map[grp] || 0) + 1;
    });

    setGroups(map);
    setDetail(null);
  };

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

  const drillDown = (category) => {
    let detailMap = {};

    rows.forEach((r) => {
      const raw = r[col]?.trim() || "";
      const grp = normalize(raw);

      if (grp === category) {
        detailMap[raw] = (detailMap[raw] || 0) + 1;
      }
    });

    setDetail({ category, items: detailMap });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-2">Dummy Analysis – Group 3</h2>
      <p className="text-gray-700 text-sm mb-4">
        This is a placeholder sidebar for analysis. You can replace this with
        real logic later.
      </p>

      {/* Upload */}
      <label className="block text-sm font-semibold mb-1">Upload CSV</label>
      <input
        type="file"
        accept=".csv"
        onChange={handleUpload}
        className="text-sm mb-4"
      />

      {/* Grouped Bars */}
      {Object.keys(groups).length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-3">Dummy Groups</h3>

          <div className="flex items-end gap-6 mt-4 mb-10">
            {(() => {
              const maxVal = Math.max(...Object.values(groups));
              const maxHeight = 140;
              const colors = ["#3b82f6", "#10b981", "#8b5cf6"];

              return Object.entries(groups).map(([label, value], idx) => {
                const h = (value / maxVal) * maxHeight;

                return (
                  <div
                    key={label}
                    className="text-center cursor-pointer"
                    onClick={() => drillDown(label)}
                  >
                    <div
                      className="w-10 mx-auto rounded-t"
                      style={{ height: `${h}px`, background: colors[idx] }}
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

      {/* Detailed Breakdown */}
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
                  style={{
                    width: `${Math.min(value * 3, 260)}px`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
