<script lang="ts">
	import { RandomNoteQuery } from "src/types";
	import QueryItem from "./QueryItem.svelte";

	export let queries: RandomNoteQuery[];
</script>

<div class="query-list">
	{#each queries as query}
		<QueryItem
			bind:query
			on:editQuery
			on:deleteQuery
			on:duplicateQuery
			on:toggleCommandForQuery
		/>
	{:else}
		 <p>Create a query</p>
	{/each}
</div>

<style>
	.query-list {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
</style>
