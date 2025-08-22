import chalk from 'chalk';

export function printWarning(message: string) {
	console.log(chalk.yellow(message));
}

export function warnNoSetupFileExists(setupFilePath: string) {
	printWarning(`Project setup file '${setupFilePath}' doesn't exist.`);
}

export function warnWrongExtension() {
	printWarning(
		"Wrong extension. Project setup files must have '.psup' extension.",
	);
}

export function warnNoDefaultFolderPassed() {
    printWarning('No default folder passed. Please insert a default folder path.');
}

export function warnNoProjectPassed() {
    printWarning('No project has been passed');
}

export function warnProjectNotFound(projectName: string) {
    printWarning(`Project '${chalk.bold(projectName)}' not found!`);
}