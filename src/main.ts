import { createApp } from 'vue'
import pinia from '@/stores/store'

import App from '@/App.vue'

import router from '@/router'

import '@/assets/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHouse, faChevronRight, faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'

const app = createApp(App)

app.use(pinia)
app.use(router)

library.add(faHouse, faChevronRight, faCaretLeft, faCaretRight)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
