import Peer, { PeerJSOption } from "peerjs";
import { Connection } from "./Connection";
import { ConnectionClient } from "./ConnectionClient";

type t_openTrigger = (peerId: string) => void;
type t_connectionTrigger = (connection: Connection) => void;

export class PeerClient {
  private me: Peer;

  public options: PeerJSOption;

  public connectionClient!: ConnectionClient;
  public id: string | undefined;

  private openTriggers: t_openTrigger[];
  private connectionTriggers: t_connectionTrigger[];

  constructor(options?: PeerJSOption) {
    this.options = options;

    this.openTriggers = [];
    this.connectionTriggers = [];
  }

  /**
   * Opens the peer and creates a connection client
   * @returns the id of the peer
   */
  public async open(): Promise<string> {
    this.me = new Peer(undefined, this.options);
    this.connectionClient = new ConnectionClient(this.me);

    // Emitted when the peer is destroyed
    this.me.on("close", () => {
      this.connectionClient.disconnectAll();
    });

    // Emitted when the peer is disconnected from the signalling server
    this.me.on("disconnected", () => {
      this.id = undefined;
    });

    // Errors on the peer are almost always fatal and will destroy the peer
    this.me.on("error", (_error) => {
      this.id = undefined;
      this.connectionClient.disconnectAll();
    });

    // Emitted when a new data connection is established from a remote peer
    this.me.on("connection", async (dataConnection) => {
      const connection = await this.connectionClient.addConnection(
        dataConnection
      );

      for (const trigger of this.connectionTriggers) {
        trigger(connection);
      }
    });

    return await new Promise<string>((resolve, reject) => {
      this.me.on("open", (id) => {
        this.id = id;

        for (const trigger of this.openTriggers) {
          trigger(id);
        }

        resolve(id);
      });
    });
  }

  /**
   * Should be used for debugging only
   * @returns the underlying Peer object
   */
  public getPeer(): Peer {
    return this.me;
  }

  /**
   * Close the connection to the signalling server
   */
  public disconnect() {
    this.me.disconnect();
  }

  /**
   * Close the connection to the signalling server
   * and terminate all existing connections
   */
  public destroy() {
    this.me.destroy();
  }

  public isDisconnected(): boolean {
    return this.me.disconnected;
  }

  public isDestroyed(): boolean {
    return this.me.destroyed;
  }

  /**
   * Add triggers that get fired when the peer opens
   * @param fn
   */
  public addOpenTrigger(fn: t_openTrigger) {
    this.openTriggers.push(fn);
  }

  /**
   * Add triggers that get fired when a connection is established
   * @param fn
   */
  public addConnectionTrigger(fn: t_connectionTrigger) {
    this.connectionTriggers.push(fn);
  }
}
