import { ButtonComponent, Plugin, TFile, TFolder } from "obsidian";
import { RandomNoteModal } from "src/gui/modals/OpenRandomNoteModal/openRandomNoteModal";
import { Search } from "./search";
import { DEFAULT_SETTINGS, SettingTab, Settings } from "./settings";
import type { Query, QueryOpenType } from "./types";
import {
	deleteObsidianCommand,
	flattenFile,
	getPluginCommandId,
	getRandomElement,
} from "./utilities";

export default class AdvancedRandomNote extends Plugin {
	settings!: Settings;
	ribbonButton!: HTMLElement;

	async onload() {
		// Load plugin settings
		await this.loadSettings();

		// Add random note modal command
		this.addCommand({
			id: "open-query-modal",
			name: "Open query modal",
			callback: () => this.openQueryModal(),
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

		this.ribbonButton = this.addRibbonIcon("dice", this.settings.ribbonActionType, () => {
			switch (this.settings.ribbonActionType) {
				case "Open query modal":
					this.openQueryModal();
					break;
				case "Open random note":
					this.openRandomMarkdownFile();
					break;
				case "Open random file":
					this.openRandomVaultFile();
					break;
			}
		});

		// File menu
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				if (!(file instanceof TFolder) || file.isRoot()) return;

				menu.addItem((item) => {
					item.setTitle("Open random note")
						.setIcon("dice")
						.onClick(async () => {
							const files = flattenFile(file);
							const foundFiles = await new Search(
								this
							).searchFiles(files, file.path + "/");
							this.openRandomFile(foundFiles);
						});
				});
			})
		);

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

	async openFile(file: TFile, openType: QueryOpenType = "Default") {
		if (openType === "Default") openType = this.settings.openType;
		switch (openType) {
			case "New Window":
				await this.app.workspace
					.getLeaf("window")
					.openFile(file, { active: this.settings.setActive });
				return;
			case "New Leaf":
				await this.app.workspace
					.getLeaf("tab")
					.openFile(file, { active: this.settings.setActive });
				return;
			default:
				await this.app.workspace.openLinkText(file.path, "", false, {
					active: this.settings.setActive,
				});
				break;
		}
	}

	async openRandomFile(files: TFile[], openType: QueryOpenType = "Default") {
		// Get random note from files`
		const file = getRandomElement(files);

		if (!file) return;

		if (this.settings.debug) {
			console.log("Found and opened file:");
			console.log(file);
		}

		// Open file
		await this.openFile(file, openType);
	}

	async openRandomMarkdownFile() {
		const foundFiles = await new Search(this).searchFiles(
			this.app.vault.getMarkdownFiles()
		);
		await this.openRandomFile(foundFiles);
	}

	async openRandomVaultFile() {
		const foundFiles = await new Search(this).searchFiles(
			this.app.vault.getFiles()
		);
		await this.openRandomFile(foundFiles);
	}

	openQueryModal() {
		const modal = new RandomNoteModal(
			this.app,
			this.settings.queries,
			async (query: Query) => this.executeQuery(query)
		);
		modal.open();
	}

	async executeQuery(query: Query) {
		const files = await new Search(this).search(query);

		if (files.length <= 0) {
			return;
		}

		await this.openRandomFile(files, query.openType);
	}

	addQueryCommands() {
		this.settings.queries.forEach(
			(query) => query.createCommand && this.addQueryCommand(query)
		);
	}

	addQueryCommand(query: Query) {
		this.addCommand({
			id: query.id,
			name: query.name,
			callback: async () => this.executeQuery(query),
		});
	}

	removeQueryCommand(query: Query) {
		deleteObsidianCommand(
			this.app,
			getPluginCommandId(query.id, this.manifest)
		);
	}

	updateRibbonButtonTooltip(name: string) {
		// TODO: find proper way to update tooltip
		new ButtonComponent(this.ribbonButton).setTooltip(name);
	}
}
