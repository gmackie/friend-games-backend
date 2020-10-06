import express, { Application } from "express";
import cors from 'cors';
import * as http from 'http';
import SocketIO, { Server, Socket } from 'socket.io';
import * as path from "path";

interface Message {
  gameId: string;
  clientId: string;
  content: object;
}

export class GameServer {
  private app: Application;
  private server: http.Server;
  private io: Server;
  private port: number;

  constructor(appInit: { port: number; }) {
    const { port } = appInit;
    this.port = port;
    this.server = http.createServer(this.app);
    this.io = SocketIO(this.server, { origins: '*:*'});
    
    this.io.on('connection', (socket: Socket) => {
      console.log(`Connected client ${socket.id} on port ${this.port}`);

      socket.on('message', (m: Message) => {
        console.log(`[${socket.id}](message): ${JSON.stringify(m)}`);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected ${socket.id}`);
      });
    });


  }

  public listen(): http.Server {
    return this.server.listen(this.port, () => {
      console.log(`Running server on port ${this.port}`);
    });
  }

  public getApp(): Application {
    return this.app;
  }

}
