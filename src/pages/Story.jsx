import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import { motion } from "framer-motion";

/**
 * Adjust this path to match where cleaned_data.csv actually lives
 * e.g. "/cleaned_data.csv" if it's in your public folder
 */
const CLEANED_DATA_PATH = "/cleaned_data.csv";

/* -----------------------------------------------------------
   SMALL DATA WIDGET — REPEAT OFFENDERS
----------------------------------------------------------- */

function RepeatOffenderStat() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Papa.parse(CLEANED_DATA_PATH, {
      download: true,
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data || [];

          const total = rows.length;
          const repeats = rows.filter((row) => {
            const val = row["NumberConvictions"];
            if (!val || typeof val !== "string") return false;
            return val.toLowerCase().includes("here");
          }).length;

          const percent = total > 0 ? (repeats / total) * 100 : 0;

          setStats({
            total,
            repeats,
            percent: Math.round(percent * 10) / 10,
          });
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError("Could not compute repeat-offender statistics.");
          setLoading(false);
        }
      },
      error: (err) => {
        console.error(err);
        setError("Could not load cleaned_data.csv.");
        setLoading(false);
      },
    });
  }, []);

  return (
    <motion.div
      className="w-full max-w-xl mx-auto rounded-2xl border border-white/20 
                 bg-white/5 px-6 py-5 text-center shadow-2xl"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h3 className="text-lg font-semibold mb-2">
        Repeat Offenders in This Dataset
      </h3>

      {loading && (
        <p className="text-sm text-white/70">
          Loading repeat-offender data…
        </p>
      )}

      {error && <p className="text-sm text-red-300">{error}</p>}

      {stats && !loading && !error && (
        <div className="space-y-2">
          <p className="text-2xl font-bold">
            {stats.repeats}{" "}
            <span className="text-base font-normal text-white/70">
              out of
            </span>{" "}
            {stats.total}
          </p>
          <p className="text-sm text-white/70">
            That’s about{" "}
            <span className="font-semibold text-white">
              {stats.percent}%
            </span>{" "}
            of the people in this dataset who left Eastern State and then came
            back here again.
          </p>
          <p className="text-xs text-white/60 mt-1">
            Repeat status is determined from the{" "}
            <code className="bg-black/40 px-1 py-0.5 rounded">
              NumberConvictions
            </code>{" "}
            column containing the word &quot;here&quot;.
          </p>
        </div>
      )}
    </motion.div>
  );
}

/* -----------------------------------------------------------
   PLACEHOLDER VISUAL BLOCKS (SWAP WITH REAL CHARTS LATER)
----------------------------------------------------------- */

function VisualBlock({ title, description }) {
  return (
    <motion.div
      className="w-full max-w-xl mx-auto rounded-2xl border border-white/15 
                 bg-white/5 px-6 py-5 text-center shadow-lg"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-white/75">{description}</p>
      {/* Replace this entire block with your actual chart component */}
    </motion.div>
  );
}

/* -----------------------------------------------------------
   DIALOGUE BUBBLES DATA
   zoom: true => triggers zoom-in feel for that moment
----------------------------------------------------------- */

const STORY_STEPS = [
  { type: "text", content: "Sit down. Let’s talk." },

  {
    type: "text",
    content:
      "Not as a historian, not as a designer—just as someone who has spent time with these numbers.",
  },

  {
    type: "text",
    content: "This place was built on a promise.",
  },

  {
    type: "text",
    content:
      "Its supporters believed solitude would heal the prisoner and make him whole again (Thibaut, p.189).",
  },

  {
    type: "text",
    content:
      "Silence would awaken remorse. Labor would instill discipline. Reading would deliver salvation (Thibaut, p.189).",
  },

  {
    type: "text",
    content:
      "They said the prisoner would emerge renewed, able to \"go forth into a new and industrious life\" (Thibaut, p.190).",
  },

  {
    type: "text",
    content: "This was supposed to be progress. Compassion. Modernity.",
  },

  // You showed them this earlier via other pages; we reference it
  {
    type: "text",
    content: "You saw who were inside these walls.",
  },

  {
    type: "text",
    content:
      "Young people. Often poor. Often with fragile work. Often already isolated long before they saw a cell.",
  },

  {
    type: "text",
    content:
      "That—THAT is the problem with this experiment. The theory assumed a psychologically stable, literate, motivated subject. The actual inmates did not match this model.",
  },

  {
    type: "text",
    content:
      "Almost half of the first prisoners in the historical records were partially or wholly illiterate (Thibaut, p.197).",
  },

  {
    type: "text",
    content: "How do you reform someone with books when he cannot read?",
  },

  // NEW: come closer sequence + zoom flag
  {
    type: "text",
    content: "Come here.",
  },

  {
    type: "text",
    content: "Come closer.",
  },

  {
    type: "text",
    content: "Look at this.",
  },
    // VISUAL: REPEAT OFFENDERS (zoom moment too)
  {
    type: "visual",
    zoom: true,
    visualId: "repeatOffenders",
  },

  {
    type: "text",
    zoom: true,
    content:
      "This is the number of people who have been reinstated in this very prison.",
  },

  {
    type: "text",
    zoom: true,
    content:
      "And this is only counting the ones who came back here. How many more ended up somewhere else?",
  },


  {
    type: "text",
    content: "I want you to sit with this for a moment.",
  },

  {
    type: "text",
    content:
      "These are people who left this prison… and then came back here again.",
  },

  {
    type: "text",
    content:
      "In a system that was supposed to \"cure\", the same people return. Not once in a while, often enough that it shows up clearly in the data.",
  },
  {
    type: "text",
    content: "But why any of this matter?",
  },
  {
    type: "text",
    content:
      "They were criminals, right? Didn’t they just get what they deserved?",
  },
  {
    type: "text",
    content:
      "Let me put it differently.",
  },
  {
    type: "text",
    content:
      "Think about the worst choice you made when you were young.",
  },
  {
    type: "text",
    content:
      "If we’re being honest, that number is probably more than one.",
  },
  {
    type: "text",
    content:
      "Now imagine making one of those same mistakes… but being punished to the harshest extend of the law while having no power, no money, no family, and no second chances.",
  },
  {
    type: "text",
    content:
      "That was the reality for many who entered these cells.",
  },
  {
    type: "text",
    content:
      "Isolation beyond imagination, for what? A moment of youth. A moment of poverty. A moment with no better options.",
  },
  {
    type: "text",
    content: "Because isolation here was not medicine.",
  },
  {
    type: "text",
    content: "It was harm.",
  },
  {
    type: "text",
    content:
      "Even in the nineteenth century, this system was worse than physical torture (Thibaut, p.188).",
  },
  {
    type: "text",
    content:
      "What does it says about us that we needed modern research to recognize suffering this visible.",
  },
  
  {
    type: "text",
    content:
      "Extended isolation reliably produces psychological distress and lasting harm (Haney, p.286–289).",
  },
  
  {
    type: "text",
    content:
      "Behind the smooth language of annual reports, the records list dark cells, bread-and-water diets, cold showers, straightjackets, iron gags (Thibaut, p.195).",
  },
  {
    type: "text",
    content:
      "The official reports spoke of obedience and order; they did not dwell on starvation, gas leaks, or men left in bare cells for weeks (Thibaut, p.194–196).",
  },
  {
    type: "text",
    content:
      "The system that claimed to \"soften\" the prisoner instead relied on slow, private forms of suffering to enforce control.",
  },
  
  {
    type: "text",
    content: "So let’s put the story together.",
  },
  {
    type: "text",
    content:
      "The separate system promised moral reform, but it was built around an imaginary prisoner, literate, stable, ready to change, who never matched the people actually locked inside.",
  },
  {
    type: "text",
    content:
      "It claimed to be more humane than the whip, yet it produced high levels of mental breakdown, suffering, and death (Thibaut, p.195–196; Haney, p.288–293).",
  },
  {
    type: "text",
    content:
      "And it claimed to protect society, yet your data shows people leaving and returning again, the cycle unbroken.",
  },
  {
    type: "text",
    content:
      "If the goal was reform, and the result was return, then the system failed on its own terms.",
  },
  {
    type: "text",
    content:
      "This system did not pave the way to penitence. It paved the way back here.",
  },
];  
/* -----------------------------------------------------------
   MAIN COMPONENT WITH TYPEWRITER + ZOOM
----------------------------------------------------------- */

export default function Story({ onBack }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef(null);
  const endRef = useRef(null);

  const currentStep = STORY_STEPS[stepIndex];
  const isZoomPhase = !!currentStep.zoom;

  // Typewriter effect
  useEffect(() => {
    const step = STORY_STEPS[stepIndex];

    // Clear any previous interval
    if (typingRef.current) {
      clearInterval(typingRef.current);
      typingRef.current = null;
    }

    if (step.type === "text") {
      setTypedText("");
      setIsTyping(true);

      const full = step.content;
      let i = 0;

      typingRef.current = setInterval(() => {
        i++;
        setTypedText(full.slice(0, i));
        if (i >= full.length) {
          if (typingRef.current) {
            clearInterval(typingRef.current);
            typingRef.current = null;
          }
          setIsTyping(false);
        }
      }, 25); // typing speed
    } else {
      // For visual steps, no typing
      setTypedText("");
      setIsTyping(false);
    }

    return () => {
      if (typingRef.current) {
        clearInterval(typingRef.current);
        typingRef.current = null;
      }
    };
  }, [stepIndex]);

  const handleAdvance = () => {
    const step = STORY_STEPS[stepIndex];

    if (step.type === "text" && isTyping) {
      // Finish typing instantly
      setTypedText(step.content);
      setIsTyping(false);
      if (typingRef.current) {
        clearInterval(typingRef.current);
        typingRef.current = null;
      }
      return;
    }

    // Move to next step
    setStepIndex((prev) =>
      prev < STORY_STEPS.length - 1 ? prev + 1 : prev
    );
  };

  // Auto-scroll to bottom when stepIndex changes
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [stepIndex]);

  return (
    <div
      className="w-screen h-screen text-white flex flex-col relative overflow-hidden
                 bg-gradient-to-b from-black via-slate-950 to-black"
      style={{ fontFamily: "sans-serif" }}
    >
      {/* subtle vignette / atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at top, rgba(148,163,184,0.3), transparent 55%), radial-gradient(circle at bottom, rgba(15,23,42,0.9), transparent 55%)",
        }}
      />

      {/* BACK BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (onBack) onBack();
        }}
        className="absolute top-5 left-5 bg-white/10 text-white 
                   px-4 py-2 rounded-lg backdrop-blur-md shadow-lg
                   hover:bg-white/20 transition z-20"
      >
        ← Back
      </button>

      {/* CLICK-TO-ADVANCE HINT */}
      <div className="absolute top-5 right-5 text-xs text-white/60 z-20">
        Click anywhere to skip or continue ▶
      </div>

      {/* MAIN CONTENT */}
      <motion.div
        className="flex-1 overflow-y-auto flex flex-col items-center px-4 py-16 relative z-10"
        onClick={handleAdvance}
        animate={{
          scale: isZoomPhase ? 1.06 : 1,
          filter: isZoomPhase ? "brightness(1.05)" : "brightness(1)",
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="max-w-3xl w-full space-y-6">
          {STORY_STEPS.slice(0, stepIndex + 1).map((step, idx) => {
            const isCurrent = idx === stepIndex;

            if (step.type === "text") {
              const textToShow =
                isCurrent && step.type === "text" ? typedText : step.content;

              return (
                <motion.div
                  key={idx}
                  className="w-full flex justify-center"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <div
                    className="max-w-xl bg-white/10 border border-white/15 
                               rounded-2xl px-6 py-4 text-center shadow-md
                               backdrop-blur-sm"
                  >
                    <p className="text-base md:text-lg leading-relaxed">
                      {textToShow}
                      {isCurrent && isTyping && (
                        <span className="inline-block w-2 ml-0.5 bg-white/70 animate-pulse">
                          &nbsp;
                        </span>
                      )}
                    </p>
                  </div>
                </motion.div>
              );
            }

            // VISUAL STEPS
            if (step.type === "visual") {
              if (step.visualId === "repeatOffenders") {
                return <RepeatOffenderStat key={idx} />;
              }

              if (step.visualId === "population") {
                return (
                  <VisualBlock
                    key={idx}
                    title="Who Was Inside These Walls?"
                    description="Insert your chart here that shows age, race, literacy, or occupation. This is where the user sees that the prison filled with young, poor, and often illiterate people—not the imaginary 'rational subject' the reformers wrote about."
                  />
                );
              }

              if (step.visualId === "punishments") {
                return (
                  <VisualBlock
                    key={idx}
                    title="Discipline and Punishment"
                    description="Insert a visual here showing punishments, conditions, or mortality if you have them—dark cells, bread-and-water, illness, or death. This visually contrasts with the 'humane' language in the official reports."
                  />
                );
              }

              if (step.visualId === "optional") {
                return (
                  <VisualBlock
                    key={idx}
                    title="Another Piece of the Story"
                    description="Use this slot for any additional visualization you want—race vs. sentence length, causes of death, or anything else that deepens your argument."
                  />
                );
              }
            }

            return null;
          })}

          <div ref={endRef} />
        </div>
      </motion.div>
    </div>
  );
}
