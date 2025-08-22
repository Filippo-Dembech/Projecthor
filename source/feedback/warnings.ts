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
