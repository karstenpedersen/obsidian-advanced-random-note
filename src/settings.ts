import type { RandomNoteQuery } from "./types";

export interface Settings {
	openInNewLeaf: boolean;
	queries: Array<RandomNoteQuery>;
	disabledFolders: string;
	debug: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
	openInNewLeaf: false,
	queries: [],
	disabledFolders: "",
	debug: false,
};
