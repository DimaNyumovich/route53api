import express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import {RestManager} from "./applicationServices/restConnections/restManager";
import {ApiManager} from "./services/api/ApiManager";
import {GENERAL_API} from "../classes/api/api_enums";

const cors = require('cors');
import {MyRoute53} from "./services/myRoute53";

class Server {

    private port = 3000;
    private app: any;

    public static bootstrap(): Server {
        return new Server();
    }



    constructor() {
        this.app = express();
        this.app.use(cors());

        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(bodyParser.urlencoded({extended: false}));
        const server = this.createServer(this.app);
        this.listen(server);

        this.runListenFunctions(this.app);
    }

    private runListenFunctions = (app) => {
        const restManager: RestManager = new RestManager(app);
        ApiManager.listen(restManager.routers[GENERAL_API.general]);
        // const args = process.argv.slice(2);
        // MyRoute53.init(args[0], args[1])
        const ACCESS_KEY = process.env.ACCESS_KEY
        const SECRET_KEY = process.env.SECRET_KEY
        console.log(ACCESS_KEY)
        console.log(SECRET_KEY)
        MyRoute53.init(ACCESS_KEY, SECRET_KEY)

    };

    private createServer = (app) => {
        return http.createServer(app);
    };

    private listen = (server): any => {
        server.listen(this.port, () => {
            console.log('Running server on port ', this.port);
        });
    }
}

Server.bootstrap();
