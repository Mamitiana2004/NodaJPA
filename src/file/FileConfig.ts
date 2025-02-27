import fs from 'fs';
import path from 'path';
import readline from 'readline';

export class SearchFile {
    absolutePath: string | null = null;

    searchFile(dir: string, fileName: string): string | null {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) {
                const found = this.searchFile(fullPath, fileName);
                if (found) return found;
            } else if (file.name === fileName) {
                this.absolutePath = fullPath;
                return fullPath;
            }
        }
        return null;
    }

    constructor(filename: string) {
        const rootDir = process.cwd();
        const foundPath = this.searchFile(rootDir, filename);
        if (!foundPath) {
            console.error("Fichier non trouvé");
        }
    }
}

export const readFile = (filePath: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const lines: string[] = [];
        try {
            const stream = fs.createReadStream(filePath, { encoding: 'utf-8' });
            const rl = readline.createInterface({
                input: stream,
                crlfDelay: Infinity,
            });

            rl.on('line', (line: string) => {
                const trimmedLine = line.trim();
                if (trimmedLine !== '') {
                    lines.push(trimmedLine); // Stocker uniquement les lignes non vides
                }
            });

            rl.on('close', () => {
                resolve(lines); // Retourne le tableau des lignes quand la lecture est terminée
            });

            rl.on('error', (err: any) => {
                reject(err); // Capture les erreurs de lecture
            });
        } catch (error) {
            reject(error);
        }
    });
};