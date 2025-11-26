import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";

export default function AgeSidebar() {
  /* ----------------------------------------
     STATE
  ---------------------------------------- */
  const [dialogue, setDialogue] = useState([]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [ready, setReady] = useState(false);

  const [globalAges, setGlobalAges] = useState({
    youth: 0,
    adult: 0,
    elder: 0,
    total: 0,
  });

  const [byRace, setByRace] = useState({});
  const [view, setView] = useState("summary");

  const scrollRef = useRef(null);
  const startedRef = useRef(false);

  /* ----------------------------------------
     CONSTANTS
  ---------------------------------------- */
  const raceCol = "EthnicityReligionOccupation";
  const ageCol = "Age";

  const RACES = ["Black", "Mulatto", "Other"];

  /* ----------------------------------------
     STORY SCRIPT (Philosophical Narrator - Marcus Aurelius)
  ---------------------------------------- */
  const script = [
    { speaker: "Thomas", text: "The years move strangely in here… sometimes slow as ash, sometimes gone in an instant." },
    { speaker: "James", text: "Some enter with youth still clinging to them. Others arrive already carrying the weight of a lifetime." },
    { speaker: "Thomas", text: "Strange, isn’t it? We share the same walls, yet time presses differently upon each of us." },
    { speaker: "James", text: "Some had decades stripped away. Others never possessed decades to lose." },

    {
      speaker: null,
      text:
        "Time, like justice, presses unequally upon human lives. It does not ask who is prepared for its weight. It simply descends."
    },
    {
      speaker: null,
      text:
        "Let us look beyond two men in conversation and toward the many who passed beneath these arches."
    },
    {
      speaker: null,
      text:
        "Let us consider who they were when they entered these walls—youthful, grown, or already near their final pages."
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

  const bucketAge = (num) => {
    const n = Number(num);
    if (!n || isNaN(n)) return null;
    if (n < 21) return "youth";
    if (n < 45) return "adult";
    return "elder";
  };

  /* ----------------------------------------
     ANALYSIS
  ---------------------------------------- */
  const runAnalysis = (rows) => {
    const global = { youth: 0, adult: 0, elder: 0, total: 0 };
    const raceBuckets = {};

    RACES.forEach((r) => {
      raceBuckets[r] = { youth: 0, adult: 0, elder: 0, total: 0 };
    });

    rows.forEach((r) => {
      const race = normalizeRace(r[raceCol]);
      const bucket = bucketAge(r[ageCol]);

      if (!bucket) return;

      global[bucket]++;
      global.total++;

      raceBuckets[race][bucket]++;
      raceBuckets[race].total++;
    });

    setGlobalAges(global);
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
    if (!startedRef.current) {
      startedRef.current = true;
      advanceDialogue();
    }
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [dialogue, view]);

  /* ----------------------------------------
     HELPERS
  ---------------------------------------- */
  const pct = (num, den) => (!den ? "0%" : ((num / den) * 100).toFixed(1) + "%");
  const widthPct = (num, den) => (!den ? "0%" : ((num / den) * 100).toFixed(1) + "%");

  /* ----------------------------------------
     UI COMPONENTS
  ---------------------------------------- */
  const renderGlobalBar = () => {
    const { youth, adult, elder, total } = globalAges;

    return (
      <div className="space-y-3">
        <div className="text-lg font-semibold">Age Distribution Across All Prisoners</div>

        <div className="w-full bg-gray-800 rounded h-5 overflow-hidden flex">
          <div className="h-full" style={{ width: widthPct(youth, total), background: "#3b82f6" }} />
          <div className="h-full" style={{ width: widthPct(adult, total), background: "#22c55e" }} />
          <div className="h-full" style={{ width: widthPct(elder, total), background: "#ef4444" }} />
        </div>

        <div className="text-xs text-gray-300 space-y-1">
          <div>Youth: {youth} ({pct(youth, total)})</div>
          <div>Adults: {adult} ({pct(adult, total)})</div>
          <div>Elders: {elder} ({pct(elder, total)})</div>
        </div>

        <button
          className="mt-4 px-4 py-2 bg-blue-600 rounded text-white font-semibold text-sm"
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

  const renderRaceBars = () => (
    <div className="space-y-5">
      <button
        className="mb-3 px-3 py-1 border border-gray-600 rounded text-white text-xs"
        onClick={() => setView("summary")}
      >
        ← Back to Overall
      </button>

      <div className="text-lg font-semibold">Age Distribution by Race</div>

      {RACES.map((race) => {
        const s = byRace[race];
        return (
          <div key={race} className="space-y-1">
            <div className="flex justify-between text-sm text-gray-200">
              <span>{race}</span>
              <span>{s.total} prisoners</span>
            </div>

            <div className="w-full bg-gray-800 rounded h-4 overflow-hidden flex">
              <div className="h-full" style={{ width: widthPct(s.youth, s.total), background: "#3b82f6" }} />
              <div className="h-full" style={{ width: widthPct(s.adult, s.total), background: "#22c55e" }} />
              <div className="h-full" style={{ width: widthPct(s.elder, s.total), background: "#ef4444" }} />
            </div>

            <div className="text-[11px] text-gray-300">
              Youth: {s.youth} | Adults: {s.adult} | Elders: {s.elder}
            </div>
          </div>
        );
      })}
    </div>
  );

  /* ----------------------------------------
     MAIN RENDER
  ---------------------------------------- */
  return (
    <div
      ref={scrollRef}
      onClick={advanceDialogue}
      className="
        p-6 
        overflow-y-auto 
        overflow-x-hidden
        font-serif 
        h-full 
        w-full 
        max-w-full
        bg-black 
        text-white
      "
      style={{ cursor: "pointer" }}
    >
      {/* STORY */}
      <div className="space-y-3 mb-6 break-words">
        {dialogue.map((d, i) => (
          <div key={i} className={d.speaker ? "text-gray-200" : "text-gray-300 italic"}>
            {d.speaker ? <span><b>{d.speaker}:</b> {d.text}</span> : d.text}
          </div>
        ))}
      </div>

      {/* DATA */}
      {ready && globalAges.total > 0 && (
        <div className="mt-6">
          {view === "summary" ? renderGlobalBar() : renderRaceBars()}
        </div>
      )}
    </div>
  );
}
