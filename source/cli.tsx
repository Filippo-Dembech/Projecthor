#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
	Usage
	  $ projector

	Options
        --shell | -sh   The shell to use
        --name  | -n    The name of the new project
`,
	{
		importMeta: import.meta,
		flags: {
			shell: {
				type: 'string',
                shortFlag: "sh",
			},
            name: {
                type: "string",
                shortFlag: "n",
            }
		},
	},
);

render(<App projectName={cli.flags.name} shell={cli.flags.shell}/>);
