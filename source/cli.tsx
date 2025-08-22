#!/usr/bin/env node
import meow from 'meow';
import {execa, ExecaError} from 'execa';
import chalk from 'chalk';
import {
	deleteProject,
	getDefaultFolder,
	getProjects,
} from './db.js';
import fs from 'fs';
import readline from 'readline';
import {helpMessage} from './help.js';
import { listCommand, saveCommand, setdfCommand } from './commands.js';

const projects = getProjects();

const cli = meow(helpMessage, {
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
});

function hasCommand(): boolean {
	return cli.input.length !== 0;
}

function hasProjectArgs(): boolean {
	const [_, ...args] = cli.input;
	return args.length !== 0;
}

function isExistingProject(projectName: string): boolean {
	return projects.some(project => project.name === projectName);
}

function existProjectFolder(projectName: string): boolean {
	return fs.existsSync(
		projects.find(project => project.name === projectName)!.folder,
	); // Using '!' because project must exist because of previous 'isExistingProject' check
}

function getProjectFolder(projectName: string): string {
	return projects.find(project => project.name === projectName)!.folder;
}

if (!hasCommand()) {
	cli.showHelp();
} else {
	const [command, ...args] = cli.input;

	if (command === 'save') {
		saveCommand(cli.flags.source);
	} else if (command === 'list') {
		listCommand(projects, cli.flags.full);
	} else if (command === 'setdf') {
		setdfCommand(args);
	} else if (command === 'getdf') {
		const defaultFolder = getDefaultFolder();
		if (!defaultFolder) {
			console.log('No default folder has been set yet.\n');
			console.log(
				"To set a default folder use 'projector setdf <default_folder_path>' command.",
			);
			console.log("For further help use 'projector --help, -h'.");
		} else {
			console.log('default folder:', getDefaultFolder());
		}
	} else if (command === 'load') {
		// check if project name has been passed
		if (!hasProjectArgs()) console.log('No project has been passed');
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
	} else if (command === 'purge') {
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
	} else if (command === 'delete') {
		if (!hasProjectArgs()) console.log('No project has been passed');
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
	} else {
		console.log(chalk.yellow(`command '${command}' does not exist.`));
		console.log(cli.showHelp());
	}
}
