import { Pool } from 'pg';
require("dotenv").config();

export default class DBConfig {
    
    static async createInstance(filename: string = 'database.config'): Promise<Pool> {
        const pool = new Pool({
            user: process.env.NODAJPA_USER,
            host: process.env.NODAJPA_HOST,
            database: process.env.NODAJPA_NAME,
            password: process.env.NODAJPA_PASSWORD,
            port: parseInt(process.env.NODAJPA_PORT || "", 10)
        });

        return pool;
    }
}