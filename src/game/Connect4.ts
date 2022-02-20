import { Grid } from "./Grid";
import { checkWin } from "./Connect4CheckWin";

export enum Color {
  Red,
  Blue,
  Unset,
}

export interface iGameDataPayload {
  turnColor: Color;
  gridData: Color[][];
}

export class Connect4 {
  public turnColor: Color;
  public grid: Grid<Color>;

  public winner: Color;

  constructor(rows: number, columns: number) {
    this.grid = new Grid<Color>(rows, columns, Color.Unset);
  }

  public startGame() {
    this.grid.clear();
    this.turnColor = Color.Red;

    this.winner = Color.Unset;
  }

  public nextTurn(grid?: Grid<Color>) {
    if (this.turnColor === Color.Red) {
      this.turnColor = Color.Blue;
    } else {
      this.turnColor = Color.Red;
    }

    if (grid !== undefined) {
      this.grid = grid;
    }

    this.winner = this.checkWin();
  }

  public dropChip(column: number) {
    if (this.setLastEmptyRow(column, this.turnColor)) {
      this.nextTurn();
    }
  }

  public setLastEmptyRow(column: number, color: Color): boolean {
    if (column > this.grid.columns - 1 || column < 0) {
      throw "Column is out of bounds!";
    }

    for (let row = 0; row < this.grid.rows; row++) {
      if (this.grid.data[row][column] !== Color.Unset) {
        if (row === 0) return false;

        this.grid.data[row - 1][column] = color;
        return true;
      }
    }

    this.grid.data[this.grid.rows - 1][column] = color;
    return true;
  }

  public checkWin(): Color {
    return checkWin(this.grid);
  }

  public get(): iGameDataPayload {
    return {
      turnColor: this.turnColor,
      gridData: this.grid.data,
    };
  }

  public set(gameDataPayload: iGameDataPayload) {
    this.turnColor = gameDataPayload.turnColor;
    this.grid.data = gameDataPayload.gridData;

    this.winner = this.checkWin();
  }
}
