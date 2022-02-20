<script lang="ts">
  import { Connect4Store } from "../stores";
  import { Color } from "../game/Connect4";

  $: turnInfo = (() => {
    if ($Connect4Store.winner === Color.Red) {
      return "🔴 Red won! 🎉";
    }

    if ($Connect4Store.winner === Color.Blue) {
      return "🔵 Blue won! 🎉";
    }

    if ($Connect4Store.turnColor === Color.Red) {
      return "Red is placing a chip...";
    }

    if ($Connect4Store.turnColor === Color.Blue) {
      return "Blue is placing a chip...";
    }

    return "";
  })();
</script>

<p>{turnInfo}</p>
