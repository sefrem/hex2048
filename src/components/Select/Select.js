import React from "react";
import { observer } from "mobx-react-lite";

import { useStore } from "../../hooks/useStore";
import "./style.css";

function Select() {
  const store = useStore();

  return (
    <div className="select">
      <div>RNG-server</div>
      <select id="url-server" onChange={store.setServer}>
        <option id="remote" value="remote">
          Remote server
        </option>
        <option id="localhost" value="local">
          Local server
        </option>
      </select>

      <div className="button-group">
        <span>Select radius</span>
        <button
          className="radius-button"
          onClick={() => store.initializeNewGrid(2)}
        >
          2
        </button>
        <button
          className="radius-button"
          onClick={() => store.initializeNewGrid(3)}
        >
          3
        </button>
        <button
          className="radius-button"
          onClick={() => store.initializeNewGrid(4)}
        >
          4
        </button>
      </div>
    </div>
  );
}

export default observer(Select);
