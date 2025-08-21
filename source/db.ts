import { LowSync } from "lowdb";
import { Project } from "./types.js";
import { JSONFileSyncPreset } from "lowdb/node";

interface DBData {
	defaultFolder: string;
	projects: Project[]
}

const defaultProjects: DBData = { defaultFolder: "", projects: [] }

const db: LowSync<DBData> = JSONFileSyncPreset<DBData>("projects.json", defaultProjects);

export function saveProject(project: Project) {
	db.update(({projects}) => projects.push(project))
	db.write();
}

export function getProjects(): Project[] {
    return db.data.projects;
}

export function getDefaultFolder() {
	return db.data.defaultFolder;
}

export function setDefaultFolder(path: string) {
	db.data.defaultFolder = path;
	db.write();
}

export default db;