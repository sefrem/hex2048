import { makeAutoObservable, reaction } from "mobx";
import api from "../api/api";
import { cubeToDouble, generateGridCoordinates } from "../utils";

const moveFunctions = {
  leftTop: (v) => +v - 1,
  rightBottom: (v) => +v + 1,
  rightTop: (v, i) => (i === 0 ? +v + 1 : +v - 1),
  leftBottom: (v, i) => (i === 0 ? +v - 1 : +v + 1),
  top: (v, i) => (i === 1 ? +v - 2 : +v),
  bottom: (v, i) => (i === 1 ? +v + 2 : +v),
};

const keyAndDirection = {
  q: "leftTop",
  w: "top",
  e: "rightTop",
  a: "leftBottom",
  s: "bottom",
  d: "rightBottom",
};

const urls = {
  remoteUrl:
    "https://68f02c80-3bed-4e10-a747-4ff774ae905a.pub.instances.scw.cloud/",
  localUrl: "http://localhost:13337/",
};

const neighbourHexes = [
  [+1, +1],
  [+1, -1],
  [0, -2],
  [-1, -1],
  [-1, +1],
  [0, +2],
];

class Store {
  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.serverUrl,
      () => {
        this.grid = generateGridCoordinates(this.gridRadius);
        this.fetchInitialCells();
      }
    );
  }

  gridRadius = +window.location.hash[window.location.hash.length - 1];
  grid = generateGridCoordinates(this.gridRadius);
  serverUrl = urls.remoteUrl;

  fetchInitialCells = async () => {
    const response = await api.fetchCells(this.serverUrl, this.gridRadius);
    this.updateGrid(response);
  };

  fetchMoreCells = async () => {
    const payload = [...this.grid.entries()]
      .flatMap(([, value]) => {
        if (value.hasOwnProperty("isNew")) {
          delete value.isNew;
        }
        return value;
      })
      .filter(({ value }) => value);

    const response = await api.fetchCells(
      this.serverUrl,
      this.gridRadius,
      payload
    );

    if (!response?.length) {
      return;
    }

    this.updateGrid(response);
  };

  updateGrid = (cells) => {
    cells?.forEach((item) => {
      const { x, y, z } = item;
      const coords = cubeToDouble({ x, y, z });
      this.setCell(`${coords[0]},${coords[1]}`, { ...item, isNew: true });
    });
  };

  initializeNewGrid = (gridRadius) => {
    this.gridRadius = gridRadius;
    this.grid = generateGridCoordinates(gridRadius);
    this.fetchInitialCells();
  };

  moveGrid = (direction) => {
    let move = true;
    let i = 0;
    const movedCells = [];

    while (move) {
      move = false;

      for (let [key, value] of this.grid) {
        if (value.value) {
          const newCoord = key
            .split(",")
            .map(moveFunctions[direction])
            .join(",");
          const newHex = this.grid.get(newCoord);

          if (!newHex) continue;
          if (newHex.value > 0 && newHex.value !== value.value) continue;
          if (movedCells.includes(key)) continue;

          this.setCell(newCoord, {
            ...newHex,
            value: newHex.value + value.value,
          });
          this.setCell(key, { ...value, value: 0 });

          if (newHex.value && value.value) {
            movedCells.push(key);
            movedCells.push(newCoord);
          }
          move = true;
          i++;
        }
      }
    }
    i && this.fetchMoreCells();
  };

  moveListener = (e) => {
    Object.entries(keyAndDirection).forEach(([key, direction]) => {
      if (e.key === key) {
        this.moveGrid(direction);
      }
    });
  };

  setCell = (coords, value) => this.grid.set(coords, value);

  setServer = (e) => {
    this.serverUrl =
      e.target.value === "remote" ? urls.remoteUrl : urls.localUrl;
  };

  get status() {
    if (!this.gridRadius) {
      return null;
    }

    for (let { value } of this.grid.values()) {
      if (value === 0) return true;
    }

    for (let [key, value] of this.grid) {
      for (let neighbour of neighbourHexes) {
        const coords = key.split(",");
        const neighbourCoords = [
          +coords[0] + neighbour[0],
          +coords[1] + neighbour[1],
        ].join(",");
        const neighbourHex = this.grid.get(neighbourCoords);
        if (neighbourHex && neighbourHex.value === value.value) {
          return true;
        }
      }
    }

    return false;
  }
}

const store = new Store();

export default store;
