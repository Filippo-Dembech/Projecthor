import chalk from 'chalk';
import {Project} from '../types.js';

export function feedbackProjectSaved(project: Project) {
	console.log(
		`${chalk.green('OK')}: Project '${chalk.green(
			project.name,
		)}' has been successfully saved!`,
	);
}
