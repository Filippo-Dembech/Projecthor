import { Box, Text } from "ink";
import React from "react";
import RequiredInput from "../RequiredInput.js";
import { Task } from "ink-task-list";
import { useProject } from "../context/ProjectContext.js";
import fs from 'fs';
import { getDefaultFolder } from "../db.js";

interface FolderInputProps {
	onSubmit: () => void
}

export default function FolderInput({ onSubmit }: FolderInputProps) {
    
	const { project, setFolder } = useProject();
	
	const defaultFolder = getDefaultFolder()
    
    return (
        
				<Box
					gap={1}
					paddingX={1}
					borderStyle="single"
					borderTop={false}
					borderRight={false}
					borderLeft={false}
				>
					{project.folder ? (
						<>
							<Text bold>Folder: </Text>
							<Text>{project.folder}</Text>
							<Task state="success" label="" />
						</>
					) : (
						<RequiredInput
							label="Folder"
							value={defaultFolder || ""}
							placeholder="insert project folder path"
							errorMessage="Project path cannot be empty."
							onSubmit={(folder, setError) => {
                                if (!fs.existsSync(folder)) {
                                    setError("This folder doesn't exist");
                                    return;
                                }
                                setFolder(folder)
								onSubmit();
							}}
						/>
					)}
				</Box>
    )
}