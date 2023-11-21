// const request = require('request');
// const _ = require('lodash');
//
// import {
//     GENERAL_API,
//     LDBS_API,
//     SMS_API
// } from "../../../../../classes/dataClasses/api/api_enums";
// import {
//     ASYNC_RESPONSE,
//     MAP
// } from '../../../../../classes/typings/all.typings';
//
//
// const servConf = require('./../../../../../../../../config/services.json');
// const webServiceConf = require('./../../../../../../../../config/webServiceConfig.json');
// const defaultConfig = require('./../../../../../../../../config/defaultConfig.json');
//
// const url_webService = servConf.webService.protocol + '://' + servConf.webService.host + ':' + servConf.webService.port;
// const url_routeService = servConf.routeService.protocol + '://' + servConf.routeService.host + ':' + servConf.routeService.port;
// const url_droneService = servConf.droneService.protocol + '://' + servConf.droneService.host + ':' + servConf.droneService.port;
// const url_SMS = servConf.SMS.protocol + '://' + servConf.SMS.host + ':' + servConf.SMS.port;
// const url_LDBS = servConf.LDBS.protocol + '://' + servConf.LDBS.host + ':' + servConf.LDBS.port;
//
// const timeout = webServiceConf.timeOutREST_OfResponseFromDrone || 10000;
// const loger_timeout = defaultConfig.loger_timeout;
//
// export class RequestManager {
//
//     static externalServiceURLs: MAP<string> = {
//         webService: url_webService,
//         routeService: url_routeService,
//         droneService: url_droneService,
//
//     };
//
//     public static requestToSMS = (path: SMS_API, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
//         return RequestManager.sendRestRequest(url_SMS, GENERAL_API.general + path, bodyObj);
//     };
//
//     public static requestToExternalService = (serviceName: string, path: string, bodyObj: Object = {}): Promise<ASYNC_RESPONSE> => {
//
//         if ( !RequestManager.externalServiceURLs.hasOwnProperty(serviceName) ) {
//             const protocol = _.get(servConf, [serviceName, 'protocol']);
//             const host = _.get(servConf, [serviceName, 'host']);
//             const port = _.get(servConf, [serviceName, 'port']);
//
//             const url = protocol + '://' + host + ':' + port;
//             if ( protocol && host && port && RequestManager.validURL(url) ) {
//                 RequestManager.externalServiceURLs[serviceName] = url;
//             }
//         }
//
//         return RequestManager.sendRestRequest(RequestManager.externalServiceURLs[serviceName], path, bodyObj);
//     };
//
//     public static requestToWebService = (path: string, bodyObj: Object = {}) => {
//         return RequestManager.sendRestRequest(url_webService, path, bodyObj);
//     };
//     public static requestToRouteService = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
//         return RequestManager.sendRestRequestPromise(url_routeService, path, bodyObj);
//     };
//
//     public static requestToFCS = (path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
//         return RequestManager.sendRestRequestPromise(url_droneService, path, bodyObj);
//     };
//
//     public static requestToLDBS = (path: LDBS_API, bodyObj: Object): Promise<ASYNC_RESPONSE> => {
//         return RequestManager.sendRestRequest(url_LDBS, GENERAL_API.general + path, bodyObj, loger_timeout);
//     };
//
//     public static sendRestRequest(url, path: string, bodyObj: Object, timeout_?: number): Promise<ASYNC_RESPONSE> {
//         return new Promise((resolve, reject) => {
//             request({
//                         url: `${url}/${path}`,
//                         method: 'POST',
//                         json: true,
//                         body: bodyObj,
//                         timeout:  timeout_ || timeout,
//                     }, (error, response, body) => {
//                 if ( error != null ) {
//                     reject({error: error});
//                     return null;
//                 }
//                 else {
//                     resolve(response.body);
//                     return null;
//                 }
//             });
//         });
//
//     }
//
//
//     public static sendRestRequestPromise(url: string, path: string, bodyObj: Object): Promise<ASYNC_RESPONSE> {
//         return new Promise((resolve, reject) => {
//             (async () => {
//                 const IP_ = url.split('://');
//                 if ( IP_.length > 1 ) {
//                     // const isOn = await isReachable(IP_[1]);
//                     // if (isOn) {
//                     const res: ASYNC_RESPONSE = {success: false};
//                     if ( RequestManager.validURL(url) ) {
//                         request({
//                                     url: `${url}/${path}`,
//                                     method: 'POST',
//                                     json: true,
//                                     body: bodyObj,
//                                     timeout: timeout,
//                                 }, (error, response, body) => {
//
//                             if ( error != null || typeof body !== 'object' ) {
//                                 res.data = error;
//                                 reject(res);
//                             }
//                             else {
//                                 const respBody = response.body || {};
//                                 res.success = respBody.hasOwnProperty('success') ? respBody.success : !respBody.hasOwnProperty('error');
//                                 res.data = respBody.hasOwnProperty('data') ? respBody.data : respBody;
//                                 resolve(res);
//                             }
//                         });
//                     }
//                     else {
//                         reject(res);
//                     }
//                     // } else {
//                     //     const res: ASYNC_RESPONSE = {success: false};
//                     //     res.description = `port close ${url}`;
//                     //     reject(res);
//                     // }
//                 }
//                 else {
//                     const res: ASYNC_RESPONSE = {success: false, data: {error: `cannot split ip from url ${url}`}};
//                     // reject({error: `cannot split ip from url ${url}`});
//                     reject(res);
//                 }
//             })();
//
//         });
//
//     }
//
//     public static validURL = (string) => {
//         try {
//             return Boolean(new URL(string));
//         } catch ( e ) {
//             return false;
//         }
//     };
//
// }
