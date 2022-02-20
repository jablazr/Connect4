export function make2dArray<T>(
  rows: number,
  columns: number,
  initialValue?: T
) {
  const array = new Array<T[]>(rows);

  for (let row = 0; row < rows; row++) {
    array[row] = new Array<T>(columns);

    for (let column = 0; column < columns; column++) {
      array[row][column] = initialValue;
    }
  }

  return array;
}

export function forEach2d<T>(
  array2d: T[][],
  fn: (element: T, row: number, column: number) => void
) {
  for (let row = 0; row < array2d.length; row++) {
    for (let column = 0; column < array2d[row].length; column++) {
      fn(array2d[row][column], row, column);
    }
  }
}
