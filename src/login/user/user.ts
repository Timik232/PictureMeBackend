import { Login } from "../login.js";

export interface IUser {
    username?: string;
    login: string;
    password: string;
}

export class User implements IUser{
    login: string;
    password: string;
    
    constructor(user: User) {
        this.login = user.login;
        this.password = Login.encryptPassword(user.password);
    }
}