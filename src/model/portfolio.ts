import { RowDataPacket } from "mysql2/promise";

export interface Portfolio extends RowDataPacket{
    photographer_id: number;
    portfolio_id: number;
    description: string;
    price: number;
}