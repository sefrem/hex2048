import React from "react";
import { observer } from "mobx-react-lite";

import Cell from "../Cell/Cell";
import { useStore } from "../../hooks/useStore";
import useEventListener from "../../hooks/useEventListener";
import "./style.css";

function Grid() {
  const store = useStore();

  useEventListener("keydown", store.moveListener);

  React.useEffect(() => {
    window.location.hash && store.fetchInitialCells();
  }, [store]);

  return (
    <div className="grid">
      <div className="cells">
        {[...store.grid.entries()].map((cell) => (
          <Cell key={cell[0]} cell={cell} />
        ))}
      </div>
    </div>
  );
}

export default observer(Grid);
