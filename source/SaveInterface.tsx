import React, {useEffect, useState} from 'react';
import {Box, Text, useApp, useFocusManager, useInput} from 'ink';
import RequiredInput from './RequiredInput.js';
import {Task} from 'ink-task-list';
import TextInput from 'ink-text-input';
import { JSONFileSyncPreset } from 'lowdb/node';


interface Project {
	name: string;
	folder: string;
	setupCommands: string[];
}

interface DBData {
	projects: Project[]
}

const defaultProjects: DBData = { projects: [] }

const db = JSONFileSyncPreset<DBData>("db.json", defaultProjects);

export default function SaveInterface() {
	const [project, setProject] = useState<Project>({
		name: '',
		folder: '',
		setupCommands: [],
	});

	const [currentInput, setCurrentInput] = useState('name');
    const [currentCommand, setCurrentCommand] = useState("");
	const {focus} = useFocusManager();
	const {exit} = useApp()

	useEffect(() => {
		focus(currentInput);
	}, [currentInput]);
	
	useInput(async (input, key) => {
		if (input === "s" && key.ctrl) {
			db.update(({projects}) => projects.push(project))
			exit();
		}
	})

	return (
		<Box flexDirection="column" paddingTop={1}>
			<Box
				borderTop={false}
				borderLeft={false}
				borderRight={false}
				borderStyle="single"
				justifyContent="center"
			>
				<Text bold backgroundColor="blue">
					SAVE PROJECT
				</Text>
			</Box>
			<Box flexDirection="column">
				<Box
					gap={1}
					paddingX={1}
					borderStyle="single"
					borderTop={false}
					borderRight={false}
					borderLeft={false}
				>
					{project.name ? (
						<>
							<Text bold>Name: </Text>
							<Text>{project.name}</Text>
							<Task state="success" label="" />
						</>
					) : (
						<RequiredInput
							label="Name"
							placeholder="project name"
							errorMessage="Project name cannot be empty."
							onSubmit={name => {
								setProject(project => ({...project, name}));
								setCurrentInput('folder');
							}}
						/>
					)}
				</Box>
				{(currentInput === 'folder' || currentInput === 'commands') && (
					<Box gap={1} paddingX={1}>
						{project.folder ? (
							<>
								<Text bold>Folder: </Text>
								<Text>{project.folder}</Text>
								<Task state="success" label="" />
							</>
						) : (
							<RequiredInput
								label="Folder"
								placeholder="project folder"
								errorMessage="Project folder path cannot be empty."
								onSubmit={folder => {
									setProject(project => ({...project, folder}));
									setCurrentInput('commands');
								}}
							/>
						)}
					</Box>
				)}
				{currentInput === 'commands' && (
					<Box flexDirection="column">
						<Text>Commands: <Text color="gray">(Ctrl + s to save project)</Text></Text>
						{project.setupCommands.map((command, i) => (
							<Text key={`${command}-${i}`}>
								Command {i + 1}: {command}
							</Text>
						))}
						<TextInput
                            value={currentCommand}
                            onChange={(command) => setCurrentCommand(command)}
							onSubmit={command => {
								setProject(project => ({
									...project,
									setupCommands: [...project.setupCommands, command],
								}));
                                setCurrentCommand("");
							}}
						/>
					</Box>
				)}
			</Box>
		</Box>
	);
}
