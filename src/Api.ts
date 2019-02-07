import { MongoClient, Db, ObjectID } from "mongodb";
import { IPaste } from "./Paste";
import md5 = require("md5");
import { Router } from "express";
import * as bodyParser from "body-parser";


const DB_NAME = "pasteburn";
const DB_POST_COLLECTION = "pastes";

export function getApiRoute(api: Api) {
    if (!api) {
        const router = Router();
        router.all("/", (req, res) => {
            res.sendStatus(500);
        });
    }

    const router = Router();
    router.use(bodyParser.json());

    router.get("/paste/:id", (req, res) => {
        api.getPaste(req.params.id).then(paste => {
            res.send(paste);
        });
    });

    router.post("/paste", (req, res) => {
        const data = req.body.data;
        const expiry = req.body.expiry;
        const burn = req.body.burn;

        api.addPaste(data).then((id) => {
            res.send(id);
        });
    });

    return router;
}

export class Api {

    private _db: Db;

    constructor(client: MongoClient) {
        this._db = client.db(DB_NAME);
    }

    public async addPaste(data: string, expiry?: number, burn: boolean = false) {

        // generate paste id
        const timestamp = Date.now();
        const id = md5(Buffer.from(JSON.stringify(data) + timestamp));

        if (!expiry) {
            const date = new Date();
            date.setMonth(date.getMonth() + 1);
            expiry = date.getTime();
        }

        const paste: IPaste = {
            id,
            timestamp,
            data,
            expiry,
            burn
        }

        await this._db.collection(DB_POST_COLLECTION).insertOne({ ...paste, id });

        return id;
    }

    public async getPaste(id: string) {
        const paste = await this._db.collection(DB_POST_COLLECTION).findOne({ id }) as IPaste;

        if (Date.now() > paste.expiry || paste.burn) {
            this._db.collection(DB_POST_COLLECTION).deleteOne({ id });
        }

        return paste;
    }

    public deletePaste(id: string) {
        return this._db.collection(DB_POST_COLLECTION).deleteOne({ id });
    }

}