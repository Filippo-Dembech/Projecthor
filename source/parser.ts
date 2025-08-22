import {promises as fsp} from 'fs';
import {Project} from './types.js';

export async function parseProjectSetupFile(filePath: string): Promise<Project[]> {
	const content = await fsp.readFile(filePath, 'utf-8');
	const lines = content.split(/\r?\n/);

	const projects: Project[] = [];
	let currentProject: Project | null = null;
	let parsingCommands = false;

	for (let line of lines) {
		line = line.trim();
		if (!line) continue;

		if (line.startsWith('PROJECT:')) {
			if (currentProject) {
				if (
					!currentProject.name ||
					!currentProject.folder ||
					currentProject.setupCommands.length === 0
				) {
					throw new Error(
						'Project missing required fields: NAME, FOLDER, COMMANDS',
					);
				}
				projects.push(currentProject);
			}
			currentProject = {name: '', folder: '', setupCommands: []};
			parsingCommands = false;
		} else if (line.startsWith('NAME:')) {
			currentProject!.name = line.slice(5).trim();
		} else if (line.startsWith('FOLDER:')) {
			currentProject!.folder = line.slice(7).trim();
		} else if (line.startsWith('COMMANDS:')) {
			parsingCommands = true;
		} else if (parsingCommands) {
			currentProject!.setupCommands.push(line);
		} else {
			throw new Error(`Unexpected line outside commands: "${line}"`);
		}
	}

	if (currentProject) {
		if (
			!currentProject.name ||
			!currentProject.folder ||
			currentProject.setupCommands.length === 0
		) {
			throw new Error(
				'Project missing required fields: NAME, FOLDER, COMMANDS.',
			);
		}
		projects.push(currentProject);
	}

	return projects;
}

