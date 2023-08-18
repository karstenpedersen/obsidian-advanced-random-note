import { App, Modal } from "obsidian";
import Component from "./OpenRandomNoteModal.svelte";
import { RandomNoteQuery } from "src/types";

export class RandomNoteModal extends Modal {
	view: Component;
	queries: RandomNoteQuery[];
	submitCallback: ((query: RandomNoteQuery) => Promise<void>) | undefined =
		undefined;

	constructor(
		app: App,
		queries: RandomNoteQuery[],
		submitCallback: (query: RandomNoteQuery) => Promise<void>
	) {
		super(app);
		this.queries = queries;
		this.view = new Component({
			target: this.contentEl,
			props: { queries, handleSubmit: this.handleSubmit },
		});
		this.submitCallback = submitCallback;
	}

	handleSubmit = (query: RandomNoteQuery): void => {
		if (this.submitCallback) {
			this.submitCallback(query);
		}
		this.close();
	};
}
