import React, { useContext } from "react";
import { createContext, ReactNode, useState } from "react";
import { Project } from "../types.js";

interface ProjectContextData {
    project: Project,
    setName: (name: string) => void;
    setFolder: (folder: string) => void;
    addCommand: (command: string) => void;
}

const ProjectContext = createContext<ProjectContextData | undefined>(undefined);

function ProjectProvider({ children }: { children: ReactNode}) {
    
    const [project, setProject] = useState<Project>({
        name: "",
        folder: "",
        setupCommands: []
    })
    
    function setName(name: string) {
        setProject(project => ({ ...project, name }))
    }

    function setFolder(folder: string) {
        setProject(project => ({ ...project, folder }))
    }

    function addCommand(command: string) {
        setProject(project => ({ ...project, setupCommands: [ ...project.setupCommands, command] }))
    }

    return (
        <ProjectContext.Provider value={{project, setName, setFolder, addCommand}}>
            {children}
        </ProjectContext.Provider>
    )
}

function useProject() {
    const result = useContext(ProjectContext);
    if (!result) throw new Error("'useProject' can't be used outside 'ProjectProvider'.")
    return result;
}

export { ProjectProvider, useProject }