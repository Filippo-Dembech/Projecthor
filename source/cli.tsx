#!/usr/bin/env node
import meow from 'meow';
import chalk from 'chalk';
import {getProjects} from './db.js';
import {helpMessage} from './help.js';
import {
	deleteCommand,
	getdfCommand,
	listCommand,
	loadCommand,
	purgeCommand,
	saveCommand,
	setdfCommand,
} from './commands.js';

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

const hasCommand = cli.input.length !== 0;

if (!hasCommand) {
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
		purgeCommand();
	} else if (command === 'delete') {
		deleteCommand(args);
	} else {
		console.log(chalk.yellow(`command '${command}' does not exist.`));
		console.log(cli.showHelp());
	}
}
