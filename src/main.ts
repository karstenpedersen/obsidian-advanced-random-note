import { Plugin, TFile } from "obsidian";
import { RandomNoteModal } from "./randomNoteModal";
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

		// Add modal command
		this.addCommand({
			id: "open-random-note-modal",
			name: "Open random note modal",
			callback: () => {
				new RandomNoteModal(this.app, this.settings.queries).open();
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
		await this.app.workspace.openLinkText(
			file.basename,
			"",
			this.settings.openInNewLeaf,
			{
				active: true,
			}
		);
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
			callback: async () => {
				const files = new Search(this).search(query);
				await this.openRandomNote(files);
			},
		});
	}

	removeQueryCommand(query: RandomNoteQuery) {
		deleteObsidianCommand(
			this.app,
			getPluginCommandId(query.id, this.manifest)
		);
	}
}