import { RowDataPacket } from "mysql2/promise";

export interface Chat extends RowDataPacket{
    chat_id: number;
    photographer_id: number;
    messages_amount: number;
    last_message: string;
    last_time: string;
}