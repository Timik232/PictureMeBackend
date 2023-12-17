export class Config {
    constructor() {
        var _a, _b, _c, _d;
        this.host = (_a = process.env.HOST) !== null && _a !== void 0 ? _a : "localhost";
        this.user = (_b = process.env.USER) !== null && _b !== void 0 ? _b : "root";
        this.password = (_c = process.env.PASSWORD) !== null && _c !== void 0 ? _c : "BasePassword";
        this.database = (_d = process.env.DATABASE) !== null && _d !== void 0 ? _d : "pictureme";
    }
}
