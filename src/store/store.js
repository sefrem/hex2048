import { makeAutoObservable, reaction, toJS } from "mobx";
import api from "../api/api";
import { cubeToDouble, generateGridCoordinates } from "../utils";
import React from "react";

const moveHandlers = {
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
  total = 0;
  best = +localStorage.getItem("hex2048Best") || 0;

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
    this.total = 0;
    this.fetchInitialCells();
  };

  moveGrid = (direction) => {
    let move = true;
    let i = 0;
    const movedCells = new Set();

    while (move) {
      move = false;

      for (let [key, value] of this.grid) {
        if (value.value) {
          const newCoords = key
            .split(",")
            .map(moveHandlers[direction])
            .join(",");
          const newHex = this.grid.get(newCoords);

          if (!newHex) continue;
          if (newHex.value > 0 && newHex.value !== value.value) continue;

          if (movedCells.has(key)) {
            if (!newHex.value) {
              movedCells.delete(key);

              this.setCell(newCoords, {
                ...newHex,
                value: value.value,
              });
              this.setCell(key, { ...value, value: 0 });
              movedCells.add(newCoords);
              move = true;
            }
          } else {
            const newValue = newHex.value + value.value;
            this.setCell(newCoords, {
              ...newHex,
              value: newValue,
            });
            this.setCell(key, { ...value, value: 0 });

            if (newHex.value && value.value) {
              movedCells.add(key);
              movedCells.add(newCoords);
            }

            if (newValue > 2 && newHex.value && value.value) {
              this.setTotal(newValue);
            }

            move = true;
            i++;
          }
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

  setTotal = (value) => {
    this.total += value;
    if (this.total > this.best) {
      this.best = this.total;
      localStorage.setItem("hex2048Best", this.total.toString());
    }
  };

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
