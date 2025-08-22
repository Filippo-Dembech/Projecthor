import chalk from 'chalk';
import {Project} from '../types.js';

export function feedbackProjectSaved(project: Project) {
	console.log(
		`${chalk.green('OK')}: Project '${chalk.green(
			project.name,
		)}' has been successfully saved!`,
	);
}

export function feedbackNoProjectPresent() {
	console.log('No Project is present.\n');
	console.log("Use 'projector save' to save new projects.");
	console.log(
		"You can also use '.psup' files with the '--source' option to save multiple projects faster.",
	);
	console.log("Type 'projector --help, -h' for help.");
}

export function feedbackNoDefaultFolderPreset() {
	console.log('No default folder has been set yet.\n');
	console.log(
		"To set a default folder use 'projector setdf <default_folder_path>' command.",
	);
	console.log("For further help use 'projector --help, -h'.");
}

export function feedbackLoadingProject(projectName: string) {
	console.log(`loading project '${chalk.blue.bold(projectName)}'...`);
}

export function feedbackProjectLoadedSuccess(projectName: string) {
	console.log(
		`'${projectName}' workspace ${chalk.green.bold('successfully')} loaded!`,
	);
}
