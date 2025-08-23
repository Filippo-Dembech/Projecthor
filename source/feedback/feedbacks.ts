import chalk from 'chalk';
import {Project} from '../types.js';

export const feedback = {
	projectSaved(project: Project) {
		console.log(
			`${chalk.green('OK')}: Project '${chalk.green(
				project.name,
			)}' has been successfully saved!`,
		);
	},

	noProjectPresent() {
		console.log('No Project is present.\n');
		console.log("Use 'projector save' to save new projects.");
		console.log(
			"You can also use '.psup' files with the '--source' option to save multiple projects faster.",
		);
		console.log("Type 'projector --help, -h' for help.");
	},

	noDefaultFolderPreset() {
		console.log('No default folder has been set yet.\n');
		console.log(
			"To set a default folder use 'projector setdf <default_folder_path>' command.",
		);
		console.log("For further help use 'projector --help, -h'.");
	},
	loadingProject(projectName: string) {
		console.log(`loading project '${chalk.blue.bold(projectName)}'...`);
	},
	projectLoadedSuccess(projectName: string) {
		console.log(
			`'${projectName}' workspace ${chalk.green.bold('successfully')} loaded!`,
		);
	},
};
