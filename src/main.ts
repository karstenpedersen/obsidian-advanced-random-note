import { Notice, Plugin, TFile } from "obsidian";
import { RandomNoteModal } from "./openRandomNoteModal";
import { Search } from "./search";
import { DEFAULT_SETTINGS, type Settings } from "./settings";
import { SettingTab } from "./settingsTab";
import type { RandomNoteQuery } from "./types";
import {
	deleteObsidianCommand,
	getPluginCommandId,
	getRandomElement,
} from "./utilities";

export default class AdvancedRandomNote extends Plugin {
	settings!: Settings;

	async onload() {
		await this.loadSettings();

		// Add random note modal command
		this.addCommand({
			id: "open-random-note-modal",
			name: "Open random note modal",
			callback: () => {
				const modal = new RandomNoteModal(
					this.app,
					this.settings.queries,
					async (query: RandomNoteQuery) =>
						this.searchAndOpenNote(query)
				);
				modal.open();
			},
		});

		this.addQueryCommands();

		// Add settings tab
		this.addSettingTab(new SettingTab(this.app, this));

		if (this.settings.debug) {
			console.log("Loaded " + this.manifest.name);
		}
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async openRandomNote(files: TFile[]) {
		// Get random note from files
		const file = getRandomElement(files);

		if (!file) {
			if (this.settings.debug)
				console.log("Could not find a file matching the defined query");
			return;
		}

		if (this.settings.debug) {
			console.log("Found and opened file:");
			console.log(file);
		}

		// Open file
		await this.openNote(file);
	}

	async openNote(file: TFile) {
		await this.app.workspace.openLinkText(
			file.basename,
			"",
			this.settings.openInNewLeaf,
			{
				active: true,
			}
		);
	}

	async searchAndOpenNote(query: RandomNoteQuery) {
		const files = new Search(this).search(query);

		if (files.length <= 0) {
			new Notice(
				"Advanced Random Note: Found zero notes matching your query."
			);
			return;
		}
		await this.openRandomNote(files);
	}

	addQueryCommands() {
		// Add query commands
		this.settings.queries.forEach((query) => this.addQueryCommand(query));
	}

	addQueryCommand(query: RandomNoteQuery) {
		if (!query.createCommand) return;

		this.addCommand({
			id: query.id,
			name: query.name,
			callback: async () => this.searchAndOpenNote(query),
		});
	}

	removeQueryCommand(query: RandomNoteQuery) {
		deleteObsidianCommand(
			this.app,
			getPluginCommandId(query.id, this.manifest)
		);
	}
}
