import React from "react";
import BackButton from "../components/BackButton";

export default function MethodsPage({ onBack }) {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-10 relative overflow-hidden">

      <BackButton onBack={onBack} />

      {/* PAGE TITLE */}
      <h1 className="text-6xl font-bold mb-12 tracking-wide">Methods & Approach</h1>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl text-xl text-gray-300 leading-relaxed space-y-14 text-justify">

        {/* INTRODUCTION */}
        <div>
          <p>
            This project brings together historical data, storytelling, interactive
            3D design, and simple forms of computational analysis. The goal is not
            to produce statistical certainty but to help viewers explore a historical
            dataset while understanding the environment that shaped it. Each sidebar
            in the corridor performs one focused analysis using the original
            admissions records from Eastern State Penitentiary. These methods
            explain exactly what was done, why it was done, and what each
            visualization represents.
          </p>
        </div>

        {/* ANALYSIS 1 — Race × Crime × Sentencing */}
        <div>
          <h2 className="text-3xl font-semibold mb-3 text-white">
            1. Crime, Race, and Average Sentences
          </h2>

          <p>
            The first analysis studies how sentences differed across the three racial
            categories that could be reliably extracted from the
            <span className="font-semibold text-white"> EthnicityReligionOccupation </span>
            column. The categories used were Black, Mulatto, and Other. Since the
            historical column mixes race, religion, and occupation, this step involved a
            simple text-matching function to classify the entries as consistently as
            possible.
          </p>

          <p className="mt-3">
            Each sentence length was converted into months by searching the
            <span className="font-semibold text-white"> Sentencing </span>
            column for patterns such as “2 yr” or “14 mo.” Only entries with a
            recognizable duration were included. The analysis then grouped sentences
            by offense type and race, calculated the average sentence within each
            group, and displayed the eight most common crimes in a heatmap.
          </p>

          <p className="mt-3">
            In this heatmap, rows represent crimes and columns represent racial
            categories. Each cell shows the average sentence for that group. Darker
            colors indicate longer average sentences. The purpose of this visualization
            is not to claim direct causation but to help viewers explore how sentencing
            patterns varied across groups and offenses.
          </p>
        </div>

        {/* ANALYSIS 2 — Age Distribution */}
        <div>
          <h2 className="text-3xl font-semibold mb-3 text-white">
            2. Age Distribution and Life Stages
          </h2>

          <p>
            This analysis focuses on the ages recorded at admission. Each prisoner’s
            age was placed into one of three broad life-stage categories:
            <span className="font-semibold text-white"> youth (under 21), adult (21–44), </span>
            and
            <span className="font-semibold text-white"> elder (45+).</span>
            These categories were chosen because they reveal how differently a prison
            sentence might affect people at different stages of their life.
          </p>

          <p className="mt-3">
            The first visualization is a bar showing the overall distribution across
            these categories. The width of each colored section is proportional to how
            many prisoners belonged to that age group. Users can then view the same
            categories broken down by race, which creates three separate stacked bars.
            Each bar shows the share of youth, adults, and elders within that racial
            category.
          </p>

          <p className="mt-3">
            A final layer allows viewers to open a histogram for each race. The x-axis
            represents age bins (for example, 21–30 or 31–40), and the y-axis shows the
            number of prisoners in each bin. Together, these charts help viewers see
            whether certain groups were more likely to enter the system as teenagers,
            working-age adults, or older men.
          </p>
        </div>

        {/* ANALYSIS 3 — Literacy */}
        <div>
          <h2 className="text-3xl font-semibold mb-3 text-white">
            3. Literacy at Admission
          </h2>

          <p>
            Because the ledger included inconsistent comments about literacy, all
            literacy-related entries were manually reviewed and converted into a new
            numeric
            <span className="font-semibold text-white"> Literacy </span>
            column. This conversion used three categories:
          </p>

          <ul className="list-disc ml-6 mt-3 space-y-1">
            <li><span className="font-semibold text-white">0</span> — cannot read or write</li>
            <li><span className="font-semibold text-white">1</span> — can read</li>
            <li><span className="font-semibold text-white">3</span> — can read and write</li>
          </ul>

          <p className="mt-3">
            Using this new field, the analysis creates an overall literacy
            distribution bar. Each segment represents the proportion of prisoners
            described as illiterate, semi-literate, or literate. A second view displays
            the same categories broken down by race. Each racial category receives its
            own stacked bar showing how literacy was recorded within that group.
          </p>

          <p className="mt-3">
            These charts help reveal how differently prisoners entered the system in
            terms of reading ability. Literacy shaped access to religious material,
            personal reflection, letter writing, and opportunities for self-advocacy,
            making it an important part of understanding the experience of confinement.
          </p>
        </div>

        {/* ANALYSIS 4 — Pardons */}
        <div>
          <h2 className="text-3xl font-semibold mb-3 text-white">
            4. Pardon Outcomes and the “Mercy Coin”
          </h2>

          <p>
            The final analysis examines pardons using the
            <span className="font-semibold text-white"> DischargeNote </span>
            column. Any entry containing “pard” was counted as a pardon. The analysis
            computes the overall pardon rate and then calculates separate pardon rates
            for Black, Mulatto, and Other prisoners.
          </p>

          <p className="mt-3">
            The visualization compares each group’s rate to the overall average. A bar
            shorter than the average shows that a group was pardoned less frequently,
            while a bar above the average shows a higher rate. This allows viewers to
            explore how mercy was distributed across categories.
          </p>

          <p className="mt-3">
            To make this pattern easier to feel rather than just observe, the analysis
            includes a coin-toss simulation. Each racial category receives a coin
            weighted by its historical chance of being pardoned. Users can flip each
            coin repeatedly to see how long it takes to receive a “pardon.” The
            simulation tracks the number of attempts, streaks of failures, and the toss
            count at the first success.
          </p>

          <p className="mt-3">
            This simple interaction demonstrates how uneven probabilities shape lived
            experience. Even when outcomes are left to chance, the results follow the
            historical patterns embedded in the data.
          </p>
        </div>

        {/* TECHNIQUES SECTION */}
        <div className="pt-4">
          <h2 className="text-3xl font-semibold mb-3 text-white">Techniques Used</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>CSV parsing and data cleaning</li>
            <li>Manual recoding of literacy fields</li>
            <li>Race normalization from mixed identity categories</li>
            <li>Sentence parsing and conversion into numeric months</li>
            <li>Interactive data visualization inside a 3D environment</li>
            <li>Bar charts, histograms, and heatmaps</li>
            <li>Weighted probability simulation</li>
            <li>Narrative-driven user flow and proximity triggers</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
