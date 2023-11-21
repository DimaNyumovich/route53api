// import express, { Express, Request, Response} from "express";
import express, {Express, Request, Response} from 'express';
// import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as process from 'process';
import path from 'path'
import {Route53} from "./services/route53";

const PORT = process.env.PORT ?? 3000
const app: Express = express()
const args = process.argv.slice(2);

const init = async (accessKeyId: string, secretAccessKey: string) => {
    await Route53.init(accessKeyId, secretAccessKey)
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(path.resolve('../', 'static', 'index.html'))
})

app.post('/submit', (req: Request, res: Response) => {
    const {subdomain} = req.body;

    res.redirect('/');
    // res.json({ success: true, message: 'Data received successfully' });
});

app.listen(PORT, () => {
    console.log(`Listen on port ${PORT}`)
})

init(args[0], args[1])