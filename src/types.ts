import { TFile } from "obsidian";

export const QUERY_TYPES = ["Default", "Dataview", "Regex"] as const;
export type QueryType = (typeof QUERY_TYPES)[number];

export interface RandomNoteQuery {
	id: string;
	name: string;
	query: string;
	type: QueryType;
	createCommand: boolean;
}

export interface ProcessedNormalQuery {
	path: string;
	file: string;
	tags: SearchTag[];
}

export interface ProcessedDataviewQuery {
	query: string;
}

export type ProcessedQuery = ProcessedNormalQuery | ProcessedDataviewQuery;

export interface SearchTag {
	included: boolean;
	tag: string;
}

export type RandomNoteResult = TFile[];
