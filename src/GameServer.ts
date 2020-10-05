import express, { Application } from "express";
import cors from 'cors';
import * as http from 'http';
import SocketIO, { Server, Socket } from 'socket.io';
import * as path from "path";

interface Message {
  gameId: string;
  clientId: string;
  
}

export class GameServer {
  public static readonly PORT: number = 8080;
  private app: express.Application;
  private server: http.Server;
  private io: Server;
  private port: string | number;

  constructor() {
    this.app = express();
    this.app.use(cors());

    this.server = http.createServer(this.app);
    this.io = SocketIO.listen(this.server, { origins: '*:*'});

    this.server.listen(this.port, () => {
      console.log(`Running server on port ${this.port}`);
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`Connected client on port ${this.port}`);

      socket.on('message', (m: Message) => {
        console.log(`[server](message): ${JSON.stringify(m)}`);
        this.io.emit('message', m);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }

  public getApp(): Application {
    return this.app;
  }

}
