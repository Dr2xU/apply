import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { create, NButton, NCard, NForm, NFormItem, NInput, NMessageProvider } from 'naive-ui';

const naive = create({
  components: [NButton, NCard, NForm, NFormItem, NInput, NMessageProvider],
});

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(naive);
app.mount('#app');
