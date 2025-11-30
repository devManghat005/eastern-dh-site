import React from "react";
import BackButton from "../components/BackButton";

export default function MethodsPage({ onBack }) {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-10 pb-32 relative overflow-hidden">

      <BackButton onBack={onBack} />

      {/* PAGE TITLE */}
      <h1 className="text-6xl font-bold mb-12 tracking-wide">Methods & Approach</h1>

      {/* MAIN CONTENT */}
      <div className="w-full text-xl text-gray-300 leading-relaxed space-y-24">

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
        <div className="flex gap-10 items-start w-full">
          <div className="flex-1">
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
              possible. Individuals were classified as Black when the descriptive text
              contained the word “black” on its own, while avoiding false matches such as the
              occupation “blacksmith.” They were classified as Mulatto whenever the text
              included “mulatto” or any shortened variation commonly found in the archival
              records. All remaining individuals, including those with occupational labels,
              religious identifiers, immigrant origins, blank entries, or anything not clearly
              indicating Black or Mulatto—were grouped into the Other category. This approach was adopted for clarity and consistency in the analysis, though future work could explore the diverse subgroups contained within the “Other” category in greater depth.
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

          {/* IMAGE A1 */}
          <img
            src="/images/A1.png"
            alt="Analysis 1 Visualization"
            className="w-80 rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* ANALYSIS 2 — Age Distribution */}
        <div className="flex gap-10 items-start w-full">
          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-3 text-white">
              2. Age Distribution and Life Stages
            </h2>

            <p>
              This analysis focuses on the ages recorded at admission, which are listed as integer values in the <span className="font-semibold text-white">Age</span> column of the dataset. Each prisoner’s age was placed into one of three broad life-stage categories: <span className="font-semibold text-white">youth (under 21), adult (21–44),</span> and <span className="font-semibold text-white">elder (45+).</span> These categories were chosen because they highlight how differently a prison sentence might shape the lives of people at distinct stages of personal and social development.
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

          {/* IMAGE A2 */}
          <img
            src="/images/A2.png"
            alt="Analysis 2 Visualization"
            className="w-80 rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* ANALYSIS 3 — Literacy */}
        <div className="flex gap-10 items-start w-full">
          <div className="flex-1">
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

          {/* IMAGE A3 */}
          <img
            src="/images/A3.png"
            alt="Analysis 3 Visualization"
            className="w-80 rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* ANALYSIS 4 — Pardons */}
        <div className="flex gap-10 items-start w-full">
          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-3 text-white">
              4. Pardon Outcomes and the “Mercy Coin”
            </h2>

            <p>
              The final analysis examines pardons using the
              <span className="font-semibold text-white"> DischargeNote </span>
              column. Any entry containing “pard” was counted as a pardon. This was done to avoid inconsistencies in spelling and formatting. The analysis
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

          {/* IMAGE A4 */}
          <img
            src="/images/A4.png"
            alt="Analysis 4 Visualization"
            className="w-80 rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* TEMP BOTTOM LINE */}
        <div className="mt-3">
          We know we can’t capture every detail of the process on this page, so to avoid any confusion we’ve included the{" "}
          <a
            href="https://github.com/devManghat005/eastern-dh-site.git"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            GitHub repository here
          </a>{" "}
          . You can review all of the source code directly if you’d like to see the implementation in more depth.
        </div>

      </div>
    </div>
  );
}
