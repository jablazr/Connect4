import Peer, { DataConnection, PeerConnectOption } from "peerjs";
import { Connection } from "./Connection";
import { ConnectionList } from "./ConnectionList";

type t_dataTrigger = (data: any, connectionId: string) => void;
type t_closeTrigger = (connectionId: string) => void;

export class ConnectionClient {
  private me: Peer;

  public list: ConnectionList;

  private dataTriggers: t_dataTrigger[];
  private closeTriggers: t_closeTrigger[];

  constructor(peer: Peer) {
    this.me = peer;

    this.list = new ConnectionList();

    this.dataTriggers = [];
    this.closeTriggers = [];
  }

  public setupDataConnection(connection: Connection) {
    connection.getDataConnection().on("data", (data) => {
      for (const trigger of this.dataTriggers) {
        trigger(data, connection.id);
      }
    });

    connection.getDataConnection().on("close", () => {
      this.list.remove(connection);

      for (const trigger of this.closeTriggers) {
        trigger(connection.id);
      }
    });

    connection.getDataConnection().on("error", (_error) => {
      this.list.remove(connection);

      for (const trigger of this.closeTriggers) {
        trigger(connection.id);
      }
    });
  }

  public async addConnection(
    dataConnection: DataConnection
  ): Promise<Connection> {
    const connection = new Connection(dataConnection);
    await connection.open();

    this.setupDataConnection(connection);
    this.list.add(connection);

    return connection;
  }

  /**
   * Establishes a connection with another peer
   * @param id connection id
   * @param options connection options
   * @returns a new Connection object
   */
  public async connect(
    id: string,
    options?: PeerConnectOption
  ): Promise<Connection> {
    const dataConnection = this.me.connect(id, options);

    const connection = await this.addConnection(dataConnection);

    return connection;
  }

  /**
   * Disconnect from a connection
   * @param id Connection id
   */
  public disconnect(id: string) {
    const connection = this.list.get(id);
    connection.close();

    this.list.remove(connection);
  }

  /**
   * Disconnect from all connections
   */
  public disconnectAll() {
    this.list.getAll().forEach((connection) => {
      connection.close();
    });

    this.list.removeAll();
  }

  /**
   * Send data to specific connections
   * @param data any data
   * @param ids connection ids
   */
  public send(data: any, ...ids: string[]) {
    ids.forEach((id) => {
      const connection = this.list.get(id);
      if (connection === undefined) return;

      if (connection.isOpen()) {
        connection.send(data);
      } else {
        this.list.remove(connection);
      }
    });
  }

  /**
   * Send data to all connections
   * @param data any data
   */
  public sendAll(data: any) {
    this.list.getAll().forEach((connection) => {
      if (connection.isOpen()) {
        connection.send(data);
      } else {
        this.list.remove(connection);
      }
    });
  }

  /**
   * Add triggers that get fired when the connection recieves data
   * @param fn
   */
  public addDataTrigger(fn: t_dataTrigger) {
    this.dataTriggers.push(fn);
  }

  /**
   * Add triggers that get fired when the connection closes
   * @param fn
   */
  public addCloseTrigger(fn: t_closeTrigger) {
    this.closeTriggers.push(fn);
  }
}
