import React from "react";
import { observer } from "mobx-react-lite";

import { useStore } from "../../hooks/useStore";
import "./style.css";

function Status() {
  const store = useStore();

  const setGameStatus = () => {
    switch (store.status) {
      case true:
        return "playing";
      case false:
        return "game-over";
      default:
        return "round-select";
    }
  };

  return (
    <div className="status">
      <span>Game Status: </span>
      <span data-status={setGameStatus()}>{setGameStatus()}</span>
    </div>
  );
}

export default observer(Status);
