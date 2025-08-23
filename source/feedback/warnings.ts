import chalk from 'chalk';

export function printWarning(message: string) {
	console.log(chalk.yellow(message));
}

export const warning = {
	noSetupFileExists(setupFilePath: string) {
		printWarning(`Project setup file '${setupFilePath}' doesn't exist.`);
	},

	wrongExtension() {
		printWarning(
			"Wrong extension. Project setup files must have '.psup' extension.",
		);
	},

	noDefaultFolderPassed() {
		printWarning(
			'No default folder passed. Please insert a default folder path.',
		);
	},

	noProjectPassed() {
		printWarning('No project has been passed');
	},

	projectNotFound(projectName: string) {
		printWarning(`Project '${chalk.bold(projectName)}' not found!`);
	},
};
