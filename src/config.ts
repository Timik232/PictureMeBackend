export class Config{
    host: string;
    user: string;
    password: string;
    database: string;

    constructor(){
        this.host = process.env.HOST ?? "localhost";
        this.user = process.env.USER ?? "root";
        this.password = process.env.PASSWORD ?? "BasePassword";
        this.database = process.env.DATABASE ?? "pictureme";
    }
}