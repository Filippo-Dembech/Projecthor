import {LowSync} from 'lowdb';
import {Project} from './types.js';
import {JSONFileSyncPreset} from 'lowdb/node';
import os from 'os';
import fs from 'fs';
import {join} from 'path';

function getDBDir() {
	const dir = join(os.homedir(), '.projecthor');
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, {recursive: true});
	}
	return join(dir, 'projects.json');
}

interface DBData {
	defaultFolder: string;
	projects: Project[];
}

const defaultProjects: DBData = {defaultFolder: '', projects: []};

const dbDir = getDBDir();
const db: LowSync<DBData> = JSONFileSyncPreset<DBData>(dbDir, defaultProjects);

export function saveProject(project: Project) {
	db.update(({projects}) => projects.push(project));
	db.write();
}

export function getProjects(): Project[] {
	return db.data.projects;
}

export function isExistingProject(projectName: string): boolean {
	return getProjects().some(project => project.name === projectName);
}

export function existProjectFolder(projectName: string): boolean {
	return fs.existsSync(
		getProjects().find(project => project.name === projectName)!.folder,
	); // Using '!' because project must exist because of previous 'isExistingProject' check
}

export function getProjectFolder(projectName: string): string {
	return getProjects().find(project => project.name === projectName)!.folder;
}

export function getDefaultFolder() {
	return db.data.defaultFolder;
}

export function alreadyExist(project: Project): boolean {
	return getProjects().some(p => p.name === project.name);
}

export function setDefaultFolder(path: string) {
	db.data.defaultFolder = path;
	db.write();
}

export function deleteProject(targetProject: Project) {
	db.data.projects = db.data.projects.filter(
		project => project.name !== targetProject.name,
	);
	db.write();
}

export default db;
