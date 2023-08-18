import { TFile } from "obsidian";

export const QUERY_TYPES = ["Default", "Dataview", "Regex"] as const;
export type QueryType = (typeof QUERY_TYPES)[number];

export interface Query {
	id: string;
	name: string;
	query: string;
	type: QueryType;
	createCommand: boolean;
	useDisabledFolders: boolean;
}

export interface ProcessedDefaultQuery {
	path: string;
	file: string;
	tags: SearchTag[];
}

export interface SearchTag {
	included: boolean;
	tag: string;
}

export type RandomNoteResult = TFile[];
