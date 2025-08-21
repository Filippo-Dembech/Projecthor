#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';
import SaveInterface from './SaveInterface.js';
import { execa } from 'execa';

const projects = [
	{
		name: "super-project",
		folder: 'C:\\Users\\Filippo Dembech\\CS\\Projects\\super-project\\',
		setupCommands: [
			'node main.js',
		]
	},
	{
		name: "freeuron",
		folder: 'C:\\Users\\Filippo Dembech\\CS\\Projects\\freeuron\\',
		setupCommands: [
			'code .',
			'wt.exe -d .'
		]
	}
]

const cli = meow(
	`
	Usage
	  $ projector

	Commands
		save\t\t\tsave a project workspace
		load <project_name[]>\tload the workspace of the passed projects
		
	Options
		--shell, -sh\tWhich shell to use to run project setup commands
`,
	{
		importMeta: import.meta,
		flags: {
			shell: {
				type: 'string',
                alias: "s",
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
	
	if (command === "save") {
		console.log("saving project workspace...")
		render(<SaveInterface />)
	}

	else if (command === "load") {
		// check if project name has been passed
		if (!hasProjects()) console.log("No project has been passed")
		else {
			for (let projectName of args) {
				// check if the passed project exist
				if (!isExistingProject(projectName)) console.log(`Project '${projectName}' not found!`)
				else {
					console.log(`loading project '${projectName}'...`)
					const project = projects.find(project => project.name === projectName)!;	// using '!' because project must exist because of 'isExistingProject()' check before
					const shell = cli.flags.shell;
					for (let command of project.setupCommands) {
						const {stdout} = shell
						? await execa({cwd: project.folder, shell})`${command}`
						: await execa({cwd: project.folder})`${command}`;
						console.log(stdout);
					}
					console.log(`'${project.name}' workspace successfully loaded!`);
				}
			}
		}
	}

	else {
		render(<App />);
	}
}

