import React, {useEffect, useState} from 'react';
import {Box, useApp, useFocusManager, useInput} from 'ink';
import {alreadyExist, saveProject} from '../db.js';
import Title from './Title.js';
import NameInput from './NameInput.js';
import FolderInput from './FolderInput.js';
import CommandsInput from './CommandsInput.js';
import {useProject} from '../context/ProjectContext.js';
import { error } from '../feedback/errors.js';

export default function SaveInterface() {
	const {project} = useProject();

	const [currentInput, setCurrentInput] = useState('name');
	const {focus} = useFocusManager();
	const {exit} = useApp();

	useEffect(() => {
		focus(currentInput);
	}, [currentInput]);

	useInput(async (input, key) => {
		if (input === 's' && key.ctrl) {
			const isProjectSet = project.name && project.folder && project.setupCommands.length > 0;
			if (!isProjectSet) return;
			if (alreadyExist(project)) {
				exit();
				error.alreadyExistingProject(project.name);
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
