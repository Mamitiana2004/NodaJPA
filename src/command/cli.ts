#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { generateTypecriptModel, getColumn } from './config/command.process';
import readline from 'readline';
import { getTableName } from '../utils/db_decorator.process';

const program = new Command();

const askQuestion = (question: string): Promise<string> => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			rl.close();
			resolve(answer.trim().toLowerCase()); // Normaliser la réponse
		});
	});
};

const askCreateModelForFK = async (foreignTable: string, tableName: string): Promise<boolean> => {
	const answer = await askQuestion(`Voulez-vous créer un modèle pour la table "${foreignTable}" qui est une clé étrangère de ${tableName}? (o/n) : `);
	return answer === 'o';
};

const generateModelAndDependencies = async (tableName: string, outputDir: string, fkColumns: any[] = []) => {
	try {
		// Récupérer les colonnes de la table, y compris les FK
		const columns = await getColumn(tableName);

		// Parcourir les FK et poser une question pour chaque table référencée
		for (const column of columns) {
			if (column.foreignKey) {
				const { table: foreignTable } = column.foreignKey;

				// Demander si l'utilisateur souhaite créer un modèle pour la table référencée
				const shouldCreateModel = await askCreateModelForFK(foreignTable, tableName);

				if (shouldCreateModel) {
					// Ajouter la FK à la liste des FK à inclure
					fkColumns.push({ column: column.name, foreignTable });

					// Générer récursivement le modèle pour la table référencée
					await generateModelAndDependencies(foreignTable,outputDir);
				}
			}
		}

		// Générer le modèle pour la table actuelle
		const template = await generateTypecriptModel(tableName, fkColumns);
		const filePath = path.join(outputDir, `${tableName}.model.ts`);
		fs.writeFileSync(filePath, template);
		console.log(`Generated ${filePath}`);


	} catch (err) {
		console.error('Erreur lors de la génération des modèles :', err);
	}
};

program
	.version('1.0.0')
	.description('Generate NodaJPA code from a template');

program
	.command('generate <name>')
	.description('Generate a new NodaJPA Model')
	.option('-d, --dir <directory>', 'Specify the output directory', process.cwd())
	.action(async (name: string, options: { dir: string }) => {
		if (!fs.existsSync(options.dir)) {
			fs.mkdirSync(options.dir, { recursive: true });
		}
		await generateModelAndDependencies(name,options.dir);
	});

program.parse(process.argv);
