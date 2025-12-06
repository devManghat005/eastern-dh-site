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
            Eastern State Penitentiary was one of the most influential prisons in the United States. It was built on the idea that people could be reformed through strict isolation and constant surveillance, and its design shaped how prisons were built for decades. Its soaring Gothic walls, its perfect radial design, and its relentless focus on isolation made it the most admired and feared institution of its time. The pinnacle of human reformism. And within those walls, every person who entered was reduced to a set of details recorded in an admission book.
          </p>

          <p className="text-gray-300 text-xl leading-relaxed mb-10 text-justify">
            This project is an interactive point-and-click game designed to help viewers understand the human impact of solitary confinement. Instead of reading about the past on a flat page, you walk through a recreated prison environment and engage with the history as it surrounds you. Our central research questions ask: how did isolation shape the lived experience of those imprisoned at Eastern State, and were its effects distributed equally across race, age, literacy, and sentencing outcomes? Our hypothesis is that solitary confinement did not operate as a neutral reform tool, but instead intensified existing social inequalities and produced uneven harm across different groups. Through an exploration of historical data, visual analysis, and narrative storytelling, the project invites viewers to test this hypothesis themselves by observing how patterns of punishment, mercy, and vulnerability emerge from the records. We hope that this project serves as a critique of the belief that crime could be cured through architecture, isolation, and “moral science”. 
          </p>

          {/* CONTRIBUTORS SECTION */}
          <h2 className="text-4xl font-bold mt-20 mb-6 tracking-wide">Contributors</h2>

          <p className="text-gray-300 text-xl leading-relaxed mb-6 text-justify">
            This project was built through the combined efforts of four team members, each contributing to different parts of the research, design, and technical development.
          </p>

          <ul className="text-gray-300 text-xl leading-relaxed space-y-5 text-justify">

            <li>
              <span className="font-semibold text-white">Dev Manghat</span> — Focused on technical development of the project, including the interactive game mechanics, React framework, and visual layout. Dev was also responsible for integrating the historical data into the experience and shaping how users move through the prison environment.
            </li>

            <li>
              <span className="font-semibold text-white">Liam MacDonald</span> — Focused on historical research and source analysis, helping interpret primary and secondary materials related to Eastern State Penitentiary. Liam helped in connecting historical themes to the narrative structure of the game.
            </li>

            <li>
              <span className="font-semibold text-white">Luke Sorensen</span> — Contributed to narrative development and dialogue writing, shaping how the human stories of confinement are presented to the player. Luke helped translate historical ideas into emotional, story-driven interactions.
            </li>

            <li>
              <span className="font-semibold text-white">Huangyi Ke</span> — Supported visual design, layout refinement, and user experience flow. Huangyi helped ensure that the visual presentation matched the emotional tone of the project and that the interface remained clear and immersive. Helped in finding secondary sources to help support the data in this project.
            </li>

          </ul>

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
