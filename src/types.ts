import { TFile } from "obsidian";

export interface RandomNoteQuery {
	id: string;
	name: string;
	query: string;
	dataview: boolean;
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
