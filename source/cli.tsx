#!/usr/bin/env node
import meow from 'meow';
import chalk from 'chalk';
import {
	deleteProject,
	getProjects,
	isExistingProject,
} from './db.js';
import readline from 'readline';
import {helpMessage} from './help.js';
import { getdfCommand, listCommand, loadCommand, purgeCommand, saveCommand, setdfCommand } from './commands.js';

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
		getdfCommand();
	} else if (command === 'load') {
		loadCommand(args, cli.flags.shell);
	} else if (command === 'purge') {
		purgeCommand()
		// if (projects.length === 0) {
		// 	console.log('No Project is present.\n');
		// 	console.log("Use 'projector save' to save new projects.");
		// 	console.log(
		// 		"You can also use '.psup' files with the '--source' option to save multiple projects faster.",
		// 	);
		// 	console.log("Type 'projector --help, -h' for help.");
		// } else {
		// 	const answer: string = await new Promise(resolve => {
		// 		const prompt = readline.createInterface({
		// 			input: process.stdin,
		// 			output: process.stdout,
		// 		});
		// 		prompt.question(`Are you sure you wanna purge the db? (y/n) `, ans => {
		// 			prompt.close();
		// 			resolve(ans);
		// 		});
		// 	});

		// 	if (answer.toLowerCase() === 'y') {
		// 		for (let project of projects) {
		// 			if (!fs.existsSync(project.folder)) {
		// 				deleteProject(project);
		// 			}
		// 		}
		// 	}
		// }
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
