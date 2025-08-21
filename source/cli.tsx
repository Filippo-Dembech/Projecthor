#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import SaveInterface from './SaveInterface/SaveInterface.js';
import {execa, ExecaError} from 'execa';
import chalk from 'chalk';
import {getProjects, setDefaultFolder} from './db.js';
import {ProjectProvider} from './context/ProjectContext.js';
import fs from 'fs';

const projects = getProjects();

const cli = meow(
	`
	Usage
	  $ projector <command> <args[]> <options> 

	Commands
		save\t\t\tSave a project workspace
		load <project_name[]>\tLoad the workspace of the passed projects
		list\t\t\tList of all the available projects
		setdf\t\t\tSet a default folder where all project are stored
		
	Options
		--shell, -sh\tWhich shell to use to run project setup commands
		\t\t(use only with 'load' command);
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
		render(
			<ProjectProvider>
				<SaveInterface />
			</ProjectProvider>,
		);
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
				'No default folder passed. Please insert a default folder path.',
			);
		} else {
			const defaultFolderPath = args[0]!;
			if (!fs.existsSync(defaultFolderPath)) {
				console.log(`Path '${defaultFolderPath}' doesn't exist.`);
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
		console.log(chalk.yellow(`command '${command}' does not exist.`))
		console.log(cli.showHelp());
	}
}
