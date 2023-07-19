import { TFile } from "obsidian";

export interface RandomNoteQuery {
	id: string;
	name: string;
	query: string;
	createCommand: boolean;
}

export interface ProcessedQuery {
	path: string;
	file: string;
	tags: SearchTag[];
}

export interface SearchTag {
	included: boolean;
	tag: string;
}

export type RandomNoteResult = TFile[];
