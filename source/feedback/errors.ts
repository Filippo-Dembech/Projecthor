import chalk from 'chalk';
import {getProjectFolder} from '../db.js';

export function printError(message: string) {
	console.error(message);
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
	wrongCommand(command: string) {
		console.error(`Some error occured while running '${command}'`);
		console.error('Check whether your command syntax is right or you are running your commands with the right shell.');
		console.error('Use the --shell flag to define the right shell.');
	},
	unknownError() {
		console.error('Unknown error occurs.');
	},
};
