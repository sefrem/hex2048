import { cubeToDouble } from "./cubeToDouble";

export const generateGridCoordinates = (gridRadius) => {
  const grid = new Map();

  for (let i = 0; i < gridRadius; i++) {
    for (let x = -i; x <= i; x++) {
      for (let y = -i; y <= i; y++) {
        for (let z = -i; z <= i; z++) {
          if (
            Math.abs(x) + Math.abs(y) + Math.abs(z) === i * 2 &&
            x + y + z === 0
          ) {
            const cell = { x, y, z, value: 0 };
            const coords = cubeToDouble(cell);
            grid.set(`${coords[0]},${coords[1]}`, cell);
          }
        }
      }
    }
  }

  return grid;
};
