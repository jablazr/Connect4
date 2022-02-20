import { make2dArray } from "../utils/Array2d";

export class Grid<T> {
  public data: T[][];

  constructor(
    public rows: number,
    public columns: number,
    private initialValues?: T
  ) {
    this.data = make2dArray<T>(rows, columns, initialValues);
  }

  public clear() {
    this.data = make2dArray<T>(this.rows, this.columns, this.initialValues);
  }
}
