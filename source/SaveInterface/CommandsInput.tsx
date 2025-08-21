import {Box, Text} from 'ink';
import React, {useState} from 'react';
import {useProject} from '../context/ProjectContext.js';
import TextInput from 'ink-text-input';

export default function CommandsInput() {
	const [currentCommand, setCurrentCommand] = useState('');

	const {project, addCommand} = useProject();

	return (
		<Box flexDirection="column" paddingX={1}>
			<Text>Commands: </Text>
			<Box marginTop={1} flexDirection="column">
				{project.setupCommands.map((command, i) => (
					<Text key={`${command}-${i}`}>
						Command {i + 1} <Text color="blue">{command}</Text>
					</Text>
				))}
				<Box>
					<Text>Command {project.setupCommands.length + 1}: </Text>
					<TextInput
						value={currentCommand}
						onChange={command => setCurrentCommand(command)}
						onSubmit={command => {
							addCommand(command);
							setCurrentCommand('');
						}}
					/>
				</Box>
			</Box>
			<Text color="gray">('Ctrl + s' to save project)</Text>
		</Box>
	);
}
