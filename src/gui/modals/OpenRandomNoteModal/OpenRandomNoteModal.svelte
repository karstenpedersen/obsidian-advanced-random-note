<script lang="ts">
	import { Query } from "src/types";

	export let queries: Query[];
	export let handleSubmit: (query: Query) => void;
	let selectedQuery: Query;

	const handleFormSubmit = () => {
		handleSubmit(selectedQuery);
	};
</script>

<h3>Select Random Note Query</h3>

{#if queries.length > 0}
	<form on:submit|preventDefault={handleFormSubmit}>
		<select class="dropdown" bind:value={selectedQuery}>
			{#each queries as query}
				<option value={query}>{query.name}</option>
			{/each}
		</select>
		<button class="mod-cta" type="submit">Find Random Note</button>
	</form>
{:else}
	<p class="setting-item-description">
		Go to settings tab to make search queries.
	</p>
{/if}

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	button {
		max-width: max-content;
	}
</style>
