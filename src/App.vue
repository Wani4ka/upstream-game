<template>
	<RouterView />
	<footer class="fixed bottom-3 left-0 text-center min-w-full">
		<div
			class="max-w-max text-sm ml-auto mr-auto border-t pt-2 border-current"
		>
			<span>
				UpStream Game is an open-source recreation of a quiz by
				<a
					class="underline"
					href="https://www.youtube.com/playlist?list=PLtmHHXWOgWR7iH5lrB2ezGPamn2_H1l7Q"
					target="_blank"
					>WhatIF</a
				>.
			</span>
			<br />
			<span>
				Check out the
				<a
					class="underline"
					href="https://github.com/Wani4ka/upstream-game"
					target="_blank"
					>GitHub repository</a
				>
				to contribute. I'm really a noob in frontend.
			</span>
		</div>
	</footer>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>