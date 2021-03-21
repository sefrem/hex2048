export const doubleToPixel = (col, row, gridRadius) => {
  const x = ((getGridSize(gridRadius) * 3) / 2) * col;
  const y = ((getGridSize(gridRadius) * Math.sqrt(3)) / 2) * row;
  return [x, y];
};

const getGridSize = (gridRadius) => {
  switch (gridRadius) {
    case 2:
      return 95;
    case 4:
      return 43;
    case 3:
      return 60;
    default:
      return null;
  }
};
