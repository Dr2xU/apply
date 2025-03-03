import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { create, NButton, NCard, NForm, NFormItem, NInput, NMessageProvider } from 'naive-ui'

// ✅ Initialize Naive UI components
const naive = create({
  components: [NButton, NCard, NForm, NFormItem, NInput, NMessageProvider],
})

const app = createApp(App)

// ✅ Setup Pinia before using `useAuthStore`
const pinia = createPinia()
app.use(pinia)

// ✅ Now safely access the auth store
const authStore = useAuthStore()
if (localStorage.getItem('authToken')) {
  authStore.token = localStorage.getItem('authToken')
}

app.use(router)
app.use(naive)
app.mount('#app')
