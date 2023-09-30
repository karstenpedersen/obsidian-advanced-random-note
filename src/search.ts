import { Notice, TAbstractFile, TFile } from "obsidian";
import { getAPI } from "obsidian-dataview";
import AdvancedRandomNote from "./main";
import type {
	ProcessedDefaultQuery,
	Query,
	RandomNoteResult,
	SearchTag,
} from "./types";
import { getTagString, getTagStrings } from "./utilities";

export class Search {
	plugin: AdvancedRandomNote;

	constructor(plugin: AdvancedRandomNote) {
		this.plugin = plugin;
	}

	async search(query: Query): Promise<RandomNoteResult> {
		// Find files that match query
		let result: TFile[] = [];
		if (query.type === "Dataview") {
			const api = getAPI();
			console.log("Dataview");
			if (!api) {
				new Notice(
					"Advanced Random Note: Dataview API could not be found, is Dataview installed?"
				);
				return [];
			}

			const dataviewResult = await api?.query(query.query);

			if (!dataviewResult || !dataviewResult?.successful) {
				new Notice(
					"Advanced Random Note: Error running dataview query"
				);
				return [];
			}

			if (dataviewResult.value.type !== "list") {
				new Notice(
					"Advanced Random Note: Dataview query is not a list"
				);
				return [];
			}

			result = dataviewResult.value.values
				.map((value) =>
					this.plugin.app.vault.getAbstractFileByPath(value.path)
				)
				.filter((file) => file !== null && file instanceof TFile)
				.map((file) => file as TFile);
		} else {
			const files = this.plugin.app.vault.getFiles();

			if (query.type === "Regex") {
				const regex = new RegExp(query.query);
				result = files.filter((file) => regex.test(file.path));
			} else {
				result = files.filter((file) =>
					this.checkFileToMatchQuery(file, query)
				);
			}
		}

		// Filter disabled folder
		if (query.useDisabledFolders) {
			result = result.filter((file) => !this.isInDisabledFolder(file));

			if (result.length <= 0) {
				new Notice(
					"Advanced Random Note: Found zero notes matching your query."
				);
			}
		}

		return result;
	}

	processQuery(query: Query): ProcessedDefaultQuery {
		const regexResult = {
			path: /path:(.*?)(tag:|file:|$)/.exec(query.query),
			file: /file:(.*?)(tag:|path:|$)/.exec(query.query),
			tags: /tag:(.*?)(file:|path:|$)/.exec(query.query),
		};

		const path = regexResult.path ? regexResult.path[1].trim() : "";
		const file = regexResult.file ? regexResult.file[1].trim() : "";
		const tags: SearchTag[] = (
			regexResult.tags ? regexResult.tags[1].trim().split(" ") : []
		).map((tag) => {
			const trimmedTag = tag.trim();

			return {
				included: !trimmedTag.startsWith("!"),
				tag: getTagString(trimmedTag),
			};
		});

		const processedQuery: ProcessedDefaultQuery = {
			path,
			file,
			tags,
		};

		return processedQuery;
	}

	checkFileToMatchQuery(file: TFile, query: Query) {
		// Process query
		const processedQuery = this.processQuery(query);
		return (
			this.checkTagsWithFile(processedQuery.tags, file) &&
			this.checkFilenameWithFile(processedQuery.file, file) &&
			this.checkPathWithFile(processedQuery.path, file)
		);
	}

	checkTagsWithFile(tags: SearchTag[], file: TFile): boolean {
		if (tags.length <= 0) {
			return true;
		} else if (file.extension !== "md") {
			return false;
		}

		const fileCache = this.plugin.app.metadataCache.getFileCache(file);

		// Get file tags
		const fileCacheTags = fileCache?.tags ?? [];
		let frontmatterTags = fileCache?.frontmatter?.tags ?? [];
		const frontmatterTag = fileCache?.frontmatter?.tag;

		if (frontmatterTags[0] === null) frontmatterTags = [];

		// Combine tags
		let fileTags = fileCacheTags.map((tagCache) => tagCache.tag);
		fileTags = fileTags.concat(getTagStrings(frontmatterTags));
		if (frontmatterTag) {
			fileTags.push(getTagString(frontmatterTag));
		}

		if (fileTags.length <= 0 && tags.length > 0) return false;

		// Get excluded and included tags
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

	isInDisabledFolder(file: TAbstractFile): boolean {
		if (this.plugin.settings.disabledFolders === "") return false;

		return this.plugin.settings.disabledFolders
			.split(/\r?\n/)
			.some((disabledFolder) => {
				const trimmedFolder = disabledFolder.trim();
				return trimmedFolder && file.path.startsWith(trimmedFolder);
			});
	}
}
