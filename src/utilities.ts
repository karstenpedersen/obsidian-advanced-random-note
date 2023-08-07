import { App, moment, type PluginManifest } from "obsidian";
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

export function getDateId() {
	return moment(new Date()).format("YYYYMMDDHHmmss");
}

export function getQueryCommandId() {
	return "query:" + getDateId();
}

export function createQuery(name: string, query: string): RandomNoteQuery {
	return {
		id: getQueryCommandId(),
		name,
		query,
		createCommand: false,
	};
}
