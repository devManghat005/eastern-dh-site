import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";

export default function PardonSidebar() {

  /* ----------------------------------------
     STATE
  ---------------------------------------- */
  const [dialogue, setDialogue] = useState([]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [ready, setReady] = useState(false);

  const [globalStats, setGlobalStats] = useState(null);
  const [byRace, setByRace] = useState({});
  const [showRace, setShowRace] = useState(false);

  const [showCoins, setShowCoins] = useState(false);

  const [coinResults, setCoinResults] = useState({});
  const [coinStreaks, setCoinStreaks] = useState({});
  const [coinAnimating, setCoinAnimating] = useState({});

  // NEW: Track attempts and last successful attempts
  const [coinAttempts, setCoinAttempts] = useState({});
  const [lastPardonAttempts, setLastPardonAttempts] = useState({});

  const scrollRef = useRef(null);
  const startedRef = useRef(false);

  /* ----------------------------------------
     CONSTANTS
  ---------------------------------------- */
  const raceCol = "EthnicityReligionOccupation";
  const dischargeCol = "DischargeNote";
  const RACES = ["Black", "Mulatto", "Other"];

  const script = [
    { speaker: "Elijah", text: "Three years, and the walls still feel like they’re closing in." },
    { speaker: "Elijah", text: "They say some men are pardoned. Letters reach the governor. Names are read out." },
    { speaker: "Elijah", text: "I keep wondering if mine will ever sound right in someone else’s mouth." },
    { speaker: "Elijah", text: "Maybe they’ll see the good I once was. Or maybe I’m just another number on a page." },
    { speaker: "Elijah", text: "Some men seem to have better odds. Same prison, different chance." },
    { speaker: "Elijah", text: "If mercy is a coin toss… I’m afraid I know which way it falls for men like me." },

    { speaker: null, text:
      "Elijah waits for a pardon, yet what he truly waits for is recognition, the hope that someone will see more in him than the record of his offenses. He longs to be known again as a human soul capable of rising after a fall."
    },

    { speaker: null, text:
      "In Eastern State, a man does not only fear punishment. He fears being forgotten. He fears becoming a name that passes across a clerk’s desk without stirring even the faintest compassion."
    },

    { speaker: null, text:
      "A pardon is often spoken of as mercy, but mercy itself is rarely pure. It bends, it hesitates, it follows the invisible preferences of those who grant it. Even forgiveness has its patterns."
    },

    { speaker: null, text:
      "The prisoner waits in a silence deeper than the walls around him. His future will be decided far away from his cell by people who will never hear the trembling in his hope."
    },

    { speaker: null, text:
      "When we study these records, we must resist the urge to treat them as statistics. Each entry is a human plea. Each denial is a weight placed upon a living heart."
    },

    { speaker: null, text:
      "Here, we uncover an unsettling truth. Mercy, like punishment, does not fall evenly. It reflects the assumptions and fears of the society that chooses whom to redeem."
    },

    { speaker: null, text:
      "So we must ask ourselves one final question. If forgiveness depends on who asks for it, what does that reveal about the justice we claim to uphold?"
    },
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

  const isPardoned = (n) => {
    if (!n) return false;
    return String(n).toLowerCase().includes("pard");
  };

  /* ----------------------------------------
     ANALYSIS
  ---------------------------------------- */
  const analyze = (rows) => {
    const totals = { Black:0, Mulatto:0, Other:0 };
    const pardons = { Black:0, Mulatto:0, Other:0 };

    rows.forEach((r) => {
      const race = normalizeRace(r[raceCol]);
      totals[race]++;
      if (isPardoned(r[dischargeCol])) pardons[race]++;
    });

    const total = Object.values(totals).reduce((a,b)=>a+b,0);
    const pardTotal = Object.values(pardons).reduce((a,b)=>a+b,0);
    const rate = total ? pardTotal / total : 0;

    setGlobalStats({ total, pardons:pardTotal, rate });

    const stats = {};
    RACES.forEach(r => {
      const t = totals[r];
      const p = pardons[r];
      stats[r] = {
        total:t,
        pard:p,
        rate: t ? p/t : 0,
      };
    });

    setByRace(stats);
    setCoinResults({});
    setCoinStreaks({});
    setCoinAnimating({});

    // reset attempts counts on reload
    setCoinAttempts({});
    setLastPardonAttempts({});
  };

  /* ----------------------------------------
     AUTO LOAD CSV
  ---------------------------------------- */
  useEffect(() => {
    fetch("/cleaned_data.csv")
      .then(res => res.text())
      .then(text => {
        Papa.parse(text, {
          header:true,
          skipEmptyLines:true,
          complete:(res)=>analyze(res.data),
        });
      });
  }, []);

  /* ----------------------------------------
     STORY
  ---------------------------------------- */
  const advanceDialogue = () => {
    if (storyIndex < script.length) {
      setDialogue(d => [...d, script[storyIndex]]);
      setStoryIndex(i=>i+1);
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
  }, [dialogue,showRace,coinResults,showCoins]);

  /* ----------------------------------------
     COIN FLIP
  ---------------------------------------- */
  const flipCoin = (race) => {
    const p = byRace[race]?.rate ?? 0;
    const outcome = Math.random() < p;

    // count attempts
    setCoinAttempts(prev => ({
      ...prev,
      [race]: (prev[race] || 0) + 1
    }));

    setCoinAnimating(prev => ({
      ...prev,
      [race]: true
    }));

    setTimeout(() => {
      setCoinResults(prev => ({
        ...prev,
        [race]: outcome
      }));

      // record successful pardon attempt count
      if (outcome) {
        setLastPardonAttempts(prev => ({
          ...prev,
          [race]: coinAttempts[race] ? coinAttempts[race] + 1 : 1
        }));
      }

      setCoinStreaks(prev => {
        const last = prev[race] || { p:0, n:0 };
        let next = last;

        if (outcome) {
          next = { p:last.p+1, n:0 };
        } else {
          next = { p:0, n:last.n+1 };
        }

        return {
          ...prev,
          [race]: next
        };
      });

      setCoinAnimating(prev => ({
        ...prev,
        [race]: false
      }));
    }, 250);
  };

  const fmtPct = (x)=> (x*100).toFixed(1)+"%";


  /* ----------------------------------------
     UI
  ---------------------------------------- */
  return (
    <div
      ref={scrollRef}
      onClick={advanceDialogue}
      className="p-6 overflow-y-auto"
      style={{background:"#000",height:"100%",color:"white",cursor:"pointer"}}
    >

      {/* STORY */}
      <div className="space-y-3 mb-6">
        {dialogue.map((d,i)=>(
          <div key={i} className="text-gray-200">
            {d.speaker
              ? <span><b>{d.speaker}:</b> {d.text}</span>
              : <i>{d.text}</i>
            }
          </div>
        ))}
      </div>


      {ready && globalStats && (
        <div className="mt-6">

          {/* show race button */}
          {!showRace && (
            <button
              className="px-4 py-2 bg-blue-600 rounded text-white font-semibold"
              onClick={(e)=>{
                e.stopPropagation();
                setShowRace(true);
              }}
            >
              Compare by Race
            </button>
          )}

          {showRace && (
            <div className="mt-6 space-y-6">

              <div className="text-lg font-semibold mb-3">
                Pardon Disparities by Race
              </div>

              {RACES.map(r=>{
                const s = byRace[r];
                return (
                  <div key={r}>
                    <div className="flex justify-between mb-1 text-gray-300 text-sm">
                      <span>{r}</span>
                      <span>{fmtPct(s.rate)}</span>
                    </div>

                    <div className="w-full bg-gray-700 rounded h-4 overflow-hidden">
                      <div
                        className="h-full rounded"
                        style={{
                          width:`${(s.rate/globalStats.rate)*100}%`,
                          background:"rgba(100,200,255,0.6)"
                        }}
                      />
                    </div>

                    <div className="text-[11px] text-gray-400 mt-1">
                      {s.pard} pardoned of {s.total}
                    </div>
                  </div>
                );
              })}

              {/* open coins */}
              {!showCoins && (
                <button
                  className="mt-8 px-4 py-2 bg-white text-black border border-white rounded text-sm font-semibold"
                  onClick={(e)=> {
                    e.stopPropagation();
                    setShowCoins(true);
                  }}
                >
                  Open Coin Toss Simulation →
                </button>
              )}

              {/* coin section */}
              {showCoins && (
                <div className="mt-10 border-t border-gray-700 pt-6 space-y-5">
                  <div className="text-sm font-semibold">
                    The Mercy coin
                  </div>

                  <div className="text-xs text-gray-400">
                    Each racial group receives one weighted coin. Flip it as many times as you like. Lets see how long it takes for you to be pardoned.
                  </div>

                  <div className="grid gap-4">
                    {RACES.map(r=>{
                      const outcome = coinResults[r];

                      return (
                        <div
                          key={r}
                          onClick={(e)=>{
                            e.stopPropagation();
                            flipCoin(r);
                          }}
                          className="border border-gray-600 rounded p-4 bg-black cursor-pointer text-center"
                          style={{ userSelect:"none" }}
                        >
                          <div className="text-sm font-semibold mb-2">{r}</div>

                          <div
                            style={{
                              width:60,height:60,
                              margin:"0 auto",
                              borderRadius:"50%",
                              display:"flex",
                              alignItems:"center",
                              justifyContent:"center",
                              fontSize:"20px",
                              border:"2px solid white",
                              transition:"all .25s ease",
                              background:
                                outcome === true ? "white"
                              : outcome === false ? "#666"
                              : "#222",
                              color: outcome === true ? "black" : "white",
                              transform: coinAnimating[r]
                                ? "scale(.7) rotateY(180deg)"
                                : "scale(1) rotateY(0deg)"
                            }}
                          >
                            {outcome === true ? "P" : outcome === false ? "N" : "?"}
                          </div>

                          <div className="text-[11px] text-gray-400 mt-2">
                            {coinStreaks[r]?.p > 0 && <>Pardoned streak: {coinStreaks[r].p} </>}
                            {coinStreaks[r]?.n > 0 && <>Not pardoned streak: {coinStreaks[r].n} </>}
                            {!coinStreaks[r] && <>click to flip</>}

                            {/* stays visible until next pardon */}
                            {lastPardonAttempts[r] && (
                              <div className="mt-1 text-green-300">
                                Pardoned after {lastPardonAttempts[r]} tosses
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}
