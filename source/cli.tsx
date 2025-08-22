#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import SaveInterface from './SaveInterface/SaveInterface.js';
import {execa, ExecaError} from 'execa';
import chalk from 'chalk';
import {getProjects, saveProject, setDefaultFolder} from './db.js';
import {ProjectProvider} from './context/ProjectContext.js';
import fs from 'fs';
import {parseProjectSetupFile} from './parser.js';
import {printWarning} from './utils.js';
import { isValidProject } from './validation.js';
import { error } from './errors/errors.js';

const projects = getProjects();

const cli = meow(
	`
	Usage
	  $ projector <command> <args[]> <options> 

	Commands
		save\t\t\t\tSave a project workspace
		\t --source <file_path>\tProject setup file (.psup file) to setup new projects quickly

		load <project_name[]>\t\tLoad the workspace of the passed projects
		\t--shell, -sh\t\tWhich shell to use to run project setup commands

		list\t\t\t\tList of all the available projects
		\t--full, -f\t\tShow full projects data with

		setdf\t\t\t\tSet a default folder where all project are stored
	
	Project Setup File
	
		Project setup files (.psup) are files with a specific syntax that can be used
		to save one or more projects without using 'projector' save interface. They require
		a specific format:

		PROJECT:
			NAME: <project_name>
			FOLDER: <project_folder_path>
			COMMANDS:
				<first_command>
				<second_command>
				...
				<nth_command>
		
		Multiple projects can be declared in a .psup file:

		PROJECT:
			NAME: ...
			FOLDER: ...
			COMMANDS:
				...

		PROJECT:
			NAME: ...
			FOLDER: ...
			COMMANDS:
				...

		PROJECT:
			NAME: ...
			FOLDER: ...
			COMMANDS:
				...
`,
	{
		importMeta: import.meta,
		flags: {
			shell: {
				type: 'string',
				alias: 's',
			},
			full: {
				type: 'boolean',
				alias: 'f',
			},
			source: {
				type: 'string',
			},
		},
	},
);

function hasCommand(): boolean {
	return cli.input.length !== 0;
}

function hasProjects(): boolean {
	const [_, ...args] = cli.input;
	return args.length !== 0;
}

function isExistingProject(projectName: string): boolean {
	return projects.some(project => project.name === projectName);
}

if (!hasCommand()) {
	cli.showHelp();
} else {
	const [command, ...args] = cli.input;

	if (command === 'save') {
		const projectSetupFile = cli.flags.source;
		if (projectSetupFile) {
			if (!fs.existsSync(projectSetupFile)) {
				printWarning(`Project setup file '${projectSetupFile}' doesn't exist.`);
			} else if (!projectSetupFile.endsWith('.psup')) {
				printWarning("Wrong extension. Project setup files must have '.psup' extension.");
			} else {
				try {
					const projects = await parseProjectSetupFile(projectSetupFile);
					for (let project of projects) {
						const { isValid, errorMessage } = isValidProject(project);
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
	} else if (command === 'list') {
		if (cli.flags.full) {
			console.log(projects);
		} else {
			for (let project of projects) {
				console.log(project.name);
			}
		}
	} else if (command === 'setdf') {
		if (args.length === 0) {
			console.log(
				chalk.yellow(
					'No default folder passed. Please insert a default folder path.',
				),
			);
		} else {
			const defaultFolderPath = args[0]!;
			if (!fs.existsSync(defaultFolderPath)) {
				console.log(
					chalk.yellow(
						`Path '${chalk.bold(defaultFolderPath)}' doesn't exist.`,
					),
				);
			} else {
				setDefaultFolder(defaultFolderPath);
			}
		}
	} else if (command === 'load') {
		// check if project name has been passed
		if (!hasProjects()) console.log('No project has been passed');
		else {
			for (let projectName of args) {
				// check if the passed project exist
				if (!isExistingProject(projectName))
					console.log(`Project '${chalk.blue.bold(projectName)}' not found!`);
				else {
					console.log(`loading project '${chalk.blue.bold(projectName)}'...`);
					const project = projects.find(
						project => project.name === projectName,
					)!; // using '!' because project must exist because of 'isExistingProject()' check before
					const shell = cli.flags.shell;
					try {
						for (let command of project.setupCommands) {
							const {stdout} = shell
								? await execa({cwd: project.folder, shell})`${command}`
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
	} else {
		console.log(chalk.yellow(`command '${command}' does not exist.`));
		console.log(cli.showHelp());
	}
}
