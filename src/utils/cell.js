import { cellColors } from "../theme/cellColors";

export const setCellHeight = (gridRadius) => {
  switch (gridRadius) {
    case 2:
      return 175;
    case 3:
      return 108;
    case 4:
      return 78;
    default:
      return null;
  }
};

export const setCellWidth = (gridRadius) => {
  switch (gridRadius) {
    case 2:
      return 200;
    case 4:
      return 90;
    case 3:
      return 125;
    default:
      return null;
  }
};

export const setCellOffset = (gridRadius) => {
  switch (gridRadius) {
    case 2:
      return 100;
    case 3:
      return 60;
    case 4:
      return 50;
    default:
      return null;
  }
};

export const setCellColor = (value) => cellColors[value];

export const setCellTextColor = (value) =>
  value > 4 ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.6)";
