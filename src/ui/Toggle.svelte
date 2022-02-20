<script lang="ts">
  /**
   * How to use:
   * bind:isOn
   * or
   * on:toggle
   */

  import { createEventDispatcher } from "svelte";

  export let text: [string, string] = ["off", "on"];
  export let isOn = false;

  const dispatch = createEventDispatcher<{ toggle: boolean }>();

  const handleToggle = () => {
    isOn = !isOn;

    dispatch("toggle", isOn);
  };

  $: buttonText = isOn ? text[1] : text[0];
</script>

<button type="button" on:click={handleToggle} class="inline-block">
  {buttonText}
</button>
