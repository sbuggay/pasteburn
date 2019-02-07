import * as express from "express";
import { MongoClient } from "mongodb";
import { Api, getApiRoute } from "./Api";

export class Server {

    /**
     * Reference to the express application
     *
     * @private
     * @type {express.Application}
     * @memberof Server
     */
    private _app: express.Application;

    /**
     * Port for express server to use
     *
     * @private
     * @type {number}
     * @memberof Server
     */
    private _port: number;

    /**
     * API client
     *
     * @private
     * @type {Api}
     * @memberof Server
     */
    private _api: Api;

    constructor(client: MongoClient, port: number = 5050) {
        this._app = express();
        this._port = port;
        this._api = new Api(client);
    }

    private _setRoutes() {
        this._app.get("/", (req, res) => {
            res.sendStatus(200);
        });

        this._app.use("/api", getApiRoute(this._api));
    }

    public async start() {
        return new Promise((resolve, reject) => {
            this._app.listen(this._port, () => resolve());
            this._setRoutes();
        });
    }
}