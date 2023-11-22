// import {DbManager} from '../DB/dbManager';

import {ROUTE53_API} from "../../../classes/api/api_enums";

import * as core from 'express-serve-static-core';
import {
    Request,
    Response
} from 'express';
import {ASYNC_RESPONSE, DOMAIN_NAME, SUBDOMAIN_DATA} from "../../../classes/all.typings";

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
            .then((data: ASYNC_RESPONSE) =>{
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE) => {
                response.send(data);
            });
    };

    private getAllDomains = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        MyRoute53.getAllDomainNames()
            .then((data: ASYNC_RESPONSE) =>{
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE) => {
                response.send(data);
            });
    };

    private getAllSubdomains = (request: Request, response: Response) => {
        const res: ASYNC_RESPONSE = {success: false};
        const requestBody: DOMAIN_NAME = request.body;

        MyRoute53.getAllSubDomains(requestBody)
            .then((data: ASYNC_RESPONSE) =>{
                response.send(data);
            })
            .catch((data: ASYNC_RESPONSE) => {
                response.send(data);
            });
    };







    routers: {} = {
        [ROUTE53_API.startPage]: this.startPage,
        [ROUTE53_API.createSubdomain]: this.createSubdomain,
        [ROUTE53_API.getAllDomains]: this.getAllDomains,
        [ROUTE53_API.getAllSubdomains]: this.getAllSubdomains,


    };

    // region API uncions
    public static listen = ApiManager.instance.listen;

    // endregion API uncions

}
