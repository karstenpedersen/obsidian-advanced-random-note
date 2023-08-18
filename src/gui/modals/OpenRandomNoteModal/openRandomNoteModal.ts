import { App, Modal } from "obsidian";
import Component from "./OpenRandomNoteModal.svelte";
import { Query } from "src/types";

export class RandomNoteModal extends Modal {
	view: Component;
	queries: Query[];
	submitCallback: ((query: Query) => Promise<void>) | undefined = undefined;

	constructor(
		app: App,
		queries: Query[],
		submitCallback: (query: Query) => Promise<void>
	) {
		super(app);
		this.queries = queries;
		this.view = new Component({
			target: this.contentEl,
			props: { queries, handleSubmit: this.handleSubmit },
		});
		this.submitCallback = submitCallback;
	}

	handleSubmit = (query: Query): void => {
		if (this.submitCallback) {
			this.submitCallback(query);
		}
		this.close();
	};
}
