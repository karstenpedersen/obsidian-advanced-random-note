import { App, type PluginManifest } from "obsidian";
import { v4 as uuidv4 } from "uuid";
import AdvancedRandomNote from "./main";
import type { RandomNoteQuery } from "./types";

export function moveElementInArray<T>(
	arr: T[],
	fromIndex: number,
	toIndex: number
): void {
	if (toIndex < 0 || toIndex === arr.length) {
		return;
	}
	const element = arr[fromIndex];
	arr[fromIndex] = arr[toIndex];
	arr[toIndex] = element;
}

export function getRandomElement<T>(arr: T[]): T {
	const index = Math.floor(Math.random() * arr.length);
	return arr[index];
}

export function addOrRemoveQueryCommand(plugin: AdvancedRandomNote, query: RandomNoteQuery) {
	if (query.createCommand) {
		plugin.addQueryCommand(query);
	} else {
		plugin.removeQueryCommand(query);
	}
}

export function findObsidianCommand(app: App, commandId: string) {
	// @ts-ignore
	return app.commands.findCommand(commandId);
}

export function deleteObsidianCommand(app: App, commandId: string) {
	if (findObsidianCommand(app, commandId)) {
		// @ts-ignore
		delete app.commands.commands[commandId];
		// @ts-ignore
		delete app.commands.editorCommands[commandId];
	}
}

export function getPluginCommandId(
	commandId: string,
	manifest: PluginManifest
): string {
	return manifest.id + ":" + commandId;
}

export function getTagString(tag: string): string {
	if (tag.startsWith("!#")) {
		return tag.replace("!", "");
	} else if (tag.startsWith("!")) {
		return tag.replace("!", "#");
	} else if (tag.startsWith("#")) {
		return tag;
	} else {
		return "#" + tag;
	}
}

export function getTagStrings(tags: string[]): string[] {
	return tags.map(tag => getTagString(tag))
}

export function getQueryCommandId() {
	return "query:" + uuidv4();
}

export function createQuery(name: string, query: string): RandomNoteQuery {
	return {
		id: getQueryCommandId(),
		name,
		query,
		dataview: false,
		createCommand: false,
	};
}
