import { WebSocket, WebSocketServer } from "https://deno.land/x/websocket@v0.0.6/mod.ts";
import { Block } from "./src/blocks/block.ts";
import { Blockchain } from "./src/blocks/blockchain.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config();

const  P2P_PORT = parseInt(env.P2P_PORT) || 5000;
const peers = env.PEERS ? env.PEERS.split(',') : []

export class P2PService {

    //peers : Array<any> = [];
    blockchain : Blockchain;
    sockets : Array<WebSocket> = [];

    constructor(blockchain : Blockchain) {
        this.blockchain = blockchain;
    }

    connectNode(){
        const wss = new WebSocketServer(P2P_PORT);
        wss.on("connection", (ws: WebSocket) => this.onConnection(ws));
        //console.log(`Set of clients ${wss.clients}`);
        peers.forEach((peer : any) => {
            const socket = new WebSocket(peer);
            wss.on("open", () => this.onConnection(socket))
        });

        console.log(`Service ws running on port:${P2P_PORT}`)
    }

    onConnection(ws : WebSocket){
        console.log('[ws: New Node] connected.');
        this.sockets.push(ws);

        ws.on("open", () => {
            console.log("Client Socket opened");
        });
        ws.on("message", (message : any) => {
            console.log(message);
            //this.broadcast(type, value);
            const messagexx = JSON.stringify({ type: "Blocks", value :this.blockchain.blocks});
            ws.send(messagexx);
        });
    }

    broadcast(type : string, value : string){
        console.log(`[ws: broadcast] ${type}`);
        const message = JSON.stringify({type, value});
        this.sockets.forEach((socket) => socket.send(message));
    }


}