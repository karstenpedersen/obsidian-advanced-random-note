import { App, Modal } from "obsidian";
import TestComponent from "./components/OpenRandomNoteModal.svelte";
import { RandomNoteQuery } from "./types";

export class RandomNoteModal extends Modal {
	view: TestComponent;
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
		this.view = new TestComponent({
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
