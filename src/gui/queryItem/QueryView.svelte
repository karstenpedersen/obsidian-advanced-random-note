<script lang="ts">
	import { Query } from "src/types";
	import QueryList from "./QueryList.svelte";
	import {
		createQuery,
		getQueryCommandId,
		addOrRemoveQueryCommand,
	} from "src/utilities";
	import { EditQueryModal } from "src/gui/modals/EditQueryModal/editQueryModal";
	import AdvancedRandomNote from "src/main";

	export let plugin: AdvancedRandomNote;
	export let queries: Query[];
	export let saveQueries: (queries: Query[]) => void;
	let queryFormName = "";

	const deleteQuery = (e: any) => {
		const query: Query = e.detail.query;
		queries = queries.filter((q) => q.id !== query.id);
		plugin.removeQueryCommand(query);
		saveQueries(queries);
	};

	const editQuery = (e: any) => {
		const query: Query = e.detail.query;

		const modal = new EditQueryModal(plugin.app, query, (query) => {
			addOrRemoveQueryCommand(plugin, query);
			queries = queries;
			saveQueries(queries);
		});
		modal.open();

		queries = queries;
		saveQueries(queries);
	};

	const toggleCommandForQuery = (e: any) => {
		const query: Query = e.detail.query;
		query.createCommand = !query.createCommand;
		queries = queries;
		addOrRemoveQueryCommand(plugin, query);
		saveQueries(queries);
	};

	const duplicateQuery = (e: any) => {
		const query: Query = e.detail.query;
		const queryClone = structuredClone(query);
		queryClone.id = getQueryCommandId();
		queryClone.name = queryClone.name + " (Copy)";
		queries = [...queries, queryClone];
		saveQueries(queries);
		if (query.createCommand) {
			plugin.addQueryCommand(query);
		}
	};

	const handleSubmit = () => {
		if (queryFormName.trim() === "") return;

		queries = [...queries, createQuery(queryFormName, "")];
		queryFormName = "";
		saveQueries(queries);
	};

	const saveChanges = () => {
		queries = queries;
		saveQueries(queries);
	};
</script>

<div class="query-list-view">
	<!-- Queries -->
	<QueryList
		bind:queries
		on:deleteQuery={deleteQuery}
		on:editQuery={editQuery}
		on:toggleCommandForQuery={toggleCommandForQuery}
		on:duplicateQuery={duplicateQuery}
		on:saveChanges={saveChanges}
	/>

	<!-- Create query form -->
	<form class="query-form" on:submit|preventDefault={handleSubmit}>
		<input type="text" placeholder="Name" bind:value={queryFormName} />
		<button class="mod-cta" type="submit">Add Query</button>
	</form>
</div>

<style>
	.query-list-view {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.query-form {
		display: flex;
		justify-content: right;
		gap: var(--size-4-2);
	}
</style>
