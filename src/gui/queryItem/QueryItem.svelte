<script lang="ts">
	import {
		faClone,
		faTrash,
		faCog,
		faBolt,
	} from "@fortawesome/free-solid-svg-icons";
	import { Icon } from "svelte-awesome";
	import { Query } from "src/types";
	import { createEventDispatcher } from "svelte";

	export let query: Query;
	const dispatch = createEventDispatcher();

	const deleteQuery = () => {
		dispatch("deleteQuery", { query });
	};

	const editQuery = () => {
		dispatch("editQuery", { query });
	};

	const duplicateQuery = () => {
		dispatch("duplicateQuery", { query });
	};

	const toggleCommandForQuery = () => {
		dispatch("toggleCommandForQuery", { query });
	};

	const handleChange = () => {
		dispatch("saveChanges", { query });
	};
</script>

<div class="query-item">
	<!-- Name -->
	<button class="query-item__name" on:click={editQuery}>
		{query.name}
	</button>

	<!-- Options -->
	<div class="query-item__options">
		<button
			class="query-item__option"
			class:active={query.createCommand}
			on:click={toggleCommandForQuery}
		>
			<Icon data={faBolt} />
		</button>

		<button class="query-item__option" on:click={editQuery}>
			<Icon data={faCog} />
		</button>

		<button class="query-item__option" on:click={duplicateQuery}>
			<Icon data={faClone} />
		</button>

		<button class="query-item__option" on:click={deleteQuery}>
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

	.query-item__name {
		margin: 0;
	}

	.query-item__options {
		display: flex;
		gap: 0.125rem;
		align-items: center;
	}

	.query-item__option {
		aspect-ratio: 1 / 1;
	}

	button {
		background: transparent;
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
