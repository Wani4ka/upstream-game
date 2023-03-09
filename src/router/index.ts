import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/play',
			name: 'game',
			component: () => import('@/views/GameView.vue'),
		},
		{
			path: '/:pathMatch(.*)*',
			component: () => import('@/views/NotFoundView.vue'),
		},
	],
})

export default router
