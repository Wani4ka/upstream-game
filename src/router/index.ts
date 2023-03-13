import { useGameStore } from '@/stores/game'
import pinia from '@/stores/store'
import { createRouter, createWebHistory } from 'vue-router'

const questions = useGameStore(pinia)

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/play',
			name: 'game',
			component: () => import('@/views/GameView.vue'),
			beforeEnter: () => {
				if (!(questions.questions && questions.questions.length)) {
					return '/setup'
				}
			}
		},
		{
			path: '/setup',
			name: 'setup',
			component: () => import('@/views/SetupView.vue'),
		},
		{
			path: '/:pathMatch(.*)*',
			component: () => import('@/views/NotFoundView.vue'),
		},
	],
})

export default router
