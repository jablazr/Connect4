import { Color } from "./Connect4";
import { Grid } from "./Grid";

export const checkWin = (grid: Grid<Color>): Color => {
  let consecutives = 0;
  let currentColor = Color.Unset;

  // check verticals
  for (let column = 0; column < grid.columns; column++) {
    consecutives = 0;
    currentColor = Color.Unset;

    for (let row = 0; row < grid.rows; row++) {
      switch (grid.data[row][column]) {
        case Color.Unset:
          consecutives = 0;
          currentColor = Color.Unset;
          break;

        case currentColor:
          consecutives++;
          if (consecutives === 4) {
            return currentColor;
          }
          break;

        default:
          consecutives = 1;
          currentColor = grid.data[row][column];
      }
    }
  }

  // check horizontals
  for (let row = 0; row < grid.rows; row++) {
    consecutives = 0;
    currentColor = Color.Unset;

    for (let column = 0; column < grid.columns; column++) {
      switch (grid.data[row][column]) {
        case Color.Unset:
          consecutives = 0;
          currentColor = Color.Unset;
          break;

        case currentColor:
          consecutives++;
          if (consecutives === 4) {
            return currentColor;
          }
          break;

        default:
          consecutives = 1;
          currentColor = grid.data[row][column];
      }
    }
  }

  // check top left diagonals
  for (
    let diagonalColumn = 0;
    diagonalColumn < grid.columns;
    diagonalColumn++
  ) {
    consecutives = 0;
    currentColor = Color.Unset;

    for (
      let row = 0, column = diagonalColumn;
      row < grid.rows && column < grid.columns;
      row++, column++
    ) {
      switch (grid.data[row][column]) {
        case Color.Unset:
          consecutives = 0;
          currentColor = Color.Unset;
          break;

        case currentColor:
          consecutives++;
          if (consecutives === 4) {
            return currentColor;
          }
          break;

        default:
          consecutives = 1;
          currentColor = grid.data[row][column];
      }
    }
  }

  // check bottom left diagonals
  for (let diagonalRow = 1; diagonalRow < grid.rows; diagonalRow++) {
    consecutives = 0;
    currentColor = Color.Unset;

    for (
      let row = diagonalRow, column = 0;
      row < grid.rows && column < grid.columns;
      row++, column++
    ) {
      switch (grid.data[row][column]) {
        case Color.Unset:
          consecutives = 0;
          currentColor = Color.Unset;
          break;

        case currentColor:
          consecutives++;
          if (consecutives === 4) {
            return currentColor;
          }
          break;

        default:
          consecutives = 1;
          currentColor = grid.data[row][column];
      }
    }
  }

  // check top right diagonals
  for (
    let diagonalColumn = grid.columns - 1;
    diagonalColumn > -1;
    diagonalColumn--
  ) {
    consecutives = 0;
    currentColor = Color.Unset;

    for (
      let row = 0, column = diagonalColumn;
      row < grid.rows && column > -1;
      row++, column--
    ) {
      switch (grid.data[row][column]) {
        case Color.Unset:
          consecutives = 0;
          currentColor = Color.Unset;
          break;

        case currentColor:
          consecutives++;
          if (consecutives === 4) {
            return currentColor;
          }
          break;

        default:
          consecutives = 1;
          currentColor = grid.data[row][column];
      }
    }
  }

  // check bottom right diagonals
  for (let diagonalRow = 1; diagonalRow < grid.rows; diagonalRow++) {
    consecutives = 0;
    currentColor = Color.Unset;

    for (
      let row = diagonalRow, column = grid.columns - 1;
      row < grid.rows && column > -1;
      row++, column--
    ) {
      switch (grid.data[row][column]) {
        case Color.Unset:
          consecutives = 0;
          currentColor = Color.Unset;
          break;

        case currentColor:
          consecutives++;
          if (consecutives === 4) {
            return currentColor;
          }
          break;

        default:
          consecutives = 1;
          currentColor = grid.data[row][column];
      }
    }
  }

  return Color.Unset;
};
