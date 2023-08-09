import { TFile } from "obsidian";
import { getAPI } from "obsidian-dataview"
import AdvancedRandomNote from "./main";
import type {
    ProcessedNormalQuery,
	ProcessedQuery,
	RandomNoteQuery,
	RandomNoteResult,
	SearchTag,
} from "./types";
import { getTagString, getTagStrings } from "./utilities";

export class Search {
	plugin: AdvancedRandomNote;

	constructor(plugin: AdvancedRandomNote) {
		this.plugin = plugin;
	}

	async search(query: RandomNoteQuery): Promise<RandomNoteResult> {
		// Find files that match query
		let result: TFile[] = []
		if (query.dataview) {
			const api = getAPI();
			await api?.query(query.query)
		} else {
			const files = this.plugin.app.vault.getMarkdownFiles();
			result = files.filter((file) => {
				return this.checkFileToMatchQuery(file, query);
			});
		}

		return result;
	}

	processNormalQuery(query: RandomNoteQuery): ProcessedNormalQuery {
		const regexResult = {
			path: /path:\s+(.*?)(tag:|file:|$)/.exec(query.query),
			file: /file:\s+(.*?)(tag:|path:|$)/.exec(query.query),
			tags: /tag:\s+(.*?)(file:|path:|$)/.exec(query.query),
		};

		const path = regexResult.path ? regexResult.path[1].trim() : "";
		const file = regexResult.file ? regexResult.file[1].trim() : "";
		const tags: SearchTag[] = (
			regexResult.tags ? regexResult.tags[1].split(" ") : []
		).map((tag) => {
			const trimmedTag = tag.trim();

			return {
				included: !trimmedTag.startsWith("!"),
				tag: getTagString(trimmedTag),
			};
		});

		const processedQuery: ProcessedQuery = {
			path,
			file,
			tags,
		};

		return processedQuery;
	}

	checkFileToMatchQuery(file: TFile, query: RandomNoteQuery) {
		// Process query
		const processedQuery = this.processNormalQuery(query);
		return (
			this.checkDisabledFolderPath(processedQuery.path, file) &&
			this.checkTagsWithFile(processedQuery.tags, file) &&
			this.checkFilenameWithFile(processedQuery.file, file) &&
			this.checkPathWithFile(processedQuery.path, file)
		);
	}

	checkTagsWithFile(tags: SearchTag[], file: TFile): boolean {
		const fileCache = this.plugin.app.metadataCache.getFileCache(file)
		
		// Get file tags
		const fileCacheTags = fileCache?.tags ?? [];
		const frontmatterTags = fileCache?.frontmatter?.tags ?? []
		const frontmatterTag = fileCache?.frontmatter?.tag
		
		let fileTags = fileCacheTags.map(fileTag => fileTag.tag)
		fileTags = fileTags.concat(getTagStrings(frontmatterTags))
		if (frontmatterTag) {
			fileTags.push(getTagString(frontmatterTag))
		}

		const includedTags = tags.filter((tag) => tag.included);
		const excludedTags = tags.filter((tag) => !tag.included);
		let includesTags = false;
		let excludesTags = false;
		
		// Check included tags
		includesTags =
			(includedTags &&
				fileTags &&
				includedTags.every((searchTag) => {
					return fileTags.some((fileTag) =>
						fileTag.includes(searchTag.tag)
					);
				})) ||
			!includedTags;

		// Check excluded tasks
		excludesTags =
			(excludedTags &&
				fileTags &&
				excludedTags.every((searchTag) => {
					return fileTags.every(
						(fileTag) => !fileTag.includes(searchTag.tag)
					);
				})) ||
			(excludedTags && !fileTags) ||
			!excludedTags;

		return includesTags && excludesTags;
	}

	checkFilenameWithFile(filename: string, file: TFile): boolean {
		return file.name.includes(filename);
	}

	checkPathWithFile(path: string, file: TFile): boolean {
		return (
			(path !== "/" && file.path.includes(path)) ||
			(path === "/" && !file.path.includes(path))
		);
	}

	checkDisabledFolderPath(queryPath: string, file: TFile): boolean {
		const filePath = file.path.replace(file.name, "");

		if (filePath === queryPath) return true;

		return this.plugin.settings.disabledFolders
			.split(/\r?\n/)
			.every((disabledFolder) => disabledFolder.trim() !== filePath);
	}
}
