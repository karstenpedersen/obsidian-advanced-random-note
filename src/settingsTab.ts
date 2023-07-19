import { App, ButtonComponent, PluginSettingTab, Setting } from "obsidian";
import AdvancedRandomNote from "./main";
import { createQuery, moveElementInArray } from "./utilities";

export class SettingTab extends PluginSettingTab {
	plugin: AdvancedRandomNote;

	constructor(app: App, plugin: AdvancedRandomNote) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

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

		new Setting(this.containerEl)
			.setName("Search queries")
			.setDesc("Add search queries")
			.addButton((button: ButtonComponent) => {
				button
					.setTooltip("Add additional query")
					.setButtonText("+")
					.setCta()
					.onClick(() => {
						const query = createQuery("Untitled", "");
						this.plugin.settings.queries.push(query);
						this.plugin.saveSettings();
						this.display();
					});
			});

		this.plugin.settings.queries.forEach((query, index) => {
			const s = new Setting(this.containerEl)
				.addText((text) => {
					text.setPlaceholder("Name")
						.setValue(query.name)
						.onChange(async (value) => {
							// Change query name
							this.plugin.settings.queries[index].name =
								value.trim();

							// Remove query
							this.plugin.addQueryCommand(
								this.plugin.settings.queries[index]
							);

							await this.plugin.saveSettings();
						});
					text.inputEl.addClass("arn-input");
				})
				.addText((text) => {
					text.setPlaceholder("Query")
						.setValue(query.query)
						.onChange(async (value) => {
							// Change query
							this.plugin.settings.queries[index].query =
								value.trim();
							await this.plugin.saveSettings();
						});
					text.inputEl.addClass("arn-input");
				})
				.addToggle((cb) => {
					cb.setTooltip("Create command")
						.setValue(
							this.plugin.settings.queries[index].createCommand
						)
						.onChange((value) => {
							// Update toggle value
							this.plugin.settings.queries[index].createCommand =
								value;

							// Toggle query command
							if (value) {
								this.plugin.addQueryCommand(
									this.plugin.settings.queries[index]
								);
							} else {
								this.plugin.removeQueryCommand(
									this.plugin.settings.queries[index]
								);
							}

							this.plugin.saveSettings();
						});
				})
				.addExtraButton((cb) => {
					cb.setIcon("up-chevron-glyph")
						.setTooltip("Move up")
						.onClick(() => {
							moveElementInArray(
								this.plugin.settings.queries,
								index,
								index - 1
							);
							this.plugin.saveSettings();
							this.display();
						});
				})
				.addExtraButton((cb) => {
					cb.setIcon("down-chevron-glyph")
						.setTooltip("Move down")
						.onClick(() => {
							moveElementInArray(
								this.plugin.settings.queries,
								index,
								index + 1
							);
							this.plugin.saveSettings();
							this.display();
						});
				})
				.addExtraButton((cb) => {
					cb.setIcon("cross")
						.setTooltip("Delete")
						.onClick(() => {
							// Remove query
							this.plugin.removeQueryCommand(
								this.plugin.settings.queries.splice(index, 1)[0]
							);
							this.plugin.saveSettings();
							this.display();
						});
				});

			s.infoEl.remove();
		});

		// Debug settings
		this.containerEl.createEl("div", {
			text: "Debug",
			cls: "setting-item setting-item-heading",
		});

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
