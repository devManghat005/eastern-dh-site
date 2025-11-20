import React from "react";

export default function TopNav({ current, onNavigate }) {
  const makeHandler = (page) => () => {
    console.log("NAV CLICKED:", page);
    if (onNavigate) onNavigate(page);
  };

  const linkBase =
    "px-4 py-2 text-sm md:text-base rounded-full transition-colors";
  const inactive =
    linkBase + " text-gray-300 hover:text-white hover:bg-white/10";
  const active =
    linkBase + " text-black bg-white shadow-md hover:bg-white/90";

  return (
    <div className="pointer-events-auto absolute top-4 left-1/2 -translate-x-1/2 z-[9999]">
      <div className="flex items-center gap-2 md:gap-4 bg-black/60 border border-white/10 rounded-full px-4 py-2 backdrop-blur-md">
        <button
          className={current === "exterior" ? active : inactive}
          onClick={makeHandler("exterior")}
        >
          Home
        </button>
        <button
          className={current === "about" ? active : inactive}
          onClick={makeHandler("about")}
        >
          About
        </button>
        <button
          className={current === "methods" ? active : inactive}
          onClick={makeHandler("methods")}
        >
          Methods
        </button>
        <button
          className={current === "transparency" ? active : inactive}
          onClick={makeHandler("transparency")}
        >
          Data Transparency
        </button>
        <button
          className={current === "bibliography" ? active : inactive}
          onClick={makeHandler("bibliography")}
        >
          Bibliography
        </button>
      </div>
    </div>
  );
}
