import { Login } from "../login.js";
export class User {
    constructor(user) {
        this.login = user.login;
        this.password = Login.encryptPassword(user.password);
    }
}
