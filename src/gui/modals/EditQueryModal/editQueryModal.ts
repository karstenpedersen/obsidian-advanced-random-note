import { App, Modal } from "obsidian";
import Component from "./EditQueryModal.svelte";
import { RandomNoteQuery } from "src/types";

export class EditQueryModal extends Modal {
	view: Component;
	query: RandomNoteQuery;

	constructor(
		app: App,
		query: RandomNoteQuery,
		handleChange: (query: RandomNoteQuery) => void
	) {
		super(app);
		this.query = query;
		this.view = new Component({
			target: this.contentEl,
			props: {
				query,
				handleChange,
			},
		});
	}
}
