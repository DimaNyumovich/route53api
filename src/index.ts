import express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import {RestManager} from "./applicationServices/restConnections/restManager";
import {ApiManager} from "./services/api/ApiManager";
import {GENERAL_API} from "../classes/api/api_enums";

const cors = require('cors');
import path from 'path'
import {MyRoute53} from "./services/myRoute53";


// const servConf = require('./../../config/services.json')

class Server {

    private port = 3000;
    // private socketIO: SocketIo;
    private app: any;

    public static bootstrap(): Server {
        return new Server();
    }

    // restRouterConfig: REST_ROUTER_CONFIG [] = [
    //     {class: ApiManager, path: GENERAL_API._general},
    // ];

    constructor() {
        this.app = express();
        this.app.use(cors());

        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(bodyParser.urlencoded({extended: false}));
        const server = this.createServer(this.app);
        // this.socketIO = new SocketIo(server);
        this.listen(server);
        // ConfigManager.init();

        this.runListenFunctions(this.app);
        // this.app.get("/", (req, res) => {
        //     res.sendFile(path.resolve('../', 'static', 'index.html'))
        // })
    }

    private runListenFunctions = (app) => {
        const restManager: RestManager = new RestManager(app);
        ApiManager.listen(restManager.routers[GENERAL_API.general]);
        const args = process.argv.slice(2);
        MyRoute53.init(args[0], args[1])
        // this.restRouterConfig.forEach((restRouter: REST_ROUTER_CONFIG) => {
        //     const expressRouter = express.Router();
        //     this.app.use(restRouter.path, expressRouter);
        //     restRouter.class.listen(expressRouter);
        // });
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
