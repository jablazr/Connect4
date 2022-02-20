<script context="module" lang="ts">
  export type t_hoverDetail = {
    isHovering: boolean;
    column: number;
  };

  export type t_clickDetail = {
    column: number;
  };
</script>

<script lang="ts">
  import { Color } from "../game/Connect4";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{
    hover: t_hoverDetail;
    click: t_clickDetail;
  }>();

  export let column: number;
  export let color: Color;

  const defaultBgColor = "bg-gray-800";
  const hoverBgColor = "bg-gray-300";

  let bgColor = defaultBgColor;

  $: chipColor = (() => {
    if (color === Color.Blue) {
      return "bg-blue-500";
    } else if (color === Color.Red) {
      return "bg-red-500";
    } else {
      return "";
    }
  })();

  export const doSlotHighlight = (flag: boolean) => {
    if (flag) {
      bgColor = hoverBgColor;
    } else {
      bgColor = defaultBgColor;
    }
  };

  const onHoverEnter = () => {
    dispatch("hover", { isHovering: true, column });
  };

  const onHoverLeave = () => {
    dispatch("hover", { isHovering: false, column });
  };

  const onClick = () => {
    dispatch("click", { column });
  };
</script>

<div
  class="{bgColor} w-12 h-12 flex border-2 select-none cursor-pointer"
  on:mouseenter={onHoverEnter}
  on:mouseleave={onHoverLeave}
  on:mousedown={onClick}
>
  <div class="m-auto relative w-8 h-8 {chipColor}">O</div>
</div>
