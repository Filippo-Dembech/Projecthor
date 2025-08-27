import React from 'react';
import {ProjectProvider} from './context/ProjectContext.js';
import SaveInterface from './SaveInterface/SaveInterface.js';
import fs from 'fs';
import chalk from 'chalk';
import {warning} from './feedback/warnings.js';
import {parseProjectSetupFile} from './parser.js';
import {isValidProject} from './validation.js';
import {error, printError} from './feedback/errors.js';
import {
	deleteProject,
	existProjectFolder,
	getDefaultFolder,
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
import {feedback} from './feedback/feedbacks.js';
import {ask} from './utils.js';

export async function saveCommand(projectSetupFile?: string) {
	if (projectSetupFile) {
		if (!fs.existsSync(projectSetupFile)) {
			warning.noSetupFileExists(projectSetupFile);
		} else if (!projectSetupFile.endsWith('.psup')) {
			warning.wrongExtension();
		} else {
			try {
				const projects = await parseProjectSetupFile(projectSetupFile);
				projects.forEach(project => {
					const {isValid, errorMessage} = isValidProject(project);
					if (!isValid) {
						printError(errorMessage!);
					} else {
						saveProject(project);
						feedback.projectSaved(project);
					}
				});
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
		feedback.noProjectPresent();
	} else if (fullFlag) {
		console.log(projects);
	} else {
		render(<Projects projects={projects} />);
	}
}

export function setdfCommand(args: string[]) {
	if (args.length === 0) {
		warning.noDefaultFolderPassed();
		return;
	} else {
		const defaultFolderPath = args[0]!;
		if (!fs.existsSync(path.resolve(defaultFolderPath))) {
			error.folderNotExists(defaultFolderPath);
		} else {
			setDefaultFolder(defaultFolderPath);
		}
	}
}

export function getdfCommand() {
	const defaultFolder = getDefaultFolder();
	if (!defaultFolder) {
		feedback.noDefaultFolderPreset();
	} else {
		console.log(`default folder: ${chalk.blue.bold(defaultFolder)}`);
	}
}

export function loadCommand(projectNames: string[], shellFlag?: string) {
	// check if project name has been passed
	if (projectNames.length === 0) warning.noProjectPassed();
	else {
		projectNames.forEach(async projectName => {
			// check if the passed project exist
			if (!isExistingProject(projectName)) {
				warning.projectNotFound(projectName);
			} else if (!existProjectFolder(projectName)) {
				error.projectFolderNotExists(projectName);
			} else {
				feedback.loadingProject(projectName);
				const project = getProjects().find(
					project => project.name === projectName,
				)!; // using '!' because project must exist because of 'isExistingProject()' check before
				try {
					for (let command of project.setupCommands) {
						feedback.runningCommand(command);
						const {stdout, stderr} = shellFlag
							? await execa({cwd: project.folder, shell: shellFlag})`${command}`
							: await execa({cwd: project.folder})`${command}`;
						if (stdout) console.log(stdout);
						if (stderr) console.error(stderr);
					}
					feedback.projectLoadedSuccess(project.name);
				} catch (err) {
					if ((err as ExecaError)?.command) {
						error.wrongCommand((err as ExecaError).command);
					} else {
						error.unknownError();
					}
				}
			}
		});
	}
}

export async function purgeCommand() {
	const projects = getProjects();
	if (projects.length === 0) {
		feedback.noProjectPresent();
	} else {
		const answer: string = await ask(
			'Are you sure you wanna purge the db? (y/n)',
		);

		if (answer.toLowerCase() === 'y') {
			projects.forEach(project => {
				if (!fs.existsSync(project.folder)) {
					deleteProject(project);
				}
			});
		}
	}
}

export async function deleteCommand(projectNames: string[]) {
	const projects = getProjects();
	if (projectNames.length === 0) warning.noProjectPassed();
	else {
		projectNames.forEach(async projectName => {
			// check if the passed project exist
			if (!isExistingProject(projectName)) {
				warning.projectNotFound(projectName);
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
		});
	}
}
