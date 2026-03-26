import './assets/main.css';

import App from './App.vue';
import i18n from '@renderer/locales';
import pinia from '@renderer/stores';
import router from '@renderer/router';
import { NButton, NConfigProvider, NDialogProvider, NMessageProvider, create } from 'naive-ui';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createApp } from 'vue';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

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
