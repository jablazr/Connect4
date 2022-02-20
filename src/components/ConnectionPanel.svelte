<script lang="ts">
  import { Who } from "../multiplayer/TwoPlayerHandler";
  import { peerClient } from "../App.svelte";
  import { Connect4Store, Multiplayer } from "../stores";
  import ConnectionDetails from "./ConnectionDetails.svelte";
  import Toggle from "../ui/Toggle.svelte";

  let isPeerOpen = false;

  // binds
  let connectionId = "";
  let isBlue = false;

  peerClient.addOpenTrigger(() => {
    isPeerOpen = true;

    peerClient.connectionClient.addDataTrigger((playload, connectionId) => {
      if ($Multiplayer.connected && $Multiplayer.theirId !== connectionId) {
        peerClient.connectionClient.send(
          {
            type: "textInfo",
            data: "This peer is already connected to somebody else!",
          },
          connectionId
        );

        peerClient.connectionClient.disconnect(connectionId);
        return;
      }

      if (playload?.type === "setup") {
        let playerOne: Who;
        if (playload.data.playerOne === Who.Me) {
          playerOne = Who.Them;
        } else {
          playerOne = Who.Me;
        }

        Multiplayer.update((multiplayer) => {
          multiplayer.setupConnection(peerClient.id, connectionId, playerOne);

          return multiplayer;
        });

        Connect4Store.update((connect4) => {
          connect4.set(playload.data.gameData);

          return connect4;
        });
      }
    });

    peerClient.connectionClient.addCloseTrigger((connectionId) => {
      if (connectionId === $Multiplayer.theirId) {
        Multiplayer.update((currentMultiplayer) => {
          currentMultiplayer.closeConnection();

          return currentMultiplayer;
        });
      }
    });
  });

  const handleConnect = async () => {
    try {
      await peerClient.connectionClient.connect(connectionId, {
        reliable: true,
      });
    } catch {
      console.log("Failed to connect!");
      return;
    }

    const playerOne = isBlue ? Who.Them : Who.Me;

    Multiplayer.update((multiplayer) => {
      multiplayer.setupConnection(peerClient.id, connectionId, playerOne);

      return multiplayer;
    });

    Connect4Store.update((connect4) => {
      connect4.startGame();

      return connect4;
    });

    peerClient.connectionClient.send(
      {
        type: "setup",
        data: { gameData: $Connect4Store.get(), playerOne },
      },
      connectionId
    );
  };

  const handleDisconnect = () => {
    peerClient.connectionClient.disconnect($Multiplayer.theirId);

    Multiplayer.update((multiplayer) => {
      multiplayer.closeConnection();

      return multiplayer;
    });
  };
</script>

{#if isPeerOpen}
  <p>My id:</p>
  <pre>{peerClient.id}</pre>

  {#if $Multiplayer.connected}
    <p>You are connected with:</p>
    <pre>{$Multiplayer.theirId}</pre>

    <button
      type="button"
      on:click={handleDisconnect}
      class="border-2 border-green-600"
    >
      Disconnect
    </button>

    <ConnectionDetails />
  {:else}
    <label for="connectionId">Connection ID</label>
    <input
      type="text"
      id="connectionId"
      bind:value={connectionId}
      class="border-2 border-green-600"
    />

    <p>
      Choose your color: <Toggle text={["Red", "Blue"]} bind:isOn={isBlue} />
    </p>

    <button
      type="button"
      on:click={handleConnect}
      class="border-2 border-green-600"
    >
      Connect
    </button>
  {/if}
{:else}
  Creating a peer...
{/if}
