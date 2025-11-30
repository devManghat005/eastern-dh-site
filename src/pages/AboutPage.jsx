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
          Eastern State Penitentiary was one of the most influential prisons in the United States. It was built on the idea that people could be reformed through strict isolation and constant surveillance, and its design shaped how prisons were built for decades. Its soaring Gothic walls, its perfect radial design, and its relentless focus on isolation made it the most admired and feared institution of its time. The pinnacle of human reformism. And within those walls, every person who entered was reduced to a set of details recorded in an admission book
          </p>

          <p className="text-gray-300 text-xl leading-relaxed mb-10 text-justify">
          This project is an interactive point-and-click game designed to help viewers understand the human impact of solitary confinement. Instead of reading about the past on a flat page, you walk through a recreated prison environment and engage with the history as it surrounds you. The goal is simple: to give you a sense of how the design of a space, the silence of a cell, and the gaps in old prison records can shape a person's life.

          </p>


        </div>

        {/* RIGHT IMAGE — NOW FLUSH AGAINST THE SCREEN EDGE */}
        <div className="w-[45%] flex justify-end">
          <img
            src="/images/sky.jpg"
            alt="Eastern State Penitentiary"
            className="w-full h-auto rounded-xl shadow-xl object-cover border border-white/10"
          />
        </div>

      </div>
    </div>
  );
}
