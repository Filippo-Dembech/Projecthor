import React, {useEffect, useState} from 'react';
import {Box, useApp, useFocusManager, useInput} from 'ink';
import {getProjects, saveProject} from '../db.js';
import chalk from 'chalk';
import Title from './Title.js';
import NameInput from './NameInput.js';
import FolderInput from './FolderInput.js';
import CommandsInput from './CommandsInput.js';
import {useProject} from '../context/ProjectContext.js';

const error = chalk.red.bold;

export default function SaveInterface() {
	const {project} = useProject();

	const [currentInput, setCurrentInput] = useState('name');
	const {focus} = useFocusManager();
	const {exit} = useApp();
	const errorMessage = error(
		`Project '${project.name}' already exist. Can't create another project instance.`,
	);

	useEffect(() => {
		focus(currentInput);
	}, [currentInput]);

	useInput(async (input, key) => {
		if (input === 's' && key.ctrl) {
			if (getProjects().some(p => p.name === project.name)) {
				exit();
				console.log(errorMessage);
			} else {
				saveProject(project);
				exit();
			}
		}
	});

	return (
		<Box flexDirection="column" paddingTop={1}>
			<Box flexDirection="column">
				<Title>SAVE PROJECT</Title>
				<NameInput onSubmit={() => setCurrentInput('folder')} />
				{(currentInput === 'folder' || currentInput === 'commands') && (
					<FolderInput
						onSubmit={() => {
							setCurrentInput('commands');
						}}
					/>
				)}
				{currentInput === 'commands' && <CommandsInput />}
			</Box>
		</Box>
	);
}
