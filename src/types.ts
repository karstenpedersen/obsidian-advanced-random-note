import { TFile } from "obsidian";

export const QUERY_TYPES = ["Default", "Dataview", "Regex"] as const;
export type QueryType = (typeof QUERY_TYPES)[number];

export const OPEN_TYPES = ["Active Leaf", "New Leaf", "New Window"] as const;
export type OpenType = (typeof OPEN_TYPES)[number];

export const QUERY_OPEN_TYPES = ["Default", "Active Leaf", "New Leaf", "New Window"] as const;
export type QueryOpenType = (typeof QUERY_OPEN_TYPES)[number];

export interface Query {
	id: string;
	name: string;
	query: string;
	type: QueryType;
	createCommand: boolean;
	useDisabledFolders: boolean;
	openType: QueryOpenType;
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
