import { LowSync } from "lowdb";
import { Project } from "./types.js";
import { JSONFileSyncPreset } from "lowdb/node";

interface DBData {
	projects: Project[]
}

const defaultProjects: DBData = { projects: [] }

const db: LowSync<DBData> = JSONFileSyncPreset<DBData>("projects.json", defaultProjects);

export function saveProject(project: Project) {
	db.update(({projects}) => projects.push(project))
}

export function getProjects(): Project[] {
    return db.data.projects;
}

export default db;