<script lang="ts">
  import { Multiplayer } from "../stores";
  import { Who } from "../multiplayer/TwoPlayerHandler";

  $: voteExists = $Multiplayer.newGameRequester !== undefined;
  $: who = (() => {
    if ($Multiplayer.newGameRequester === Who.Me) {
      return "Requesting a new game";
    }

    if ($Multiplayer.newGameRequester === Who.Them) {
      return "Opponent is requesting a new game";
    }

    return "";
  })();

  $: myColor = (() => {
    if ($Multiplayer.playerOne === Who.Me) {
      return "red";
    } else {
      return "blue";
    }
  })();
</script>

<p>You are {myColor}!</p>

{#if voteExists}
  <p>{who} (1/2)</p>
{/if}
