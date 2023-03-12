import type { SweetAlertOptions } from 'sweetalert2'
import Swal from 'sweetalert2'
import { onMounted, ref, watch } from 'vue'

const welcomeAlert: SweetAlertOptions = {
	icon: 'info',
	title: '<span style="color:var(--color-heading);">Добро пожаловать в UpStream!</span>',
	html: `
		<div class="space-y-2">
			<p>
				UpStream Game - это аналог викторины от
				<a
					class="underline"
					href="https://www.youtube.com/playlist?list=PLtmHHXWOgWR7iH5lrB2ezGPamn2_H1l7Q"
					target="_blank"
					>WhatIF</a
				>.
			</p>
			<p>
				Если вы хотите внести вклад, перейдите по ссылке внизу сайта.
			</p>
			<p>
				⚠️Этот сайт <i>не связан</i> с WhatIF никоим образом. Проект предоставляется "как есть" без каких-либо гарантий.
			</p>
		</div>
	`,
	confirmButtonText: 'Понятно',
	confirmButtonColor: '#1e3a8a',
	backdrop: false,
	background: 'var(--color-background)',
	color: 'var(--color-text)',
}

export const useGreeting = () => {
	const confirmed = ref(!!localStorage.getItem('confirmed'))
	onMounted(() => {
		if (!confirmed.value) {
			Swal.fire(welcomeAlert).then(d => confirmed.value = d.isConfirmed)
		}
	})
	watch(confirmed, newValue => {
		if (newValue)
			localStorage.setItem('confirmed', '1')
		else localStorage.removeItem('confirmed')
	})
	return confirmed
}
