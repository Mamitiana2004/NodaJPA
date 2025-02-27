import { SearchFile, readFile } from '../file/FileConfig';
import { Pool } from 'pg';

export default class DBConfig {
    private databaseFile: SearchFile;
    private user: string | null = null;
    private host: string | null = null;
    private password: string | null = null;
    private database: string | null = null;
    private port: number | null = null;

    constructor(filename: string) {
        this.databaseFile = new SearchFile(filename);
    }

    async init(file: SearchFile): Promise<void> {
        if (!file) {
            throw new Error("File config database not found");
        }
        try {
            const lines = await readFile(file.absolutePath!);
            lines.forEach((line) => {
                const [linePropretie, lineValue] = line.split('=');
                switch (linePropretie) {
                    case 'user':
                        this.user = lineValue;
                        break;
                    case 'host':
                        this.host = lineValue;
                        break;
                    case 'password':
                        this.password = lineValue;
                        break;
                    case 'database':
                        this.database = lineValue;
                        break;
                    case 'port':
                        this.port = parseInt(lineValue, 10);
                        break;
                }
            });
        } catch (error) {
            throw new Error('Erreur lors de la lecture du fichier de configuration:');
        }
    }

    static async createInstance(filename: string = 'database.config'): Promise<Pool> {
        const dbConfig = new DBConfig(filename);
        await dbConfig.init(dbConfig.databaseFile);

        if (!dbConfig.user || !dbConfig.host || !dbConfig.password || !dbConfig.database || !dbConfig.port) {
            throw new Error('Configuration de la base de données incomplète');
        }

        const pool = new Pool({
            user: dbConfig.user,
            host: dbConfig.host,
            password: dbConfig.password,
            database: dbConfig.database,
            port: dbConfig.port,
        });

        return pool;
    }
}