import { RowDataPacket } from "mysql2/promise";

export interface User extends RowDataPacket{
    photographer_id: number;
    photographer_name: string;
    photographer_surname: string;
    photographer_patronymic?: string;
    photographer_email: string;
    photographer_bank_details?: number;
    user_role:string;
    user_login:string;
    user_password:string;
}