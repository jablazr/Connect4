import { Connection } from "./Connection";

export class ConnectionList {
  private connections: {
    [id: string]: Connection;
  };

  constructor() {
    this.connections = {};
  }

  public add(connection: Connection) {
    this.connections[connection.id] = connection;
  }

  public remove(connection: Connection) {
    delete this.connections[connection.id];
  }

  public get(id: string): Connection {
    return this.connections[id];
  }

  public getAll(): Connection[] {
    return Object.values(this.connections);
  }

  public removeAll() {
    this.connections = {};
  }

  public count(): number {
    return Object.values(this.connections).length;
  }
}
