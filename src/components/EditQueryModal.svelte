<script lang="ts">
	import { onDestroy } from "svelte";
	import { RandomNoteQuery } from "../types";

	export let query: RandomNoteQuery;
	export let handleChange: (query: RandomNoteQuery) => void;

	const emitHandleChange = () => {
		console.log("EMIT CHANGE");
		handleChange(query);
	}
	
	onDestroy(() => {
		emitHandleChange();
	});
</script>

<h2>{query.name}</h2>

<div class="content">
	<!-- Create command -->
	<div class="setting-item mod-toggle">
		<div class="setting-item-info">
			<div class="setting-item-name">Create command</div>
			<div class="setting-item-description">Make the query into an executable command.</div>
		</div>
		<div class="setting-item-control">
			<div class="checkbox-container" class:is-enabled={query.createCommand} on:click={() => {query.createCommand = !query.createCommand}}>
				<input type="checkbox" tabindex="0" bind:checked={query.createCommand} on:input={emitHandleChange}>
			</div>
		</div>
	</div>
	
	<!-- Use Dataview -->
	<div class="setting-item mod-toggle">
		<div class="setting-item-info">
			<div class="setting-item-name">Use Dataview</div>
			<div class="setting-item-description">Use Dataview as query language.</div>
		</div>
		<div class="setting-item-control">
			<div class="checkbox-container" class:is-enabled={query.dataview} on:click={() => {query.dataview = !query.dataview}}>
				<input type="checkbox" tabindex="0" bind:checked={query.dataview} on:input={emitHandleChange}>
			</div>
		</div>
	</div>

	<div class="content">
		<span>Query:</span>
		<textarea bind:value={query.query} rows={12} on:input={emitHandleChange} />
	</div>
</div>

<style>
	.content {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
</style>
