<script lang="ts">
  import GridSlot, { t_clickDetail, t_hoverDetail } from "./GridSlot.svelte";
  import { make2dArray } from "../utils/Array2d";
  import { Grid } from "../game/Grid";
  import { Color } from "../game/Connect4";

  export let grid: Grid<Color>;
  export let borderColor: Color = Color.Unset;

  $: borderColorClass = (() => {
    if (borderColor === Color.Red) {
      return "border-red-400";
    } else if (borderColor === Color.Blue) {
      return "border-blue-400";
    } else {
      return "";
    }
  })();

  let gridColumns: GridSlot[][] = make2dArray(grid.columns, grid.rows);

  const hoverHandler = (detail: t_hoverDetail) => {
    for (const gridSlot of gridColumns[detail.column]) {
      gridSlot.doSlotHighlight(detail.isHovering);
    }
  };
</script>

<div class="w-fit h-fit border-2 {borderColorClass}">
  {#each new Array(grid.rows) as _, row}
    <div class="flex">
      {#each new Array(grid.columns) as _, column}
        <GridSlot
          bind:this={gridColumns[column][row]}
          {column}
          color={grid.data[row][column]}
          on:hover={(event) => {
            hoverHandler(event.detail);
          }}
          on:click
        />
      {/each}
    </div>
  {/each}
</div>
