<template>
	<RouterView />
	<footer class="fixed bottom-3 left-0 text-center min-w-full">
		<div
			class="max-w-max text-xs lg:text-sm ml-auto mr-auto border-t pt-2 border-current space-y-1"
		>
			<p>
				Check out the
				<a
					class="underline"
					href="https://github.com/Wani4ka/upstream-game"
					target="_blank"
					>GitHub repository</a
				>
				to contribute.
			</p>
		</div>
	</footer>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
