import './assets/main.css';

import { createApp } from 'vue';
import { create, NButton, NConfigProvider, NMessageProvider, NDialogProvider } from 'naive-ui';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import router from './router';
import pinia from './stores';
import i18n from './locales';

library.add(fas, far, fab);

const naive = create({
  components: [NButton, NConfigProvider, NMessageProvider, NDialogProvider]
});

const app = createApp(App);

app.use(naive);
app.use(router);
app.use(pinia);
app.use(i18n);
app.component('FontAwesomeIcon', FontAwesomeIcon);

app.mount('#app');
