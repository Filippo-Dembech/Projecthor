import { Project } from "./types.js";
import fs from 'fs';

export interface ProjectValidation {
    isValid: boolean;
    errorMessage?: string
}

export function isValidProject(project: Project): ProjectValidation {
    if (!fs.existsSync(project.folder)) return {
        isValid: false,
        errorMessage: `Project folder '${project.folder}' doesn't exist.`
    }
    
    // todo: validate commands

    return { isValid: true }
}