<script context="module" lang="ts">
  import { PeerClient } from "./connection/PeerClient";

  export const peerClient = new PeerClient();

  peerClient.open();
</script>

<script lang="ts">
  import ConnectionPanel from "./components/ConnectionPanel.svelte";
  import GameInfo from "./components/GameInfo.svelte";
  import Grid from "./components/Grid.svelte";
  import { t_clickDetail } from "./components/GridSlot.svelte";
  import { Connect4Store, Multiplayer } from "./stores";
  import { Who } from "./multiplayer/TwoPlayerHandler";
  import { Color } from "./game/Connect4";

  Connect4Store.update((connect4) => {
    connect4.startGame();

    return connect4;
  });

  peerClient.addOpenTrigger(() => {
    peerClient.connectionClient.addDataTrigger((payload, connectionId) => {
      if (connectionId === $Multiplayer.theirId) {
        // check if it is the correct connection ^
        if (payload?.type === "game") {
          console.log("update recieved");

          Connect4Store.update((connect4) => {
            // not robust, data may not exist, will pass for now
            connect4.set(payload.data);

            return connect4;
          });
        } else if (payload?.type === "gameReset") {
          Multiplayer.update((multiplayer) => {
            if (multiplayer.requestNewGame(Who.Them)) {
              multiplayer.swapSides();
            }

            return multiplayer;
          });
        }
      }
    });
  });

  const clickHandler = (detail: t_clickDetail) => {
    if ($Connect4Store.winner !== Color.Unset) return;
    if ($Multiplayer.connected) {
      if (
        $Connect4Store.turnColor === Color.Red &&
        $Multiplayer.playerOne === Who.Them
      )
        return;
      if (
        $Connect4Store.turnColor === Color.Blue &&
        $Multiplayer.playerOne === Who.Me
      )
        return;
    }

    Connect4Store.update((connect4) => {
      connect4.dropChip(detail.column);

      return connect4;
    });

    if ($Multiplayer.connected) {
      peerClient.connectionClient.send(
        {
          type: "game",
          data: $Connect4Store.get(),
        },
        $Multiplayer.theirId
      );
    }
  };

  const handleNewGame = () => {
    if (!$Multiplayer.connected) {
      Connect4Store.update((connect4) => {
        connect4.startGame();

        return connect4;
      });

      return;
    }

    let doNewGame: boolean;

    Multiplayer.update((multiplayer) => {
      doNewGame = multiplayer.requestNewGame(Who.Me);

      return multiplayer;
    });

    peerClient.connectionClient.send(
      {
        type: "gameReset",
        data: null,
      },
      $Multiplayer.theirId
    );

    if (doNewGame) {
      Connect4Store.update((connect4) => {
        connect4.startGame();

        return connect4;
      });

      peerClient.connectionClient.send(
        {
          type: "game",
          data: $Connect4Store.get(),
        },
        $Multiplayer.theirId
      );

      Multiplayer.update((multiplayer) => {
        multiplayer.swapSides();

        return multiplayer;
      });
    }
  };

  $: borderColor = (() => {
    if ($Connect4Store.winner !== Color.Unset) {
      return $Connect4Store.winner;
    }

    return $Connect4Store.turnColor;
  })();
</script>

<h1 class="text-3xl font-bold underline">Connect 4!</h1>

<ConnectionPanel />

<br />
<br />

<GameInfo />

<Grid
  grid={$Connect4Store.grid}
  {borderColor}
  on:click={(event) => {
    clickHandler(event.detail);
  }}
/>

<button on:click={handleNewGame}>New Game</button>

<style>
</style>
