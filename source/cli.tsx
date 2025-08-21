#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';
import { listify } from './utils.js';
import SaveInterface from './SaveInterface.js';

const cli = meow(
	`
	Usage
	  $ projector

	Options
        --shell, -sh	The shell to use
        --name, -n    	The name of the new project
`,
	{
		importMeta: import.meta,
		flags: {
			shell: {
				type: 'string',
                alias: "sh",
			},
            name: {
                type: "string",
				alias: "n",
            }
		},
	},
);

function hasCommand(): boolean {
	return cli.input.length !== 0;
}

function hasArgs(): boolean {
	const [_, ...args] = cli.input;
	return args.length !== 0;
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
		if (!hasArgs()) console.log("No project has been passed")
		// check if the passed project exist
		// ...
		else {
			console.log(`Loading project(s): '${listify(args)}'`);
		}
	}

	else {
		render(<App projectName={cli.unnormalizedFlags.name} shell={cli.unnormalizedFlags.shell}/>);
	}
}

