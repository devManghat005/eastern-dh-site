import React from "react";
import BackButton from "../components/BackButton";

export default function TransparencyPage({ onBack }) {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-10 relative overflow-hidden">

      {/* BACK BUTTON */}
      <BackButton onBack={onBack} />

      {/* PAGE TITLE */}
      <h1 className="text-6xl font-bold mb-12 tracking-wide">Data Transparency</h1>

      {/* TWO-COLUMN LAYOUT (FULL WIDTH, IMAGES RIGHT-JUSTIFIED) */}
      <div className="w-full flex justify-between items-start gap-14 pr-10">

        {/* LEFT TEXT COLUMN */}
        <div className="flex-1 max-w-3xl pr-6 space-y-10 text-xl text-gray-300 leading-relaxed text-justify">
          {/* SECTION 1: INTRO LINE */}
          <p className="text-xl text-gray-300 leading-relaxed mb-10">
          In doing our part to minimise bias and allow for an open discussion of the topic at hand we lay all our card on the table about how we reach our conclusions. 
          </p>

          {/* SECTION 1: SOURCE */}
          <div>
            <h2 className="text-3xl font-semibold mb-4 text-white">Where the Data Comes From</h2>
            <p>
              The dataset used in this project comes from the
              <span className="font-semibold"> Eastern State Penitentiary Admission Book A</span>,
              published by the University of Pennsylvania as part of the Magazine of Early American
              Datasets (MEAD). It documents people admitted to the prison between 1830 and 1868,
              including their names, offenses, sentencing terms, birthplace, literacy notes, discharge
              details, and narrative comments recorded by prison officials.
            </p>

            <p className="mt-3">
              The dataset was transcribed by Library Science students at Drexel University and is
              provided “as is,” meaning transcription errors, spelling inconsistencies, and ambiguous
              entries are expected. Because the data originates from nineteenth-century prison records,
              it reflects institutional priorities and the recorder’s perspective rather than the full
              lives of the individuals represented.
            </p>
          </div>

          {/* SECTION 2: WHAT THE DATA INCLUDES */}
          <div>
            <h2 className="text-3xl font-semibold mb-4 text-white">What the Dataset Includes</h2>
            <p>
              Each row represents an incarcerated person admitted to Eastern State Penitentiary. The
              dataset contains 14 columns, including FirstName, LastName, Age, Birthplace, Offense,
              Sentencing, NumberConvictions, EthnicityReligionOccupation, ColumnNote, and Description.
            </p>

            <p className="mt-3">
              Some fields contain basic information. Others include long narrative descriptions that
              reflect nineteenth-century judgments about behavior, literacy, moral character, or
              “habits,” often written in language shaped by the recorder’s biases.
            </p>
          </div>

          {/* SECTION 3: HOW WE CLEANED THE DATA */}
          <div>
            <h2 className="text-3xl font-semibold mb-4 text-white">How We Cleaned the Data</h2>

            <p>
              To make the dataset usable inside a real-time 3D environment, we performed minimal but
              necessary cleaning steps:
            </p>

            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>Trimmed extra spaces from first and last names.</li>
              <li>Removed rows missing both FirstName and LastName.</li>
              <li>Standardized a few obvious spelling inconsistencies.</li>
              <li>Preserved all historical terminology in narrative fields.</li>
            </ul>

            <p className="mt-4">
              We also created a new{" "}
              <span className="font-semibold text-white">literacy</span> column derived from the
              ColumnNote field. This was done manually by reading each entry and identifying whether
              it described reading or writing ability.
            </p>

            <p className="mt-3">
              Literacy values were recoded into simple numeric indicators:
            </p>

            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li><span className="font-semibold text-white">0</span> — cannot read or write</li>
              <li><span className="font-semibold text-white">1</span> — can read</li>
              <li><span className="font-semibold text-white">3</span> — can read and write</li>
            </ul>

            <p className="mt-3">
              We made this change because the ColumnNote field was inconsistent but primarily
              described literacy. Encoding it numerically made analysis clearer while still preserving
              the original descriptive text elsewhere in the dataset.
            </p>
          </div>

          {/* SECTION 4: LIMITATIONS */}
          <div>
            <h2 className="text-3xl font-semibold mb-4 text-white">Known Limitations</h2>
            <p>
              Many fields are incomplete, inconsistent, or shaped by institutional goals rather than
              personal histories. Race, religion, and occupation appear together in a single mixed
              field. Offense categories are simplified. Descriptions contain moral judgments instead
              of neutral observations. Spelling variations create accidental category splits. Date and
              location fields are not standardized.
            </p>

            <p className="mt-3">
              These issues do not diminish the value of the dataset, but they remind us that all
              historical data is mediated through the perspectives, biases, and limitations of the
              people and institutions who recorded and digitized it.
            </p>
          </div>

          {/* SECTION 5: DOWNLOADS */}
          <div className="mb-20">
            <h2 className="text-3xl font-semibold mb-4 text-white">Download the Data</h2>
            <p>
              To support transparency and independent exploration, both the original dataset and the
              cleaned version used in this project are available below.
            </p>

            <div className="mt-6 space-y-4">
              <a
                href="/Eastern_State_Admission_Book_A.csv"
                download
                className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
              >
                Download Original Dataset
              </a>
              <br />
              <a
                href="/cleaned_data.csv"
                download
                className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
              >
                Download Cleaned Dataset
              </a>
            </div>
          </div>

        </div>

        {/* RIGHT IMAGES — THREE STACKED AND RIGHT-JUSTIFIED */}
        <div className="flex-shrink-0 w-[650px] mt-2 flex flex-col gap-6">

          <img
            src="/images/prison.webp"
            alt="Eastern State Penitentiary Aerial View"
            className="w-full h-auto rounded-xl shadow-xl object-cover border border-white/10"
          />

          <img
            src="/images/sky2.jpg"
            alt="Eastern State Penitentiary Alternate View"
            className="w-full h-auto rounded-xl shadow-xl object-cover border border-white/10"
          />

          {/* NEW THIRD IMAGE */}
          <img
            src="/images/sky3.jpeg"
            alt="Eastern State Penitentiary View 3"
            className="w-full h-auto rounded-xl shadow-xl object-cover border border-white/10"
          />

        </div>

      </div>
    </div>
  );
}
