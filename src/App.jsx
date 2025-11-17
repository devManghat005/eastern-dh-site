import React, { useState } from "react";
import ExteriorPage from "./pages/ExteriorPage";
import HomeWorld from "./pages/HomeWorld";   // your interior file

export default function App() {
  const [inside, setInside] = useState(false);

  return (
    <>
      {!inside && <ExteriorPage enterInterior={() => setInside(true)} />}
      {inside && <HomeWorld />}
    </>
  );
}
