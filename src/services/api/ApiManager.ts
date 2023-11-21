// import {DbManager} from '../DB/dbManager';

import {ROUTE53_API} from "../../../classes/api/api_enums";

const _ = require('lodash');
import * as core from 'express-serve-static-core';
import {
    Request,
    Response
} from 'express';
import {ASYNC_RESPONSE, SUBDOMAIN_DATA} from "../../../classes/all.typings";
// import {DBS_API} from "../../../classes/api/api_enums";
import {IRest} from "../../../classes/interfaces/IRest";
import path from 'path'
import {MyRoute53} from "../myRoute53";



export class ApiManager implements IRest {
    private static instance: ApiManager = new ApiManager();

    private constructor() {
    }

    public listen = (router: core.Router): boolean => {
        for (const path in this.routers) {
            if (this.routers.hasOwnProperty(path)) {
                router.use(path, this.routers[path]);
            }
        }
        return true;
    };

    private startPage = (request: Request, response: Response) => {
        response.sendFile(path.resolve(__dirname, '../../../..', 'static', 'index.html'))
    };

    private createSubdomain = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: SUBDOMAIN_DATA = request.body;

        MyRoute53.createSubdomain(requestBody)
            .then(() =>{
                console.log('YES')
            })
            // .then((data: ASYNC_RESPONSE) => {
            //     res.success = data.success;
            //     res.data = {json: data.data};
            //     response.send(res);
            // })
            // .catch((data: ASYNC_RESPONSE) => {
            //     res.success = data.success;
            //     res.data = {json: data.data};
            //     response.send(res);
            // });
    };





    routers: {} = {
        // [DBS_API.getLogsByFilter]: this.getLogsByFilter,
        // [DBS_API.getLogs]: this.getAllLogs,
        [ROUTE53_API.startPage]: this.startPage,
        [ROUTE53_API.createSubdomain]: this.createSubdomain,


    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
