import { Server } from "./Server"
import { MongoClient } from "mongodb";

export async function start() {
    const connectionUri = process.env.PASTEBURN_CONNECTION_URI as string | "";
    const client = await MongoClient.connect(connectionUri, { useNewUrlParser: true });
    const server = new Server(client);

    server.start().then(() => {
        console.log("server started");
    });
}

start();