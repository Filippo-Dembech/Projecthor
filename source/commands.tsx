import React from 'react';
import {ProjectProvider} from './context/ProjectContext.js';
import SaveInterface from './SaveInterface/SaveInterface.js';
import fs from 'fs';
import chalk from 'chalk';
import {
	warnNoDefaultFolderPassed,
	warnNoProjectPassed,
	warnNoSetupFileExists,
	warnProjectNotFound,
	warnWrongExtension,
} from './feedback/warnings.js';
import {parseProjectSetupFile} from './parser.js';
import {isValidProject} from './validation.js';
import {
	errorFolderNotExist,
	errorProjectFolderNotExists,
	printError,
} from './feedback/errors.js';
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
import {
	feedbackLoadingProject,
	feedbackNoDefaultFolderPreset,
	feedbackNoProjectPresent,
	feedbackProjectLoadedSuccess,
	feedbackProjectSaved,
} from './feedback/feedbacks.js';

export async function saveCommand(projectSetupFile?: string) {
	if (projectSetupFile) {
		if (!fs.existsSync(projectSetupFile)) {
			warnNoSetupFileExists(projectSetupFile);
		} else if (!projectSetupFile.endsWith('.psup')) {
			warnWrongExtension();
		} else {
			try {
				const projects = await parseProjectSetupFile(projectSetupFile);
				projects.forEach(project => {
					const {isValid, errorMessage} = isValidProject(project);
					if (!isValid) {
						printError(errorMessage!);
					} else {
						saveProject(project);
						feedbackProjectSaved(project);
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
		feedbackNoProjectPresent();
	} else if (fullFlag) {
		console.log(projects);
	} else {
		render(<Projects projects={projects} />);
	}
}

export function setdfCommand(args: string[]) {
	if (args.length === 0) {
		warnNoDefaultFolderPassed();
		return;
	} else {
		const defaultFolderPath = args[0]!;
		if (!fs.existsSync(path.resolve(defaultFolderPath))) {
			errorFolderNotExist(defaultFolderPath);
		} else {
			setDefaultFolder(defaultFolderPath);
		}
	}
}

export function getdfCommand() {
	const defaultFolder = getDefaultFolder();
	if (!defaultFolder) {
		feedbackNoDefaultFolderPreset();
	} else {
		console.log(`default folder: ${chalk.blue.bold(defaultFolder)}`);
	}
}

export function loadCommand(projectNames: string[], shellFlag?: string) {
	// check if project name has been passed
	if (projectNames.length === 0) warnNoProjectPassed();
	else {
		projectNames.forEach(async projectName => {
			// check if the passed project exist
			if (!isExistingProject(projectName)) {
				warnProjectNotFound(projectName);
			} else if (!existProjectFolder(projectName)) {
				errorProjectFolderNotExists(projectName);
			} else {
				feedbackLoadingProject(projectName);
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
					feedbackProjectLoadedSuccess(project.name);
				} catch (err) {
					console.error((err as ExecaError).originalMessage);
				}
			}
		});
	}
}

export async function purgeCommand() {
	const projects = getProjects();
	if (projects.length === 0) {
		feedbackNoProjectPresent();
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
	if (projectNames.length === 0) warnNoProjectPassed();
	else {
		projectNames.forEach(async projectName => {
			// check if the passed project exist
			if (!isExistingProject(projectName)) {
				warnProjectNotFound(projectName);
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
