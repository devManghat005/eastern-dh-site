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
    // Prisoners
    { speaker: "George", text: "You ever make your way to the library?" },
    { speaker: "William", text: "I tried last week. Picked up a book, stared at the page, and it still felt like someone else's world." },
    { speaker: "Rich", text: "Same here. I kept thinking… if I could read better, maybe I'd understand how these people decide our sentences." },
  
    { speaker: "George", text: "There’s a whole room of knowledge sitting there, but half of us were never given the tools to use it." },
    { speaker: "William", text: "They say the library is meant to help us reflect. Hard to reflect on words you can’t unlock." },
  
    // Narrator (philosopher's voice)
    {
      speaker: null,
      text:
        "In this place, the library stands like a quiet promise, one that some men can enter fully, and others only glance at through a fog."
    },
    {
      speaker: null,
      text:
        "To read is not merely to follow letters on a page. It is to name the world, to understand the forces that shape one’s existence, and to recognize that no life is fated to silence."
    },
    {
      speaker: null,
      text:
        "But here, within these stone walls, the ability to read often marked the difference between being understood and being misjudged, between mercy and indifference."
    },
    {
      speaker: null,
      text:
        "Literacy does not erase the weight of punishment, yet it reshapes how a person navigates power… how they speak, how they defend themselves, how they are heard."
    },
    {
      speaker: null,
      text:
        "When we look at their ages, we must ask… what might their lives have been if their years had unfolded beyond these walls instead of within them?"
    }
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
