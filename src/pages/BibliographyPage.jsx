import React from "react";
import BackButton from "../components/BackButton";

export default function BibliographyPage({ onBack }) {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-10 pb-32 relative overflow-hidden">

      <BackButton onBack={onBack} />

      <h1 className="text-6xl font-bold mb-8 tracking-wide">
        Bibliography
      </h1>

      <p className="text-gray-300 max-w-4xl text-xl leading-relaxed mb-10">
        Below is a curated list of the archival sources, research material, and
        digital humanities scholarship referenced in the development of this
        project.
      </p>

      <ul className="list-disc pl-10 text-xl text-gray-300 space-y-8 max-w-4xl">

        <li>
          <span className="italic">
            Thibaut, Jacqueline. “To Pave the Way to Penitence: Prisoners and Discipline at the Eastern State Penitentiary, 1829–1835.”
            The Pennsylvania Magazine of History and Biography, vol. 106, no. 2, 1982.
          </span>
          <p className="mt-2 text-gray-400 leading-relaxed">
            This article provides a detailed historical account of the early years of Eastern State
            Penitentiary and the ideological foundations of the Pennsylvania System of solitary confinement.
            Thibaut examines how reformers believed isolation, labor, and religious instruction would
            foster moral transformation, while also documenting the widening gap between theory and lived
            reality. This source directly informs the project’s discussion of how hope-driven reform ideals
            produced unintended psychological and institutional consequences.
          </p>
        </li>

        <li>
          <span className="italic">
            Smith, Peter Scharff. “The History of Solitary Confinement.” Prison Service Journal, Issue 181, 2009.
          </span>
          <p className="mt-2 text-gray-400 leading-relaxed">
            Smith traces the historical development of solitary confinement from its origins in Enlightenment
            prison reform through its international expansion and eventual criticism. The article explains
            how isolation shifted from a moral rehabilitation strategy into a tool of control and punishment.
            This historical framework supports the project’s exploration of the contradiction between the
            intended humanitarian goals of the penitentiary and the psychological harm it ultimately produced.
          </p>
        </li>

        <li>
          <span className="italic">
            Haney, Craig. “Restricting the Use of Solitary Confinement.” Annual Review of Criminology, vol. 1, 2018, pp. 285–310.
          </span>
          <p className="mt-2 text-gray-400 leading-relaxed">
            Haney synthesizes decades of psychological research on the effects of solitary confinement,
            demonstrating consistent links between isolation and anxiety, hallucinations, emotional
            breakdown, identity erosion, and increased suicide risk. This study provides the modern scientific
            foundation for the project’s claims about the long-term mental health consequences of isolation.
            It helps connect the historical experiment at Eastern State to contemporary debates on prison reform
            and human rights.
          </p>
        </li>

        <li>
          <span className="italic">
            Shalev, Sharon. <span className="italic">Supermax: Controlling Risk through Solitary Confinement.</span>
            Willan Publishing, 2009.
          </span>
          <p className="mt-2 text-gray-400 leading-relaxed">
            Shalev provides a detailed ethnographic and policy analysis of modern supermax prisons and the
            psychological effects of long-term isolation. Through descriptions of daily routines, sensory
            deprivation, and extended confinement, the book documents how solitary confinement reshapes mental
            health, identity, and perception of time. This source supports the project’s emphasis on the depth
            and lasting nature of psychological harm caused by isolation beyond the early historical period of
            Eastern State.
          </p>
        </li>

        <li>
          <span className="italic">
            Rubin, Ashley T. “Continuity in the Face of Penal Innovation: Revisiting the History of American Solitary Confinement.”
            Law & Social Inquiry, vol. 43, no. 4, 2018.
          </span>
          <p className="mt-2 text-gray-400 leading-relaxed">
            Rubin examines why solitary confinement persisted as a central feature of American punishment even
            after its failures became widely known. The article argues that institutional momentum, administrative
            convenience, and faith in discipline sustained isolation as a control strategy rather than a genuine
            rehabilitative practice. This work directly informs the project’s discussion of how belief in strict
            order allowed systems like Eastern State to endure despite their damaging consequences.
          </p>
        </li>

      </ul>

    </div>
  );
}
