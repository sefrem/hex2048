import React from "react";
import { observer } from "mobx-react-lite";

import { useStore } from "../../hooks/useStore";
import "./style.css";

function Score() {
  const store = useStore();

  return (
    <div className="score">
      <div className="score-container current-score">
        <div className="score-title">Score</div>
        <div className="score-value">{store.total}</div>
        {store.lastScore > 0 && (
          <div className="last-score" key={Math.random()}>
            +{store.lastScore}
          </div>
        )}
      </div>
      <div className="score-container high-score">
        <div className="score-title">Best</div>
        <div className="score-value">{store.best}</div>
      </div>
    </div>
  );
}

export default observer(Score);
