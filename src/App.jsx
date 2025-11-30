import React, { useState } from "react";

import ExteriorPage from "./pages/ExteriorPage";
import HomeWorld from "./pages/HomeWorld";
import AgeSidebar from "./pages/AgeSidebar"; 
import AboutPage from "./pages/AboutPage";
import MethodsPage from "./pages/MethodsPage";
import TransparencyPage from "./pages/TransparencyPage";
import BibliographyPage from "./pages/BibliographyPage";
import Story from "./pages/StoryCorridor";
import LetterPage from "./pages/Letter";   // ★ added

export default function App() {
  const [page, setPage] = useState("exterior");

  const navigate = (target) => {
    setPage(target);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* ---------------------------------------------------------
           GLOBAL PILL NAVBAR (WORKS ON EVERY PAGE)
      --------------------------------------------------------- */}
      <div
        className="
          absolute top-4 left-1/2 -translate-x-1/2 
          flex gap-6 px-8 py-3 
          bg-white/20 backdrop-blur-md 
          rounded-full shadow-lg 
          z-[2000] text-white font-semibold
        "
      >
        <button
          className="px-4 py-1 hover:text-yellow-300 transition"
          onClick={() => navigate("about")}
        >
          About
        </button>

        <button
          className="px-4 py-1 hover:text-yellow-300 transition"
          onClick={() => navigate("transparency")}
        >
          Data Transparency
        </button>

        <button
          className="px-4 py-1 hover:text-yellow-300 transition"
          onClick={() => navigate("methods")}
        >
          Methods
        </button>

        <button
          className="px-4 py-1 hover:text-yellow-300 transition"
          onClick={() => navigate("bibliography")}
        >
          Bibliography
        </button>
      </div>

      {/* ---------------------------------------------------------
           PAGE ROUTING
      --------------------------------------------------------- */}

      {page === "exterior" && (
        <ExteriorPage
          enterInterior={() => navigate("interior")}
          onNavigate={navigate}
        />
      )}

      {page === "interior" && (
        <HomeWorld
          onBack={() => navigate("exterior")}
          onExplore={() => navigate("story")}
        />
      )}

      {page === "story" && (
        <Story
          onNavigate={navigate}
          onBack={() => navigate("exterior")}
        />
      )}

      {page === "about" && (
        <AboutPage
          onNavigate={navigate}
          onBack={() => navigate("exterior")}
        />
      )}

      {page === "methods" && (
        <MethodsPage
          onNavigate={navigate}
          onBack={() => navigate("exterior")}
        />
      )}

      {page === "transparency" && (
        <TransparencyPage
          onNavigate={navigate}
          onBack={() => navigate("exterior")}
        />
      )}

      {page === "bibliography" && (
        <BibliographyPage
          onNavigate={navigate}
          onBack={() => navigate("exterior")}
        />
      )}

      {/* ★★★ NEW LETTER PAGE ROUTE ★★★ */}
      {page === "letter" && (
        <LetterPage
          onNavigate={navigate}
          onBack={() => navigate("exterior")}
        />
      )}
    </div>
  );
}
