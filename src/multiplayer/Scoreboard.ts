export class Scoreboard {
  private scores: number[];

  constructor(private numberOfPlayers: number) {
    this.scores = new Array(numberOfPlayers).fill(0);
  }

  public clear() {
    this.scores = new Array(this.numberOfPlayers).fill(0);
  }

  public setScore(player: number, score: number) {
    this.scores[player] = score;
  }

  public addScore(player: number, score: number) {
    this.scores[player] += score;
  }
}
