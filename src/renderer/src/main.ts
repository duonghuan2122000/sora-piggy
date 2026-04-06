import './assets/main.css';

import App from './App.vue';
// Use central i18n instance from renderer scope
import i18n from './i18n';
import pinia from '@renderer/stores';
import router from '@renderer/router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createApp } from 'vue';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(fas, far, fab);

const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.use(pinia);
app.use(i18n);
app.component('FontAwesomeIcon', FontAwesomeIcon);

app.mount('#app');
