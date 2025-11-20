import React from "react";
import BackButton from "../components/BackButton";

export default function BibliographyPage({ onBack }) {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-10 relative overflow-hidden">

      <BackButton onBack={onBack} />

      <h1 className="text-6xl font-bold mb-8 tracking-wide">
        Bibliography
      </h1>

      <p className="text-gray-300 max-w-4xl text-xl leading-relaxed mb-10">
        Below is a curated list of the archival sources, research material, and
        digital humanities scholarship referenced in the development of this
        project.
      </p>

      <ul className="list-disc pl-10 text-xl text-gray-300 space-y-4 max-w-4xl">
        <li>
          Eastern State Penitentiary Archival Records, Admission Books, and
          Administrative Documents.
        </li>
        <li>
          Digital Humanities literature on spatial storytelling and immersive
          reconstruction.
        </li>
        <li>
          Scholarship on incarceration history, carceral geography, and prison
          architecture.
        </li>
      </ul>
    </div>
  );
}
