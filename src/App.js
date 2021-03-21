import React from "react";

import Grid from "./components/Grid/Grid";
import Status from "./components/Status/Status";
import Select from "./components/Select/Select";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Select />

      <Grid />

      <Status />
    </div>
  );
}

export default App;
