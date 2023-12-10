import Express from 'express';
import bodyParser from "body-parser";
import { DBService } from './mysql.js';
import { Config } from './config.js';
export class Application {
    constructor() {
        this.port = 80;
        this.app = Express();
        this.db = new DBService(new Config());
    }
    start() {
        this.app.use(bodyParser.json());
        this.setupRoutes();
        this.listener = this.app.listen(this.port, () => {
            console.log(`Server running at http://localhost:${this.port}`);
        });
    }
    setupRoutes() {
        this.app.get("/portfolio", this.getPortfolio.bind(this));
    }
    async getPortfolio(req, res) {
        res.json(await this.db.getPortfolio());
    }
}
