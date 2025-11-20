import React from "react";
import BackButton from "../components/BackButton";

export default function TransparencyPage({ onBack }) {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-10 relative overflow-hidden">

      <BackButton onBack={onBack} />

      <h1 className="text-6xl font-bold mb-8 tracking-wide">
        Data Transparency
      </h1>

      <p className="text-gray-300 max-w-4xl text-xl leading-relaxed mb-10">
        We believe transparency is essential when working with historical data,
        especially when the material concerns vulnerable individuals. All
        datasets used in this project are sourced from public archival material
        and carefully handled to preserve both accuracy and dignity.
      </p>

      <p className="text-gray-300 max-w-4xl text-xl leading-relaxed">
        This section outlines the sources, cleaning steps, and interpretive
        choices made in developing the interactive components of this project.
        Any limitations or uncertainties in the data are clearly presented so
        that viewers may fully understand the context of the material.
      </p>
    </div>
  );
}
