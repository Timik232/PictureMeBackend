import { createConnection } from "mysql2"
import { Connection, OkPacketParams, RowDataPacket} from "mysql2/promise.js"
import mysql2 from "mysql2/promise.js"
import { Login } from "./login/login.js";
import {Config} from "./config.js"
import { Portfolio } from "./model/portfolio.js"
import { Chat } from "./model/chat.js"
import { Client } from "./model/client.js"
import { User } from "./model/user.js"
import { error } from "console"
import * as fs from 'fs/promises';

export class DBService {
    private connection: Connection
    constructor(config: Config) {
        this.connection = createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        }
        ).promise();
        console.log("DB provider loaded");
    }
    public async getPortfolio() {
        try {
            const query = "SELECT * FROM portfolio;";
            const [rows] = await this.connection.execute<Portfolio[]>(query);
            return rows ?? [];
        } catch (error) {
            console.error("Error in getting all portfolio ", error);
            return "Error in getting portfolio";
        }
    }
    public async getPortfolioOrdered() {
        try {
            const query = "SELECT * FROM portfolio ORDER BY price;";
            const [rows] = await this.connection.execute<Portfolio[]>(query);
            return rows ?? [];
        } catch (error) {
            console.error("Error in ordering portfolio ", error);
            return "Error in ordering portfolio";
        }
    }
    
    public async getPortfolioOrderedDesc() {
        try {
            const query = "SELECT * FROM portfolio ORDER BY price DESC;";
            const [rows] = await this.connection.execute<Portfolio[]>(query);
            return rows ?? [];
        } catch (error) {
            console.error("Error in ordering desc portfolio ", error);
            return "Error in ordering desc portfolio";
        }
    }
    
    public async getChatsById(client_id: string) {
        try {
            const query = "SELECT * FROM chat WHERE client_id = ? ;";
            const [rows] = await this.connection.execute<Chat[]>(query, [client_id]);
            return rows ?? [];
        } catch (error) {
            console.error("Error in getting chats ", error);
            return "Error in getting chats";
        }
    }
    
    public async getPhotographerById(photographer_id: string){
        return this.connection.query<User[]>(
            `SELECT *
             from photographer where photographer_id=${photographer_id};`).then(
            res => {
                return res[0];
            }
        ).catch(error => {
            console.error("Error in getting photographer ", error);
            return "Error in getting photographer ";
        }) ?? [];
    }
    public async getClientByID(client_id: number) {
        try {
            const query = "SELECT * FROM client WHERE client_id = ? ;";
            const [rows] = await this.connection.execute<Client[]>(query, [client_id]);
            return rows ?? [];
        } catch (error) {
            console.error("Error in getting client ", error);
            return "Error in getting client ";
        }
    }
    public async getPortfolioByName(name: string) {
        try {
            const query = `
                SELECT * FROM portfolio 
                WHERE photographer_id = (
                    SELECT photographer_id 
                    FROM photographer 
                    WHERE photographer_name LIKE ? OR photographer_surname LIKE ?
                );`;
            const [rows] = await this.connection.execute<Portfolio[]>(query, [`%${name}%`, `%${name}%`]);
            return rows ?? [];
        } catch (error) {
            console.error("Error in getting portfolio ", error);
            return "Error in getting portfolio";
        }
    }
    public async getPortfolioByNameOrdered(name: string) {
        try {
            const query = `
                SELECT * FROM portfolio 
                WHERE photographer_id = (
                    SELECT photographer_id 
                    FROM photographer 
                    WHERE photographer_name LIKE ? OR photographer_surname LIKE ?
                ) order by price;`;
            const [rows] = await this.connection.execute<Portfolio[]>(query, [`%${name}%`, `%${name}%`]);
            return rows ?? [];
        } catch (error) {
            console.error("Error in getting portfolio ", error);
            return "Error in getting portfolio";
        }
    }
    public async getPortfolioByNameOrderedDesc(name: string) {
        try {
            const query = `
                SELECT * FROM portfolio 
                WHERE photographer_id = (
                    SELECT photographer_id 
                    FROM photographer 
                    WHERE photographer_name LIKE ? OR photographer_surname LIKE ?
                ) order by price desc;`;
            const [rows] = await this.connection.execute<Portfolio[]>(query, [`%${name}%`, `%${name}%`]);
            return rows ?? [];
        } catch (error) {
            console.error("Error in getting portfolio ", error);
            return "Error in getting portfolio";
        }
    }
    public async updatePortfolio(p: any, portfolio_id: string) {
        try {
            const query = "UPDATE portfolio SET price = ?, description = ? WHERE portfolio_id = ? ;";
            const [row] = await this.connection.execute(query, [p.price, p.description, portfolio_id]);
            return row;
        } catch (error) {
            console.error("Error in update ", error);
            return "Error in update";
        }
    }
    public async deletePortfolio(portfolio_id: string) {
        try {
            const query = "DELETE FROM portfolio WHERE portfolio_id = ? ;";
            await this.connection.execute(query, [portfolio_id]);
            return "Successful deleted";
        } catch (error) {
            console.error("Error in delete ", error);
            return "Error in delete";
        }
    }
    
    public async createPortfolio(p: any) {
        try {
            const query = "INSERT INTO portfolio (photographer_id, description, price) VALUES (?, ?, ?);";
            const [row] = await this.connection.execute(query, [p.photographer_id, p.description, p.price]);
            return row;
        } catch (error) {
            console.error("Error in creating ", error);
            return "Error in creating";
        }
    }
    
    public async getPhotographerName(photographer_id: string) {
        try {
            const query = "SELECT getPhotographerPartName(?) AS partName;";
            const [rows] = await this.connection.execute<Client[]>(query, [photographer_id]);
            return rows[0] ?? [];
        } catch (error) {
            console.error("Error in getting name ", error);
            return "Error in getting name";
        }
    }
    
    public async getChatByName(client_id: string, name: string) {
        try {
            const query = `
                SELECT * FROM chat
                WHERE client_id = ? AND photographer_id = (
                    SELECT photographer_id
                    FROM photographer
                    WHERE photographer_name LIKE ? OR photographer_surname LIKE ?
                );
            `;
    
            const [rows] = await this.connection.execute(query, [client_id, `%${name}%`, `%${name}%`]);
            return rows ?? [];
        } catch (error) {
            console.error("Error in getting chats ", error);
            return "Error in getting chats";
        }
    }    
    public async addUploadedPhotographerPhoto(photographer_id:string, file: Buffer | undefined){
        if (file === undefined) {
            console.log("Can't upload file");
            return "No image uploaded";
        }
        if (!file) {
            return 'No image uploaded or cant upload';
          }
        try {
            // const fileData = await fs.readFile(url);
            const query = `
               update photographer set photographer_photo=? where photographer_id=?;                
            `;    
            const [rows] = await this.connection.execute(query, [file, photographer_id]);
            return rows;
        } catch (error) {
            console.error("Error in uploading ", error);
            return "Error in uploading";
        }
    }
    public async addPhotographerPhoto(photographer_id:string, url: string){        
        try {
            // const fileData = await fs.readFile(url);
            const query = `
               update photographer set photographer_photo=? where photographer_id=?;                
            `;    
            const [rows] = await this.connection.execute(query, [url, photographer_id]);
            return rows;
        } catch (error) {
            console.error("Error in uploading ", error);
            return "Error in uploading";
        }
    }
    public async getPhotographerPhoto(photographer_id: string){
        try {
            const query = `
               select photographer_photo from photographer where photographer_id=?;;                
            `;    
            const [rows] = await this.connection.execute(query, [photographer_id]);
            return rows;
        } catch (error) {
            console.error("Error in getting photo ", error);
            return "Error in getting photo";
        }
    }
    async createUser(body:any){
        try {
            let test_query = `
            select user_login from photographer where user_login=?;`;    
            let [test_rows]: [any, any] = await this.connection.execute(test_query, [body.user_login]);
            if (test_rows !== undefined && test_rows!==null && test_rows!=0) {
                console.log(test_rows[0]);
                return "Пользователь уже существует";
            }
            const query = `
               insert into photographer 
               (photographer_name,photographer_surname,photographer_patronymic,
                photographer_email, user_role, user_login, user_password, photographer_bank_details)
                values(?,?,?,?,?,?,?, 12345);                
            `;    
            const [rows] = await this.connection.execute(query, [body.photographer_name,
                body.photographer_surname,body.photographer_patronymic, body.photographer_email,
                body.user_role,body.user_login, Login.encryptPassword(body.user_password)]);
            return rows;
        } catch (error) {
            console.error("Error in creating user ", error);
            return "Ошибка при создании пользователя";
        }
    }
    async setPassword(photographer_id:string, password: string){
        try{
        const query = `
               update photographer set user_password=? where photographer_id=?;`;    
            const [rows] = await this.connection.execute(query, [Login.encryptPassword(password),photographer_id]);
            return rows;
        } catch (error) {
            console.error("Error in set password ", error);
            return "Error in set password";
        }
    }
    async checkUser(login:string, password:string){
        try {
            let test_query = `
            select * from photographer where user_login=?;`;    
            let [test_rows]: [any, any] = await this.connection.execute(test_query, [login]);
            console.log(test_rows)
            if (test_rows === undefined || test_rows===null || test_rows[0] == 0) {
                console.log("Don't exist");
                return "Пользователь не существует";
            }
            const userPassword = test_rows[0].user_password;
            if (!Login.comparePassword(password, userPassword)){
                console.log("Not Right password");
                return "Неправильный пароль";
            }
            else{
                console.log("Right password");
                return test_rows[0];
            }
        }
        catch (error) {
            console.error("Error in checking user ", error);
            return "Error in checking user";
        }
    }
    async getPhotographerFullName(photographer_id: string){
        try {
            const query = "SELECT getPhotographerFullName(?) AS partName;";
            const [rows] = await this.connection.execute<Client[]>(query, [photographer_id]);
            return rows[0] ?? [];
        } catch (error) {
            console.error("Error in getting name ", error);
            return "Error in getting name";
        }
    }
    async updatePhotographerById(photographer_id: string, body: any){
        try{
            // const query = "update photographer set photographer_name=?, photographer_surname=?,  photographer_patronymic=?, photographer_email=? where photographer_id=?;";
            const query = "call UpdatePhotographer(?, ?, ?, ?, ?);";
            const [rows] = await this.connection.execute<User[]>(query, [body.photographer_name, body.photographer_surname,
                body.photographer_patronymic, body.photographer_email,
                photographer_id]);
            return rows[0] ?? [];
        } catch (error) {
            console.error("Error in updating photographer", error);
            return "Error in updating photographer";
        }        
    }

}