import React from 'react';
import {ProjectProvider} from './context/ProjectContext.js';
import SaveInterface from './SaveInterface/SaveInterface.js';
import fs from 'fs';
import chalk from 'chalk';
import {printWarning} from './utils.js';
import {parseProjectSetupFile} from './parser.js';
import {isValidProject} from './validation.js';
import {error} from './errors/errors.js';
import {getDefaultFolder, saveProject, setDefaultFolder} from './db.js';
import {render} from 'ink';
import {Project} from './types.js';
import Projects from './Projects.js';
import path from 'path';

export async function saveCommand(projectSetupFile?: string) {
	if (projectSetupFile) {
		if (!fs.existsSync(projectSetupFile)) {
			printWarning(`Project setup file '${projectSetupFile}' doesn't exist.`);
		} else if (!projectSetupFile.endsWith('.psup')) {
			printWarning(
				"Wrong extension. Project setup files must have '.psup' extension.",
			);
		} else {
			try {
				const projects = await parseProjectSetupFile(projectSetupFile);
				for (let project of projects) {
					const {isValid, errorMessage} = isValidProject(project);
					if (!isValid) {
						console.log(error(errorMessage));
					} else {
						saveProject(project);
						console.log(
							`${chalk.green('OK')}: Project '${chalk.green(
								project.name,
							)}' has been successfully saved!`,
						);
					}
				}
			} catch (err) {
				console.log(err);
			}
		}
	} else {
		render(
			<ProjectProvider>
				<SaveInterface />
			</ProjectProvider>,
		);
	}
}

export function listCommand(projects: Project[], fullFlag?: boolean) {
	if (projects.length === 0) {
		console.log('No Project is present.\n');
		console.log("Use 'projector save' to save new projects.");
		console.log(
			"You can also use '.psup' files with the '--source' option to save multiple projects faster.",
		);
		console.log("Type 'projector --help, -h' for help.");
	} else if (fullFlag) {
		console.log(projects);
	} else {
		render(<Projects projects={projects} />);
	}
}

export function setdfCommand(args: string[]) {
	if (args.length === 0) {
		console.log(
			chalk.yellow(
				'No default folder passed. Please insert a default folder path.',
			),
		);
	} else {
		const defaultFolderPath = args[0]!;
		if (!fs.existsSync(path.resolve(defaultFolderPath))) {
			console.log(
				chalk.yellow(`Path '${chalk.bold(defaultFolderPath)}' doesn't exist.`),
			);
		} else {
			setDefaultFolder(defaultFolderPath);
		}
	}
}

export function getdfCommand() {
	const defaultFolder = getDefaultFolder();
	if (!defaultFolder) {
		console.log('No default folder has been set yet.\n');
		console.log(
			"To set a default folder use 'projector setdf <default_folder_path>' command.",
		);
		console.log("For further help use 'projector --help, -h'.");
	} else {
		console.log('default folder:', defaultFolder);
	}
}
