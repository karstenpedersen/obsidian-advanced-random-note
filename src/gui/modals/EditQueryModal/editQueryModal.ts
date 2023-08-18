import { App, Modal } from "obsidian";
import Component from "./EditQueryModal.svelte";
import { Query } from "src/types";

export class EditQueryModal extends Modal {
	view: Component;
	query: Query;

	constructor(app: App, query: Query, handleChange: (query: Query) => void) {
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
