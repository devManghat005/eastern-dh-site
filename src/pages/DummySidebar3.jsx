import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";

export default function SentenceSidebar() {
  /* ----------------------------------------
     STATE
  ---------------------------------------- */
  const [dialogue, setDialogue] = useState([]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [ready, setReady] = useState(false);

  const [globalDist, setGlobalDist] = useState({
    ill: 0,
    semi: 0,
    lit: 0,
    total: 0,
  });

  const [byRace, setByRace] = useState({});
  const [view, setView] = useState("summary"); // "summary" | "race"

  const scrollRef = useRef(null);
  const startedRef = useRef(false);

  /* ----------------------------------------
     CONSTANTS
  ---------------------------------------- */
  const raceCol = "EthnicityReligionOccupation";
  const litCol = "Literacy"; // 0 = illiterate, 1 = semi, 3 = literate

  const RACES = ["Black", "Mulatto", "Other"];

  /* ----------------------------------------
     STORY SCRIPT
  ---------------------------------------- */
  const script = [
    { speaker: "George", text: "Sentencing day always comes too fast." },
    { speaker: "William", text: "Some men get five years… some fifteen… for the same damn crime." },
    { speaker: "Rich", text: "Maybe they look kindly on certain people." },
    { speaker: "George", text: "Maybe it's luck… maybe it's mercy… maybe it's something else entirely." },
    { speaker: "William", text: "We all committed wrongs… but why are the punishments so different?" },
    { speaker: "Rich", text: "I pray tomorrow is fair." },
    { speaker: "George", text: "I pray mercy is evenly given." },
    { speaker: "William", text: "I hope justice is blind." },

    { speaker: null, text: "These are the voices of three men waiting for their sentence." },
    { speaker: null, text: "But there were hundreds like them behind the stone walls of Eastern State." },
    { speaker: null, text: "Did literacy shape the fate of prisoners here?" },
    { speaker: null, text: "Let us step back and examine the record itself." },
  ];

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

  const bucketLiteracy = (val) => {
    const n = Number(val);
    if (n === 0) return "ill";
    if (n === 1) return "semi";
    if (n === 3) return "lit";
    return null;
  };

  /* ----------------------------------------
     ANALYSIS
  ---------------------------------------- */
  const runAnalysis = (rows) => {
    const global = { ill: 0, semi: 0, lit: 0, total: 0 };

    const raceBuckets = {};
    RACES.forEach((r) => {
      raceBuckets[r] = { ill: 0, semi: 0, lit: 0, total: 0 };
    });

    rows.forEach((r) => {
      const race = normalizeRace(r[raceCol]);
      const bucket = bucketLiteracy(r[litCol]);

      if (!bucket) return;

      global[bucket] += 1;
      global.total += 1;

      if (!raceBuckets[race]) {
        raceBuckets[race] = { ill: 0, semi: 0, lit: 0, total: 0 };
      }
      raceBuckets[race][bucket] += 1;
      raceBuckets[race].total += 1;
    });

    setGlobalDist(global);
    setByRace(raceBuckets);
  };

  /* ----------------------------------------
     AUTO LOAD CSV
  ---------------------------------------- */
  useEffect(() => {
    fetch("/cleaned_data.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (res) => runAnalysis(res.data),
        });
      });
  }, []);

  /* ----------------------------------------
     STORY ADVANCE
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
  }, [dialogue, view]);

  /* ----------------------------------------
     FORMAT HELPERS
  ---------------------------------------- */
  const pct = (num, den) => {
    if (!den) return "0%";
    return ((num / den) * 100).toFixed(1) + "%";
  };

  const widthPct = (num, den) => {
    if (!den) return "0%";
    return ((num / den) * 100).toFixed(1) + "%";
  };

  /* ----------------------------------------
     UI RENDER HELPERS
  ---------------------------------------- */
  const renderGlobalBar = () => {
    const { ill, semi, lit, total } = globalDist;

    return (
      <div className="space-y-3">
        <div className="text-lg font-semibold">
          Literacy Across All Prisoners
        </div>

        <div className="text-xs text-gray-400">
          This bar shows the share of all recorded prisoners who were
          described as illiterate, semi-literate, or literate at admission.
        </div>

        <div className="w-full bg-gray-800 rounded h-5 overflow-hidden flex">
          <div
            style={{
              width: widthPct(ill, total),
              background: "#ef4444", // red
            }}
            className="h-full"
          />
          <div
            style={{
              width: widthPct(semi, total),
              background: "#eab308", // yellow
            }}
            className="h-full"
          />
          <div
            style={{
              width: widthPct(lit, total),
              background: "#3b82f6", // blue
            }}
            className="h-full"
          />
        </div>

        <div className="text-xs text-gray-300 space-y-1">
          <div>
            <span className="inline-block w-3 h-3 rounded-sm mr-2" style={{ background: "#ef4444" }} />
            Illiterate: <b>{ill}</b> inmates ({pct(ill, total)})
          </div>
          <div>
            <span className="inline-block w-3 h-3 rounded-sm mr-2" style={{ background: "#eab308" }} />
            Semi-literate: <b>{semi}</b> inmates ({pct(semi, total)})
          </div>
          <div>
            <span className="inline-block w-3 h-3 rounded-sm mr-2" style={{ background: "#3b82f6" }} />
            Literate: <b>{lit}</b> inmates ({pct(lit, total)})
          </div>
        </div>

        <button
          className="mt-4 px-4 py-2 bg-blue-600 rounded text-white font-semibold text-sm"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            setView("race");
          }}
        >
          Compare by Race →
        </button>
      </div>
    );
  };

  const renderRaceBars = () => {
    return (
      <div className="space-y-5">
        <button
          className="mb-3 px-3 py-1 border border-gray-600 rounded text-white text-xs"
          style={{ background: "#000", cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            setView("summary");
          }}
        >
          ← Back to Overall Literacy
        </button>

        <div className="text-lg font-semibold mb-1">
          Literacy Distribution by Race
        </div>

        <div className="text-xs text-gray-400 mb-4">
          Each bar shows how literacy was recorded within a racial category.
          The colored segments represent illiterate, semi-literate, and literate prisoners.
        </div>

        {RACES.map((race) => {
          const stats = byRace[race] || { ill: 0, semi: 0, lit: 0, total: 0 };
          const { ill, semi, lit, total } = stats;

          return (
            <div key={race} className="space-y-1">
              <div className="flex justify-between text-sm text-gray-200">
                <span>{race}</span>
                <span>{total} inmates</span>
              </div>

              <div className="w-full bg-gray-800 rounded h-4 overflow-hidden flex">
                <div
                  style={{
                    width: widthPct(ill, total),
                    background: "#ef4444",
                  }}
                  className="h-full"
                />
                <div
                  style={{
                    width: widthPct(semi, total),
                    background: "#eab308",
                  }}
                  className="h-full"
                />
                <div
                  style={{
                    width: widthPct(lit, total),
                    background: "#3b82f6",
                  }}
                  className="h-full"
                />
              </div>

              <div className="text-[11px] text-gray-300">
                Illiterate: <b>{ill}</b> &nbsp;|&nbsp; Semi-literate: <b>{semi}</b> &nbsp;|&nbsp; Literate: <b>{lit}</b>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  /* ----------------------------------------
     MAIN RENDER
  ---------------------------------------- */
  return (
    <div
      ref={scrollRef}
      onClick={advanceDialogue}
      className="p-6 overflow-y-auto font-serif"
      style={{ background: "#000", height: "100%", color: "white", cursor: "pointer" }}
    >
      {/* STORY */}
      <div className="space-y-3 mb-6">
        {dialogue.map((d, i) => (
          <div key={i} className={d.speaker ? "text-gray-200" : "text-gray-300 italic"}>
            {d.speaker ? (
              <span>
                <b>{d.speaker}:</b> {d.text}
              </span>
            ) : (
              d.text
            )}
          </div>
        ))}
      </div>

      {/* DATA LAYERS */}
      {ready && globalDist.total > 0 && (
        <div className="mt-6">
          {view === "summary" && renderGlobalBar()}
          {view === "race" && renderRaceBars()}
        </div>
      )}
    </div>
  );
}
