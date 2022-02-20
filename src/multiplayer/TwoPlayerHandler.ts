import { Scoreboard } from "./Scoreboard";

export enum Who {
  Me,
  Them,
}

export class TwoPlayerHandler {
  public myId: string;
  public theirId: string;

  public connected: boolean;

  public playerOne: Who;

  public scoreboard: Scoreboard;
  public newGameRequester: Who;

  constructor() {
    this.myId = undefined;
    this.theirId = undefined;

    this.connected = false;

    this.playerOne = undefined;
    this.newGameRequester = undefined;

    this.scoreboard = new Scoreboard(2);
  }

  public setupConnection(myId: string, theirId: string, playerOne: Who) {
    this.myId = myId;
    this.theirId = theirId;
    this.playerOne = playerOne;

    this.connected = true;

    this.newGameRequester = undefined;

    this.scoreboard.clear();
  }

  public closeConnection() {
    this.myId = undefined;
    this.theirId = undefined;

    this.connected = false;

    this.playerOne = undefined;
    this.newGameRequester = undefined;

    this.scoreboard.clear();
  }

  public requestNewGame(who: Who): boolean {
    if (this.newGameRequester === undefined) {
      this.newGameRequester = who;
      return false;
    }

    // previous requester is not equal to current requester
    if (who !== this.newGameRequester) {
      // do new game
      this.newGameRequester = undefined;
      return true;
    }

    return false;
  }

  public setWinner(who: Who) {
    if (who === Who.Me) {
      this.scoreboard.addScore(0, 1);
    } else {
      this.scoreboard.addScore(1, 1);
    }
  }

  public swapSides() {
    if (this.playerOne === Who.Me) {
      this.playerOne = Who.Them;
    } else {
      this.playerOne = Who.Me;
    }
  }
}
