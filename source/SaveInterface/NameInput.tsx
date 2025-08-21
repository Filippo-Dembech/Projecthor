import { Box, Text } from "ink";
import React from "react";
import RequiredInput from "../RequiredInput.js";
import { Task } from "ink-task-list";
import { useProject } from "../context/ProjectContext.js";

interface NameInputProps {
	onSubmit: () => void
}

export default function NameInput({ onSubmit }: NameInputProps) {
    
	const { project, setName } = useProject();
    
    return (
        
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
							placeholder="insert project name"
							errorMessage="Project name cannot be empty."
							onSubmit={name => {
                                setName(name)
								onSubmit();
							}}
						/>
					)}
				</Box>
    )
}