import React from 'react';
import {Project} from './types.js';
import {Box, Text} from 'ink';
import fs from 'fs';

interface ProjectsProps {
	projects: Project[];
}

export default function Projects({projects}: ProjectsProps) {
	if (projects.length === 0)
		return (
			<Text>
				No Project is present. Use 'projector save' to save new projects. You
				can also use '.psup' files with the '--source' option to save multiple
				projects faster. Type 'projector --help, -h' for help.
			</Text>
		);

	return (
		<Box marginY={1} flexDirection="column" gap={1}>
			<Text>
				<Text color="green">#</Text> folder exists {'   '}
				<Text color="grey">#</Text> folder doesn't exist
			</Text>
			<Box flexDirection="column">
				{projects.map((project, i) => (
					<Box key={`${project.name}-${i}`}>
						<Text>{project.name} </Text>
						{fs.existsSync(project.folder) ? (
							<Text color="green">{`(DIR: ${project.folder})`}</Text>
						) : (
							<Text color="grey">{`(DIR: ${project.folder})`}</Text>
						)}
					</Box>
				))}
			</Box>
		</Box>
	);
}
