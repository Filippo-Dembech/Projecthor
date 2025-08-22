import React from 'react';
import {ProjectProvider} from './context/ProjectContext.js';
import SaveInterface from './SaveInterface/SaveInterface.js';
import fs from 'fs';
import chalk from 'chalk';
import { printWarning } from './errors/errors.js';
import {parseProjectSetupFile} from './parser.js';
import {isValidProject} from './validation.js';
import {error} from './errors/errors.js';
import {
	deleteProject,
	existProjectFolder,
	getDefaultFolder,
	getProjectFolder,
	getProjects,
	isExistingProject,
	saveProject,
	setDefaultFolder,
} from './db.js';
import {render} from 'ink';
import {Project} from './types.js';
import Projects from './Projects.js';
import path from 'path';
import {execa, ExecaError} from 'execa';
import readline from 'readline';

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

export async function loadCommand(args: string[], shellFlag?: string) {
	// check if project name has been passed
	if (args.length === 0) console.log('No project has been passed');
	else {
		for (let projectName of args) {
			// check if the passed project exist
			if (!isExistingProject(projectName)) {
				console.log(`Project '${chalk.blue.bold(projectName)}' not found!`);
			} else if (!existProjectFolder(projectName)) {
				console.log(
					chalk.red.bold(
						`Project '${projectName}' folder '${getProjectFolder(
							projectName,
						)}' doesn't exist.`,
					),
				);
			} else {
				console.log(`loading project '${chalk.blue.bold(projectName)}'...`);
				const project = getProjects().find(
					project => project.name === projectName,
				)!; // using '!' because project must exist because of 'isExistingProject()' check before
				try {
					for (let command of project.setupCommands) {
						const {stdout} = shellFlag
							? await execa({cwd: project.folder, shellFlag})`${command}`
							: await execa({cwd: project.folder})`${command}`;
						if (stdout) console.log(stdout);
					}
					console.log(
						`'${project.name}' workspace ${chalk.green.bold(
							'successfully',
						)} loaded!`,
					);
				} catch (err) {
					console.error((err as ExecaError).originalMessage);
				}
			}
		}
	}
}

export async function purgeCommand() {
	const projects = getProjects();
	if (projects.length === 0) {
		console.log('No Project is present.\n');
		console.log("Use 'projector save' to save new projects.");
		console.log(
			"You can also use '.psup' files with the '--source' option to save multiple projects faster.",
		);
		console.log("Type 'projector --help, -h' for help.");
	} else {
		const answer: string = await new Promise(resolve => {
			const prompt = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			});
			prompt.question(`Are you sure you wanna purge the db? (y/n) `, ans => {
				prompt.close();
				resolve(ans);
			});
		});

		if (answer.toLowerCase() === 'y') {
			for (let project of projects) {
				if (!fs.existsSync(project.folder)) {
					deleteProject(project);
				}
			}
		}
	}
}

export async function deleteCommand(args: string[]) {
	const projects = getProjects();
	if (args.length === 0) console.log('No project has been passed');
	else {
		for (let projectName of args) {
			// check if the passed project exist
			if (!isExistingProject(projectName)) {
				console.log(`Project '${chalk.blue.bold(projectName)}' not found!`);
			} else {
				const project = projects.find(p => p.name === projectName)!; // using '!' because project must exist because of 'isExistingProject()' check before

				const answer: string = await new Promise(resolve => {
					const prompt = readline.createInterface({
						input: process.stdin,
						output: process.stdout,
					});
					prompt.question(
						`Do you want to delete '${chalk.blue.bold(projectName)}'? (y/n) `,
						ans => {
							prompt.close();
							resolve(ans);
						},
					);
				});

				if (answer.toLowerCase() === 'y') {
					deleteProject(project);
				}
			}
		}
	}
}
