import React from "react";
import BackButton from "../components/BackButton";

export default function BibliographyPage({ onBack }) {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-10 pb-32 relative overflow-hidden">

      <BackButton onBack={onBack} />

      <h1 className="text-6xl font-bold mb-8 tracking-wide">
        Bibliography
      </h1>

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
            reality.
          </p>
        </li>

        <li>
          <span className="italic">
            Smith, Peter Scharff. “The History of Solitary Confinement.” Prison Service Journal, Issue 181, 2009.
          </span>
          <p className="mt-2 text-gray-400 leading-relaxed">
            Smith traces the historical development of solitary confinement from its origins in Enlightenment
            prison reform through its international expansion and eventual criticism.
          </p>
        </li>

        <li>
          <span className="italic">
            Haney, Craig. “Restricting the Use of Solitary Confinement.” Annual Review of Criminology, vol. 1, 2018, pp. 285–310.
          </span>
          <p className="mt-2 text-gray-400 leading-relaxed">
            Haney synthesizes decades of psychological research showing consistent links between isolation,
            emotional breakdown, hallucinations, and suicide risk.
          </p>
        </li>

        <li>
          <span className="italic">
            Shalev, Sharon. <span className="italic">Supermax: Controlling Risk through Solitary Confinement.</span>
            Willan Publishing, 2009.
          </span>
          <p className="mt-2 text-gray-400 leading-relaxed">
            Shalev provides an ethnographic and policy-driven analysis of modern isolation prisons.
          </p>
        </li>

        <li>
          <span className="italic">
            Rubin, Ashley T. “Continuity in the Face of Penal Innovation: Revisiting the History of American Solitary Confinement.”
            Law & Social Inquiry, vol. 43, no. 4, 2018.
          </span>
          <p className="mt-2 text-gray-400 leading-relaxed">
            Rubin explains why solitary confinement persisted despite its documented failures.
          </p>
        </li>

        <li>
          <span className="italic">
            OpenAI. “ChatGPT.” OpenAI, https://openai.com/chatgpt.
          </span>
          <p className="mt-2 text-gray-400 leading-relaxed">
            ChatGPT assisted with debugging code and developing the React-based interface.
          </p>
        </li>

        <li>
          <span className="italic">
            Bache, Franklin. <span className="italic">Observations and Reflections on the Penitentiary System.</span> Philadelphia, 1829.
          </span>
          <p className="mt-2 text-gray-400 leading-relaxed">
            A primary source reflecting early professional support for solitary confinement.
          </p>
        </li>

      </ul>

      {/* IMAGE SOURCES SECTION */}
      <h2 className="text-4xl font-bold mt-20 mb-8 tracking-wide">
        Image Sources
      </h2>

      <ul className="list-disc pl-10 text-xl text-gray-300 space-y-6 max-w-4xl">

        <li className="italic">
          Encyclopedia of Greater Philadelphia. “Eastern State Penitentiary.”  
          https://philadelphiaencyclopedia.org/essays/eastern-state-penitentiary/  
        </li>

        <li className="italic">
          WHYY. “How Eastern State Penitentiary Became a Philly Attraction.”  
          https://whyy.org/articles/history-behind-the-walls-how-philadelphias-most-famous-haunted-house-began/  
        </li>

        <li className="italic">
          DiscoverNEPA. “Haunted History Awaits at Eastern State Penitentiary.”  
          https://discovernepa.com/things-to-do/haunted-history-awaits-at-eastern-state-penitentiary/  
        </li>

        <li className="italic">
          Planetizen. “Eastern State Penitentiary: A Class about the Past Speaks to the Present and the Future.”  
          https://www.planetizen.com/news/2019/06/104769-eastern-state-penitentiary-class-about-past-speaks-present-and-future  
        </li>

      </ul>

    </div>
  );
}
