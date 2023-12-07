import React from "react";
import { Routes, Route } from "react-router-dom";

import Room2 from "./pages/Room2";
const App = () => {
  return (
    <div>
      <Routes>
        {/* <Route path="/" element={<Lobby />} />
        <Route path="/room/:roomId" element={<Room />} /> */}
        <Route path="/" element={<Room2 />} />
      </Routes>
    </div>
  );
};

export default App;
