import React from "react";

export default function LetterPage({ onBack, onNavigate }) {
  return (
    <div
      className="min-h-screen w-full bg-black text-white flex flex-col items-center"
      style={{
        paddingTop: "80px",
        paddingBottom: "40px",
      }}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/40 transition"
      >
        Back
      </button>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-10">Letter</h1>

      {/* PDF Viewer */}
      <div
        style={{
          width: "85vw",
          maxWidth: "900px",
          height: "80vh",
          background: "#111",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 0 30px rgba(255,255,255,0.05)",
        }}
      >
        <iframe
          src="/letter.pdf"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title="Historical Letter"
        />
      </div>
    </div>
  );
}
