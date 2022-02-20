import { DataConnection } from "peerjs";

export class Connection {
  private dataConnection: DataConnection;

  public id: string;
  public metadata: string;
  public label: string;
  public reliable: boolean;

  constructor(dataConnection: DataConnection) {
    this.dataConnection = dataConnection;

    this.id = this.dataConnection.peer;
    this.metadata = this.dataConnection.metadata;
    this.label = this.dataConnection.label;
    this.reliable = this.dataConnection.reliable;
  }

  /**
   * Wait for the connection to open
   */
  public async open(): Promise<void> {
    return await new Promise<void>((resolve, reject) => {
      this.dataConnection.on("open", () => {
        resolve();
      });

      this.dataConnection.on("error", (error) => {
        reject(error);
      });
    });
  }

  /**
   * @returns the underlying DataConnection object
   */
  public getDataConnection(): DataConnection {
    return this.dataConnection;
  }

  /**
   * This is true if the connection is open and ready for read/write.
   */
  public isOpen(): boolean {
    return this.dataConnection.open;
  }

  /**
   * Closes the data connection gracefully,
   * cleaning up underlying DataChannels and PeerConnections.
   */
  public close() {
    this.dataConnection.close();
  }

  public send(data: any) {
    this.dataConnection.send(data);
  }
}
