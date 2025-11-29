import React from "react";
import BackButton from "../components/BackButton";

export default function AboutPage({ onBack }) {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-10 relative overflow-hidden w-full">

      {/* BACK BUTTON */}
      <BackButton onBack={onBack} />

      {/* PAGE TITLE */}
      <h1 className="text-6xl font-bold mb-12 tracking-wide">About</h1>

      {/* FULL-WIDTH FLEX WRAPPER */}
      <div className="w-full flex justify-between items-start">

        {/* LEFT TEXT COLUMN — FIXED WIDTH FOR CLEAN READABILITY */}
        <div className="w-[55%] pr-10">

          <p className="text-gray-300 text-xl leading-relaxed mb-10 text-justify">
            This project is an interactive 3D point-and-click game designed to help
            viewers understand the human impact of solitary confinement. Instead of
            reading about the past on a flat page, you walk through a recreated prison
            environment and engage with the history as it surrounds you. The goal is
            simple: to give you a sense of how the design of a space, the silence of a
            cell, and the gaps in old prison records can shape a person's life.
          </p>

          <p className="text-gray-300 text-xl leading-relaxed mb-10 text-justify">
            The project brings together historical sources, inmate records, and modern web
            technology. A cleaned dataset of admissions from Eastern State Penitentiary is
            loaded in real time, and the names of incarcerated individuals appear on the
            walls as you walk. The narrator's voice reflects on how these people were
            understood and documented, and how the belief in reform through isolation
            eventually revealed its faults. By blending data, story, and space, the
            experience encourages viewers to think about the everyday realities of
            punishment and why the system failed to create the moral renewal it once
            promised.
          </p>

          <div className="text-gray-300 text-xl leading-relaxed text-justify">
            <p className="mb-4">Techniques used in this project include:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>3D environment building using React Three Fiber</li>
              <li>Interactive point-and-click navigation</li>
              <li>CSV data parsing and dynamic rendering of inmate records</li>
              <li>Procedural text placement and proximity-triggered narration</li>
              <li>Scene optimization, lighting, and spatial design</li>
              <li>Frontend storytelling through movement and environmental cues</li>
            </ul>
          </div>

        </div>

        {/* RIGHT IMAGE — NOW FLUSH AGAINST THE SCREEN EDGE */}
        <div className="w-[45%] flex justify-end">
          <img
            src="/images/prison.webp"
            alt="Eastern State Penitentiary"
            className="w-full h-auto rounded-xl shadow-xl object-cover border border-white/10"
          />
        </div>

      </div>
    </div>
  );
}
