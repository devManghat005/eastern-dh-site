import React from "react";
import BackButton from "../components/BackButton";

export default function MethodsPage({ onBack }) {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-10 relative overflow-hidden">

      <BackButton onBack={onBack} />

      <h1 className="text-6xl font-bold mb-8 tracking-wide">
        Methods & Approach
      </h1>

      <p className="text-gray-300 max-w-4xl text-xl leading-relaxed mb-10">
        This project combines historical analysis, spatial computing, and
        digital humanities methodology. By integrating 3D models of the prison’s
        architecture with computational exploration of archival records, we
        develop a layered understanding of incarceration that highlights both
        structural design and human experience.
      </p>

      <p className="text-gray-300 max-w-4xl text-xl leading-relaxed">
        Techniques used in this project include:  
        • Archival transcription  
        • 3D spatial reconstruction  
        • Data normalization  
        • Digital storytelling  
        • Interactive visualization  
      </p>
    </div>
  );
}
