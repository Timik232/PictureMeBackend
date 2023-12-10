import { RowDataPacket } from "mysql2/promise";

export interface Client extends RowDataPacket{
    client_id: number;
    client_name: string;
    client_surname: string;
    client_patronymic: string;
    client_email: string;
}