import chalk from "chalk";

export function printWarning(message: string) {
	console.log(chalk.yellow(message));
}