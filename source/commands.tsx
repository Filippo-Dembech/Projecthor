import React from "react";
import { ProjectProvider } from "./context/ProjectContext.js";
import SaveInterface from "./SaveInterface/SaveInterface.js";
import fs from 'fs';
import chalk from "chalk";
import { printWarning } from "./utils.js";
import { parseProjectSetupFile } from "./parser.js";
import { isValidProject } from "./validation.js";
import { error } from "./errors/errors.js";
import { saveProject } from "./db.js";
import { render } from "ink";

export async function saveCommand(projectSetupFile?: string) {
    if (projectSetupFile) {
        if (!fs.existsSync(projectSetupFile)) {
            printWarning(`Project setup file '${projectSetupFile}' doesn't exist.`);
        } else if (!projectSetupFile.endsWith('.psup')) {
            printWarning(
                "Wrong extension. Project setup files must have '.psup' extension.",
            );
        } else {
            try {
                const projects = await parseProjectSetupFile(projectSetupFile);
                for (let project of projects) {
                    const {isValid, errorMessage} = isValidProject(project);
                    if (!isValid) {
                        console.log(error(errorMessage));
                    } else {
                        saveProject(project);
                        console.log(
                            `${chalk.green('OK')}: Project '${chalk.green(
                                project.name,
                            )}' has been successfully saved!`,
                        );
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }
    } else {
        render(
            <ProjectProvider>
                <SaveInterface />
            </ProjectProvider>
        );
    }
}