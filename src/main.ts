import { Notice, Plugin, TFile } from "obsidian";
import { RandomNoteModal } from "src/gui/modals/OpenRandomNoteModal/openRandomNoteModal";
import { Search } from "./search";
import { DEFAULT_SETTINGS, SettingTab, Settings } from "./settings";
import type { RandomNoteQuery } from "./types";
import {
	deleteObsidianCommand,
	getPluginCommandId,
	getRandomElement,
} from "./utilities";

export default class AdvancedRandomNote extends Plugin {
	settings!: Settings;

	async onload() {
		// Load plugin settings
		await this.loadSettings();

		// Add random note modal command
		this.addCommand({
			id: "open-query-modal",
			name: "Open query modal",
			callback: () => this.handleopenRandomFileModal(),
		});

		// Open generic random note
		this.addCommand({
			id: "open-random-note",
			name: "Open random note",
			callback: () => {
				this.openRandomMarkdownFile();
			},
		});

		// Open generic random note
		this.addCommand({
			id: "open-random-file",
			name: "Open random file",
			callback: () => {
				this.openRandomVaultFile();
			},
		});

		// Setup saved queries
		this.addQueryCommands();

		// Add settings tab
		this.addSettingTab(new SettingTab(this.app, this));

		if (this.settings.debug) {
			console.log("Loaded " + this.manifest.name);
		}
	}

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

	async openFile(file: TFile) {
		this.app.workspace.getLeaf().openFile(file);
	}

	async openRandomFile(files: TFile[]) {
		// Get random note from files
		const file = getRandomElement(files);

		if (this.settings.debug) {
			console.log("Found and opened file:");
			console.log(file);
		}

		// Open file
		await this.openFile(file);
	}

	async openRandomMarkdownFile() {
		await this.openRandomFile(this.app.vault.getMarkdownFiles());
	}

	async openRandomVaultFile() {
		await this.openRandomFile(this.app.vault.getFiles());
	}

	handleopenRandomFileModal() {
		const modal = new RandomNoteModal(
			this.app,
			this.settings.queries,
			async (query: RandomNoteQuery) => this.executeQuery(query)
		);
		modal.open();
	}

	async executeQuery(query: RandomNoteQuery) {
		const files = await new Search(this).search(query);

		if (files.length <= 0) {
			return;
		}

		await this.openRandomFile(files);
	}

	addQueryCommands() {
		this.settings.queries.forEach(
			(query) => query.createCommand && this.addQueryCommand(query)
		);
	}

	addQueryCommand(query: RandomNoteQuery) {
		this.addCommand({
			id: query.id,
			name: query.name,
			callback: async () => this.executeQuery(query),
		});
	}

	removeQueryCommand(query: RandomNoteQuery) {
		deleteObsidianCommand(
			this.app,
			getPluginCommandId(query.id, this.manifest)
		);
	}
}
