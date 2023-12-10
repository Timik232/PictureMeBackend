import Express from 'express';
import bodyParser from "body-parser";
import { DBService } from './mysql.js';
import { Config } from './config.js';
import multer from 'multer';
import cors from "cors";
import session from "express-session";
// const CI = process.env.CI;
// const server = Express().disable("x-powered-by");
export class Application {
    constructor() {
        this.port = 8080;
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
        this.app.use(cors({
            origin: "*"
        }));
        this.app.use(session({
            secret: "your-secret-key11",
            resave: true,
            saveUninitialized: true,
        }));
        const storage = multer.memoryStorage();
        const upload = multer({ storage: storage });
        this.app.get("/portfolio", this.getPortfolio.bind(this));
        this.app.get("/photographer/:id", this.getPhotographerById.bind(this));
        this.app.get("/chat/:id", this.getChats.bind(this));
        this.app.get("/portfolio/ordered", this.getPortfolioOrdered.bind(this));
        this.app.get("/portfolio/orderedDesc", this.getPortfolioOrderedDesc.bind(this));
        this.app.delete("/portfolio/:id", this.deletePortfolio.bind(this));
        this.app.put("/portfolio/:id", this.updatePortfolio.bind(this));
        this.app.post("/portfolio", this.createPortfolio.bind(this));
        this.app.get("/photographerName/:id", this.getPhotographerName.bind(this));
        this.app.get("/photographerFullName/:id", this.getPhotographerFullName.bind(this));
        this.app.get("/chat/name/:id", this.getChatByName.bind(this));
        this.app.post("/photographerPhotoUpload/:id", upload.single('image'), this.addUploadedPhotographerPhoto.bind(this));
        this.app.post("/photographerPhoto/:id", this.addPhotographerPhoto.bind(this));
        this.app.get("/photographerPhoto/:id", this.getPhotographerPhoto.bind(this));
        this.app.get("/portfolioByName/:name", this.getPortfolioByName.bind(this));
        this.app.get("/portfolioByName/Ordered/:name", this.getPortfolioByNameOrdered.bind(this));
        this.app.get("/portfolioByName/OrderedDesc/:name", this.getPortfolioByNameOrderedDesc.bind(this));
        this.app.put("/setPassword/:id", this.setPassword.bind(this));
        this.app.post("/createUser", this.createUser.bind(this));
        this.app.post("/login", this.checkUser.bind(this));
        this.app.get("/checkSession", this.checkSession.bind(this));
        this.app.get("/exit", this.clearSession.bind(this));
        this.app.put("/photographer/:id", this.updatePhotographerById.bind(this));
    }
    async getPortfolio(req, res) {
        res.json(await this.db.getPortfolio());
    }
    async getChats(req, res) {
        res.json(await this.db.getChatsById(req.params.id));
    }
    async getPhotographerById(req, res) {
        res.json(await this.db.getPhotographerById(req.params.id));
    }
    async updatePortfolio(req, res) {
        res.json(await this.db.updatePortfolio(req.body, req.params.id));
    }
    async deletePortfolio(req, res) {
        res.json(await this.db.deletePortfolio(req.params.id));
    }
    async createPortfolio(req, res) {
        res.json(await this.db.createPortfolio(req.body));
    }
    async getPortfolioOrderedDesc(req, res) {
        res.json(await this.db.getPortfolioOrderedDesc());
    }
    async getPortfolioOrdered(req, res) {
        res.json(await this.db.getPortfolioOrdered());
    }
    async getPhotographerName(req, res) {
        res.json(await this.db.getPhotographerName(req.params.id));
    }
    async getPhotographerFullName(req, res) {
        res.json(await this.db.getPhotographerFullName(req.params.id));
    }
    async getChatByName(req, res) {
        res.json(await this.db.getChatByName(req.params.id, req.body.name));
    }
    async addPhotographerPhoto(req, res) {
        res.json(await this.db.addPhotographerPhoto(req.params.id, req.body.url));
    }
    async addUploadedPhotographerPhoto(req, res) {
        var _a;
        res.json(await this.db.addUploadedPhotographerPhoto(req.params.id, (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer));
    }
    async getPhotographerPhoto(req, res) {
        let imageurl = (await this.db.getPhotographerPhoto(req.params.id));
        let imageurl_str = process.cwd() + "/" + String(imageurl[0].photographer_photo);
        res.sendFile(imageurl_str);
    }
    async getPortfolioByNameOrderedDesc(req, res) {
        res.json(await this.db.getPortfolioByNameOrderedDesc(decodeURI(req.params.name)));
    }
    async getPortfolioByNameOrdered(req, res) {
        res.json(await this.db.getPortfolioByNameOrdered(decodeURI(req.params.name)));
    }
    async getPortfolioByName(req, res) {
        res.json(await this.db.getPortfolioByName(decodeURI(req.params.name)));
    }
    async setPassword(req, res) {
        res.json(await this.db.setPassword(req.params.id, req.body.password));
    }
    async createUser(req, res) {
        if (this.isValidLogin(req.body.login)) {
            let result = await this.db.createUser(req.body);
            if (result === "Пользователь уже существует") {
                console.log(result);
                res.status(422).json(result);
            }
            else if (result === "Ошибка при создании пользователя") {
                res.status(500).json(result);
                console.log(result);
            }
            else {
                res.status(200).json(result);
            }
        }
        else {
            res.status(422).json("Недопустимый логин");
            console.log("Недопустимый логин");
        }
    }
    isValidLogin(login) {
        const validLoginRegex = /^[a-zA-Z0-9_]+$/;
        return validLoginRegex.test(login);
    }
    async checkUser(req, res) {
        if (this.isValidLogin(req.body.login)) {
            try {
                let result = await this.db.checkUser(req.body.login, req.body.password);
                console.log("res is ", result);
                if (result === "Пользователь не существует" || result[0] == 0) {
                    console.log(result);
                    res.status(404).json(result);
                }
                else if (result === "Неправильный пароль") {
                    res.status(401).json(result);
                }
                else if (result === "Error in checking use") {
                    res.status(500).json(result);
                }
                else {
                    console.log("authenticate");
                    req.session.user = {
                        user_id: result.photographer_id,
                        role: result.user_role
                    };
                    console.log(req.session.user);
                    res.status(200).json(result);
                }
            }
            catch (error) {
                res.status(401).json("Ошибка аутентификации");
            }
        }
        else {
            console.log("Недопустимый логин");
            res.status(422).json("Недопустимый логин");
        }
    }
    async checkSession(req, res) {
        var _a, _b, _c;
        let user_obj = getUser(req);
        console.log("check ", req.session.user);
        if (req.session.user === undefined || ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.user_id) === undefined) {
            res.status(401).json("Don't authorized");
            return;
        }
        else {
            console.log(req.session.user);
        }
        let id = (_c = (_b = req.session) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.user_id;
        if (id === undefined) {
            res.status(401).json("Don't authorized");
            return;
        }
        let result = await this.db.getPhotographerById(id !== null && id !== void 0 ? id : "");
        console.log(result);
        if (result == "Error in getting photographer ") {
            res.status(401).json("Don't authorized");
            return;
        }
        else if (result != "Error in getting photographer" && result !== undefined && result !== null) {
            console.log("I get ", result);
            res.status(200).json(result);
            return;
        }
        else {
            res.status(401).json("Don't authorized");
            return;
        }
    }
    async clearSession(req, res) {
        if (req.session.user !== undefined) {
            req.session.user = {
                user_id: "undefined",
                role: "undefined"
            };
        }
        res.json("Session cleared");
    }
    async updatePhotographerById(req, res) {
        res.json(await this.db.updatePhotographerById(req.params.id, req.body));
    }
}
