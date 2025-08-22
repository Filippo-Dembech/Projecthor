import chalk from "chalk"

export const error = chalk.red.bold;

export function alreadyExistingProjectError(projectName: string) {
    const message = error(`Project '${projectName}' already exist. Can't create another project instance.`)
    console.log(message);
}

export function printWarning(message: string) {
	console.log(chalk.yellow(message));
}


