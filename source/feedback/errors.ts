import chalk from "chalk"

export function printWarning(message: string) {
	console.log(chalk.yellow(message));
}

export function printError(message: string) {
    console.log(chalk.red.bold(message));
}

export function alreadyExistingProjectError(projectName: string) {
    printError(`Project '${projectName}' already exist. Can't create another project instance.`);
}