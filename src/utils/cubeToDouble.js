export const cubeToDouble = (cube) => {
  const col = cube.x;
  const row = 2 * cube.z + cube.x;
  return [col, row];
};
