import chalk from 'chalk';

export function printError(message: string) {
	console.log(chalk.red.bold(message));
}

export function alreadyExistingProjectError(projectName: string) {
	printError(
		`Project '${projectName}' already exist. Can't create another project instance.`,
	);
}

export function errorFolderNotExist(folder: string) {
	console.log(chalk.red(`Path '${chalk.bold(folder)}' doesn't exist.`));
}
