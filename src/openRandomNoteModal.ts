import { App, Modal } from "obsidian";
import TestComponent from "./OpenRandomNoteModal.svelte";
import { RandomNoteQuery } from "./types";

export class RandomNoteModal extends Modal {
	view: TestComponent;
	queries: RandomNoteQuery[];
	submitCallback: ((query: RandomNoteQuery) => Promise<void>) | undefined =
		undefined;

	constructor(app: App, queries: RandomNoteQuery[]) {
		super(app);
		this.queries = queries;
		this.view = new TestComponent({
			target: this.contentEl,
			props: { queries, handleSubmit: this.handleSubmit },
		});
	}

	handleSubmit = (query: RandomNoteQuery): void => {
		if (this.submitCallback) {
			this.submitCallback(query);
		}
		this.close();
	};
}
