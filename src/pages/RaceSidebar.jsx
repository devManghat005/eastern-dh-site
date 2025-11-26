import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";

export default function RaceSidebar() {
  /* ----------------------------------------
     STATE
  ---------------------------------------- */
  const [dialogue, setDialogue] = useState([]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [ready, setReady] = useState(false);

  const [heatmap, setHeatmap] = useState({});
  const [crimes, setCrimes] = useState([]);
  const [view, setView] = useState("summary"); // summary | heatmap

  const [globalAvg, setGlobalAvg] = useState(0);

  const scrollRef = useRef(null);
  const startedRef = useRef(false);

  /* ----------------------------------------
     CONSTANTS
  ---------------------------------------- */
  const raceCol = "EthnicityReligionOccupation";
  const offenseCol = "Offense";
  const sentCol = "Sentencing";

  const RACES = ["Black", "Mulatto", "Other"];

  /* ----------------------------------------
     HELPERS
  ---------------------------------------- */
  const normalizeRace = (raw) => {
    if (!raw) return "Other";
    const v = String(raw).toLowerCase();
    if (v.includes("black") && !v.includes("smith")) return "Black";
    if (v.includes("mul")) return "Mulatto";
    return "Other";
  };

  const parseMonths = (raw) => {
    if (!raw) return null;
    const s = raw.toLowerCase();
    const y = s.match(/(\d+)\s*yr/) ? parseInt(s.match(/(\d+)\s*yr/)[1]) : 0;
    const m = s.match(/(\d+)\s*mo/) ? parseInt(s.match(/(\d+)\s*mo/)[1]) : 0;
    if (!y && !m) return null;
    return y * 12 + m;
  };

  /* ----------------------------------------
     DIALOGUE SCRIPT
  ---------------------------------------- */
  const script = [
    { speaker: "Christian", text: "You hear those chains dragging in the corridor? Thought they were coming for me." },
    { speaker: "Lyman", text: "They change the route each night. It's not silence they're after, it's uncertainty." },
    { speaker: "Christian", text: "How long you reckon we’ll be here? Months? Years?" },
    { speaker: "Lyman", text: "Time isn't measured in years here. It's measured in who they imagine you to be." },
    { speaker: "Christian", text: "Strange… the crime feels smaller than the sentence." },
    { speaker: "Lyman", text: "Some men carry punishment heavier than guilt." },
    { speaker: null, text: "In places like these, justice is not always blind… sometimes, it closes only one eye." },
    { speaker: null, text: "We must confront a sobering truth: not all men stand before judgment on equal ground." },
    { speaker: null, text: "The measure of a sentence reflects more than the crime, it reveals the conscience of the society that delivers it." },
    { speaker: null, text: "I have a dream… however, I am but a humble bystander. We aren't here for me." },
    { speaker: null, text: "Let us listen closer to the whispers." },
  ];

  /* ----------------------------------------
     ANALYSIS
  ---------------------------------------- */
  const runAnalysis = (parsed) => {
    const crimeMap = {};
    const allMonths = [];

    parsed.forEach((r) => {
      const race = normalizeRace(r[raceCol]);
      const crime = (r[offenseCol] || "").trim();
      const months = parseMonths(r[sentCol]);

      if (!crime || months === null) return;

      allMonths.push(months);

      if (!crimeMap[crime]) {
        crimeMap[crime] = { Black: [], Mulatto: [], Other: [] };
      }
      crimeMap[crime][race].push(months);
    });

    const globalAvgCalc =
      allMonths.length > 0
        ? allMonths.reduce((a, b) => a + b, 0) / allMonths.length
        : 0;

    setGlobalAvg(globalAvgCalc);

    const ranked = Object.entries(crimeMap)
      .sort((a, b) => {
        const A = Object.values(a[1]).reduce((s, v) => s + v.length, 0);
        const B = Object.values(b[1]).reduce((s, v) => s + v.length, 0);
        return B - A;
      })
      .slice(0, 8)
      .map((e) => e[0]);

    const hm = {};

    ranked.forEach((crime) => {
      hm[crime] = {};
      RACES.forEach((race) => {
        const arr = crimeMap[crime][race];
        if (!arr.length) {
          hm[crime][race] = null;
        } else {
          hm[crime][race] = arr.reduce((a, b) => a + b, 0) / arr.length;
        }
      });
    });

    setCrimes(ranked);
    setHeatmap(hm);
    setView("summary");
  };

  /* ----------------------------------------
     AUTO LOAD CSV
  ---------------------------------------- */
  useEffect(() => {
    fetch("/cleaned_data.csv")
      .then(res => res.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (res) => runAnalysis(res.data),
        });
      });
  }, []);

  /* ----------------------------------------
     STORY CONTROL
  ---------------------------------------- */
  const advanceDialogue = () => {
    if (storyIndex < script.length) {
      setDialogue((d) => [...d, script[storyIndex]]);
      setStoryIndex((i) => i + 1);
    } else {
      setReady(true);
    }
  };

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    advanceDialogue();
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [dialogue]);

  /* ----------------------------------------
     FORMAT HELPERS
  ---------------------------------------- */
  const fmt = (m) => {
    if (m == null) return "—";
    const y = Math.floor(m / 12);
    const mo = Math.round(m % 12);
    if (!y) return `${mo}m`;
    if (!mo) return `${y}y`;
    return `${y}y ${mo}m`;
  };

  /* ----------------------------------------
     RENDER
  ---------------------------------------- */
  return (
    <div
      ref={scrollRef}
      onClick={advanceDialogue}
      className="p-6 overflow-y-auto"
      style={{ background: "#000", height: "100%", color: "white", cursor: "pointer" }}
    >

      {/* STORY */}
      <div className="space-y-3 mb-6">
        {dialogue.map((d, i) => (
          <div key={i} className="text-gray-200">
            {d.speaker ? (
              <span><b>{d.speaker}:</b> {d.text}</span>
            ) : (
              <i>{d.text}</i>
            )}
          </div>
        ))}
      </div>

      {/* AFTER STORY */}
      {ready && (
        <div className="mt-6">

          {view === "summary" && (
            <>
              <div className="text-sm text-gray-400 mb-4">
                Average sentencing time across all incarcerated individuals
              </div>

              <div className="text-2xl font-bold mb-6">
                {fmt(globalAvg)}
              </div>

              <button
                className="px-4 py-2 bg-blue-600 rounded text-white font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  setView("heatmap");
                }}
                style={{ cursor: "pointer" }}
              >
                View By Race
              </button>
            </>
          )}

          {view === "heatmap" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setView("summary");
                }}
                className="mb-4 px-3 py-1 rounded border border-gray-500 text-white"
                style={{ background: "#000" }}
              >
                ← Back
              </button>

              <div className="text-white font-semibold mb-3 text-lg">
                Race × Crime Sentencing Heatmap
              </div>

              <div className="overflow-x-auto pb-16">
                <table className="min-w-full border-collapse text-white text-sm">
                  <thead>
                    <tr>
                      <th className="border border-gray-700 px-2 py-1"></th>
                      {RACES.map(r => (
                        <th key={r} className="border border-gray-700 px-2 py-1">{r}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {crimes.map(crime => (
                      <tr key={crime}>
                        <td className="border border-gray-700 px-2 py-1 font-semibold">
                          {crime}
                        </td>

                        {RACES.map(r => {
                          const v = heatmap[crime][r];
                          return (
                            <td
                              key={r}
                              className="border border-gray-700 px-2 py-1 text-center"
                              style={{
                                background:
                                  v == null
                                    ? "rgba(40,40,40,1)"
                                    : v < 12
                                      ? "rgba(100,200,255,0.25)"
                                      : v < 36
                                        ? "rgba(100,200,255,0.45)"
                                        : v < 60
                                          ? "rgba(100,200,255,0.65)"
                                          : "rgba(100,200,255,0.9)",
                              }}
                            >
                              {fmt(v)}
                            </td>
                          );
                        })}

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
}
