import React, {useEffect, useState} from 'react';
import {Text} from 'ink';
import {execa} from 'execa';

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

interface AppProps {
	shell?: string;
	projectName?: string;
}

export default function App({projectName, shell}: AppProps) {
	const [executionResult, setExecutionResult] = useState("");
	const project = projects.find(project => project.name === projectName);

	useEffect(() => {
		async function execute() {
			if (project) {
				for (let command of project.setupCommands) {
					//console.log("executing: ", command);
					const {stdout} = shell
					? await execa({cwd: project.folder, shell})`${command}`
					: await execa({cwd: project.folder})`${command}`;
					setExecutionResult(curr => curr + stdout);
				}
			}
			else {
				setExecutionResult(`Project '${projectName}' not found`);
			}
		}

		execute();
	}, []);

	if (!executionResult) return <Text>Executing...</Text>;

	return <Text>{executionResult}</Text>;
}
