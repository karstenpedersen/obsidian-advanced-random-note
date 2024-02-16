import { App, PluginSettingTab, Setting } from "obsidian";
import QueryView from "src/gui/queryItem/QueryView.svelte";
import AdvancedRandomNote from "./main";
import { RibbonActionType, type OpenType, type Query } from "./types";
import { getOpenTypeLabels, getRibbonActionTypeLabels, toRecord } from "./utilities";

export interface Settings {
	queries: Array<Query>;
	disabledFolders: string;
	debug: boolean;
	openType: OpenType;
	ribbonActionType: RibbonActionType;
	setActive: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
	queries: [],
	disabledFolders: "",
	debug: false,
	openType: "Active Leaf",
	ribbonActionType: "Open query modal",
	setActive: true,
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
	}

	addSetting() {
		// Make files active
		new Setting(this.containerEl)
			.setName("Open files as active")
			.setDesc("Make files active when they are opened.")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.setActive)
					.onChange(async (value) => {
						this.plugin.settings.setActive = value;
						await this.plugin.saveSettings();
					});
			});

		// Open type
		new Setting(this.containerEl)
			.setName("Open in")
			.setDesc("Where to open files.")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(toRecord(getOpenTypeLabels()))
					.setValue(this.plugin.settings.openType)
					.onChange(async (value) => {
						this.plugin.settings.openType = value as OpenType;
						await this.plugin.saveSettings();
					})
			);

		// Disabled folders setting
		new Setting(this.containerEl)
			.setName("Disabled folders")
			.setDesc("Skips these folders when searching for files.")
			.addTextArea((text) => {
				text.setPlaceholder("templates/")
					.setValue(this.plugin.settings.disabledFolders)
					.onChange(async (value) => {
						this.plugin.settings.disabledFolders = value.trim();
						await this.plugin.saveSettings();
					});
			});

		// Ribbon action type
		new Setting(this.containerEl)
		.setName("Ribbon action type")
		.setDesc("Which action to perform after tapping ribbon button.")
		.addDropdown((dropdown) =>
			dropdown
				.addOptions(toRecord(getRibbonActionTypeLabels()))
				.setValue(this.plugin.settings.ribbonActionType)
				.onChange(async (value) => {
					this.plugin.settings.ribbonActionType = value as RibbonActionType;
					await this.plugin.saveSettings();
				})
		);
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
				saveQueries: async (queries: Query[]) => {
					this.plugin.settings.queries = queries;
					await this.plugin.saveSettings();
				},
			},
		});
	}
}
