<script lang="ts">
	import { Query } from "src/types";
	import QueryItem from "./QueryItem.svelte";

	export let queries: Query[];
</script>

<div class="query-list">
	{#each queries as query}
		<QueryItem
			bind:query
			on:editQuery
			on:deleteQuery
			on:duplicateQuery
			on:toggleCommandForQuery
			on:saveChanges
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
