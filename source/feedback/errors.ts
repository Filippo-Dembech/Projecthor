import chalk from 'chalk';
import {getProjectFolder} from '../db.js';

export function printError(message: string) {
	console.log(chalk.red.bold(message));
}

export const error = {
	alreadyExistingProject(projectName: string) {
		printError(
			`Project '${projectName}' already exist. Can't create another project instance.`,
		);
	},

	folderNotExists(folder: string) {
		printError(`Path '${chalk.bold(folder)}' doesn't exist.`);
	},

	projectFolderNotExists(projectName: string) {
		printError(
			`Project '${projectName}' folder '${getProjectFolder(
				projectName,
			)}' doesn't exist.`,
		);
	},
};

