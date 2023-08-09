<script lang="ts">
	import { faClone, faTrash, faCog, faBolt } from "@fortawesome/free-solid-svg-icons";
	import { Icon } from "svelte-awesome";
	import { Component, MarkdownRenderer, htmlToMarkdown } from "obsidian";
	import { RandomNoteQuery } from "src/types";
	import { createEventDispatcher } from "svelte";

	export let query: RandomNoteQuery;
	const dispatch = createEventDispatcher();

	const deleteQuery = () => {
		dispatch("deleteQuery", { query });
	}

	const editQuery = () => {
		dispatch("editQuery", { query });
	}

	const duplicateQuery = () => {
		dispatch("duplicateQuery", { query });
	}

	const toggleCommandForQuery = () => {
		dispatch("toggleCommandForQuery", { query });
	}

	const component = new Component();
	let nameElement: HTMLSpanElement;

	$: {
		if (nameElement) {
			nameElement.innerHTML = "";
			const nameHTML = htmlToMarkdown(query.name);
			MarkdownRenderer.renderMarkdown(
				nameHTML,
				nameElement,
				"/",
				component
			);
		}
	}
</script>

<div class="query-item">
	<!-- Name -->
	<span class="query-item__name" bind:this={nameElement} />

	<!-- Options -->
	<div class="query-item__options">
		<button class:active={query.createCommand} on:click={toggleCommandForQuery}>
			<Icon data={faBolt} />
		</button>

		<button on:click={editQuery}>
			<Icon data={faCog} />
		</button>

		<button on:click={duplicateQuery}>
			<Icon data={faClone} />
		</button>
		
		<button on:click={deleteQuery}>
			<Icon data={faTrash} />
		</button>
	</div>
</div>

<style>
	.query-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: max-content;
	}

	.query-item__options {
		display: flex;
		gap: 0.125rem;
		align-items: center;
	}

	button {
		background: transparent;
		aspect-ratio: 1 / 1;
		padding: 0;
		border: none;
		box-shadow: none;
	}

	button:hover {
		cursor: pointer;
	}

	button:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
	}

	.active {
		color: yellow;
	}
</style>
