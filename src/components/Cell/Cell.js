import React from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";

import { useStore } from "../../hooks/useStore";
import "./style.css";

import {
  doubleToPixel,
  setCellHeight,
  setCellWidth,
  setCellOffset,
  setCellColor,
} from "../../utils";
import { setCellTextColor } from "../../utils/cell";

function Cell({ cell }) {
  const store = useStore();
  const [key, { x, y, z, value, isNew }] = cell || {};

  const coords = key.split(",");
  const [left, top] = doubleToPixel(coords[0], coords[1], store.gridRadius);
  return (
    <div
      className="cell"
      style={{
        width: setCellWidth(store.gridRadius),
        height: setCellHeight(store.gridRadius),
        left: left - setCellOffset(store.gridRadius),
        top: top - setCellOffset(store.gridRadius),
      }}
      data-value={value}
      data-x={x}
      data-y={y}
      data-z={z}
    >
      <div
        className="cell-wrapper"
        style={{
          width: setCellWidth(store.gridRadius) * 0.86,
          height: setCellHeight(store.gridRadius) * 0.8571,
        }}
      >
        <div
          className={clsx("cell-value", { "cell-new": isNew })}
          style={{
            fontSize: 30,
            color: setCellTextColor(value),
            background: setCellColor(value),
          }}
        >
          {value > 0 && value}
        </div>
      </div>
    </div>
  );
}

export default observer(Cell);
