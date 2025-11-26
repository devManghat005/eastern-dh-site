import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  const [rawByRace, setRawByRace] = useState({});
  const [view, setView] = useState("summary");
  const [selectedRace, setSelectedRace] = useState(null);

  const scrollRef = useRef(null);
  const startedRef = useRef(false);

  const raceCol = "EthnicityReligionOccupation";
  const ageCol = "Age";
  const RACES = ["Black", "Mulatto", "Other"];

  /* ----------------------------------------
     REAL BACK BUTTON (MATCHES RACESIDEBAR)
  ---------------------------------------- */
  const BackButton = ({ onClick }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="mb-4 px-3 py-1 rounded border border-gray-500 text-white"
      style={{ background: "#000" }}
    >
      ← Back
    </button>
  );

  /* ----------------------------------------
     STORY SCRIPT
  ---------------------------------------- */
  const script = [
    { speaker: "Thomas", text: "You ever notice the ages in here? Some guys look like they just left home." },
    { speaker: "James", text: "Yeah. Then you turn a corner and see someone old enough to be your grandfather." },
    { speaker: "Thomas", text: "All of us doing time, but not the same kind of time." },
    { speaker: "James", text: "Yeah… a year hits a kid different than it hits a man with gray hair." },
    {
      speaker: null,
      text:
        "Two men may share the same walls, yet the weight of those walls is not equal. Age shapes how hardship settles in the mind."
    },
    {
      speaker: null,
      text:
        "Youth meets confinement with impatience, adulthood with resignation, and old age with a quiet reckoning of what remains."
    },
    {
      speaker: null,
      text:
        "When we look at their ages, we must ask: what might their lives have been if their years had unfolded beyond these walls instead of within them?"
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

  const bucketAgeCategory = (n) => {
    if (n < 21) return "youth";
    if (n < 45) return "adult";
    return "elder";
  };

  const makeHistogram = (list) => {
    const bins = {
      "≤20": 0,
      "21–30": 0,
      "31–40": 0,
      "41–50": 0,
      "51+": 0,
    };
    list.forEach((n) => {
      if (n <= 20) bins["≤20"]++;
      else if (n <= 30) bins["21–30"]++;
      else if (n <= 40) bins["31–40"]++;
      else if (n <= 50) bins["41–50"]++;
      else bins["51+"]++;
    });
    return bins;
  };

  /* ----------------------------------------
     ANALYSIS
  ---------------------------------------- */
  const runAnalysis = (rows) => {
    const global = { youth: 0, adult: 0, elder: 0, total: 0 };
    const rawAgesByRace = { Black: [], Mulatto: [], Other: [] };

    rows.forEach((r) => {
      const race = normalizeRace(r[raceCol]);
      const ageNum = Number(r[ageCol]);
      if (!ageNum || isNaN(ageNum)) return;

      global[bucketAgeCategory(ageNum)]++;
      global.total++;

      rawAgesByRace[race].push(ageNum);
    });

    setGlobalAges(global);
    setRawByRace(rawAgesByRace);
  };

  /* ----------------------------------------
     LOAD CSV
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

  const pct = (num, den) => (!den ? "0%" : ((num / den) * 100).toFixed(1) + "%");
  const widthPct = (num, den) => (!den ? "0%" : ((num / den) * 100).toFixed(1) + "%");

  /* ----------------------------------------
     SUMMARY BAR
  ---------------------------------------- */
  const renderGlobalBar = () => {
    const { youth, adult, elder, total } = globalAges;

    return (
      <div className="space-y-3">
        <div className="text-lg font-semibold">Age Distribution Across All Prisoners</div>

        <div
          className="w-full bg-gray-800 rounded h-5 overflow-hidden flex cursor-pointer"
          onClick={() => setView("race")}
        >
          <div className="h-full" style={{ width: widthPct(youth, total), background: "#3b82f6" }} />
          <div className="h-full" style={{ width: widthPct(adult, total), background: "#22c55e" }} />
          <div className="h-full" style={{ width: widthPct(elder, total), background: "#ef4444" }} />
        </div>

        <div className="text-xs text-gray-300 space-y-1">
          <div>Youth: {youth} ({pct(youth, total)})</div>
          <div>Adults: {adult} ({pct(adult, total)})</div>
          <div>Elders: {elder} ({pct(elder, total)})</div>
        </div>
      </div>
    );
  };

  /* ----------------------------------------
     RACE BARS
  ---------------------------------------- */
  const renderRaceBars = () => (
    <div className="space-y-5">

      <BackButton onClick={() => setView("summary")} />

      <div className="text-lg font-semibold">Age Distribution by Race</div>

      {RACES.map((race) => {
        const ages = rawByRace[race] || [];
        const total = ages.length;

        const youth = ages.filter((a) => a < 21).length;
        const adult = ages.filter((a) => a >= 21 && a < 45).length;
        const elder = ages.filter((a) => a >= 45).length;

        return (
          <div
            key={race}
            className="space-y-1 cursor-pointer"
            onClick={() => {
              setSelectedRace(race);
              setView("histogram");
            }}
          >
            <div className="flex justify-between text-sm text-gray-200">
              <span>{race}</span>
              <span>{total} prisoners</span>
            </div>

            <div className="w-full bg-gray-800 rounded h-4 overflow-hidden flex">
              <div className="h-full" style={{ width: widthPct(youth, total), background: "#3b82f6" }} />
              <div className="h-full" style={{ width: widthPct(adult, total), background: "#22c55e" }} />
              <div className="h-full" style={{ width: widthPct(elder, total), background: "#ef4444" }} />
            </div>
          </div>
        );
      })}
    </div>
  );

  /* ----------------------------------------
     RECHARTS HISTOGRAM
  ---------------------------------------- */
  const renderHistogram = () => {
    if (!selectedRace) return null;

    const hist = makeHistogram(rawByRace[selectedRace]);
    const data = Object.entries(hist).map(([label, count]) => ({
      bin: label,
      count,
    }));

    return (
      <div className="space-y-6">

        <BackButton onClick={() => setView("race")} />

        <div className="text-xl font-semibold">
          Age Distribution: {selectedRace}
        </div>

        <div className="w-full h-[320px] bg-transparent">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="bin" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                wrapperStyle={{ backgroundColor: "#222", border: "1px solid #555" }}
                labelStyle={{ color: "#eee" }}
                itemStyle={{ color: "#ccc" }}
              />
              <Bar
                dataKey="count"
                fill="#547C8A"
                stroke="#E6D3B1"
                strokeWidth={2}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    );
  };

  /* ----------------------------------------
     RENDER PAGE
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
              <span><b>{d.speaker}:</b> {d.text}</span>
            ) : (
              d.text
            )}
          </div>
        ))}
      </div>

      {/* DATA */}
      {ready && globalAges.total > 0 && (
        <div className="mt-6">
          {view === "summary" && renderGlobalBar()}
          {view === "race" && renderRaceBars()}
          {view === "histogram" && renderHistogram()}
        </div>
      )}
    </div>
  );
}
