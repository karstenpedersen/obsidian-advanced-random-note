import { App, PluginSettingTab, Setting } from "obsidian";
import AdvancedRandomNote from "./main";
import type { RandomNoteQuery } from "./types";
import QueryView from "src/gui/queryItem/QueryView.svelte";

export interface Settings {
	openInNewLeaf: boolean;
	queries: Array<RandomNoteQuery>;
	disabledFolders: string;
	debug: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
	openInNewLeaf: false,
	queries: [],
	disabledFolders: "",
	debug: false,
};

export class SettingTab extends PluginSettingTab {
	plugin: AdvancedRandomNote;

	constructor(app: App, plugin: AdvancedRandomNote) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.containerEl.empty();
		this.addSetting();
		this.addQueriesSetting();
		this.addDebugSetting();
	}

	addSetting() {
		// Open in new leaf setting
		new Setting(this.containerEl)
			.setName("Open in new leaf")
			.setDesc("Opens random notes in new tabs")
			.addToggle((text) =>
				text
					.setValue(this.plugin.settings.openInNewLeaf)
					.onChange(async (value) => {
						this.plugin.settings.openInNewLeaf = value;
						await this.plugin.saveSettings();
					})
			);

		// Disabled folders setting
		new Setting(this.containerEl)
			.setName("Disabled folders")
			.setDesc("Skips these folders when searching for files")
			.addTextArea((text) => {
				text.setPlaceholder("templates/")
					.setValue(this.plugin.settings.disabledFolders)
					.onChange((value) => {
						this.plugin.settings.disabledFolders = value;
						this.plugin.saveSettings();
					});
			});
	}

	addQueriesSetting() {
		// Title
		this.containerEl.createEl("div", {
			text: "Queries",
			cls: "setting-item setting-item-heading",
		});

		// Add query list
		const setting = new Setting(this.containerEl);
		setting.infoEl.remove();
		setting.settingEl.style.display = "block";
		new QueryView({
			target: setting.settingEl,
			props: {
				plugin: this.plugin,
				queries: this.plugin.settings.queries,
				saveQueries: (queries: RandomNoteQuery[]) => {
					this.plugin.settings.queries = queries;
					this.plugin.saveSettings();
				},
			},
		});
	}

	addDebugSetting() {
		// Title
		this.containerEl.createEl("div", {
			text: "Debug",
			cls: "setting-item setting-item-heading",
		});

		// Toggle debug mode setting
		new Setting(this.containerEl)
			.setName("Debug Mode")
			.setDesc("Toggle debug mode")
			.addToggle((text) =>
				text
					.setValue(this.plugin.settings.debug)
					.onChange(async (value) => {
						this.plugin.settings.debug = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
