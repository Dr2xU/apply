import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { create, NButton, NCard, NForm, NFormItem, NInput, NMessageProvider } from 'naive-ui'

// Initialize Naive UI with only required components
const naive = create({
  components: [NButton, NCard, NForm, NFormItem, NInput, NMessageProvider],
})

const app = createApp(App)

// Setup Pinia store
const pinia = createPinia()
app.use(pinia)

// Initialize Auth Store after setting up Pinia
const authStore = useAuthStore()

// Load auth token from localStorage (if available)
const storedToken = localStorage.getItem('authToken')
if (storedToken) {
  authStore.token = storedToken
}

app.use(router)
app.use(naive)
app.mount('#app')
