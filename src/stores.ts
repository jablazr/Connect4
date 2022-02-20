import { writable } from "svelte/store";
import { Connect4 } from "./game/Connect4";
import { TwoPlayerHandler } from "./multiplayer/TwoPlayerHandler";

export const Connect4Store = writable(new Connect4(6, 7));

export const Multiplayer = writable(new TwoPlayerHandler());
