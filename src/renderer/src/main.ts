import './assets/main.css';

import App from './App.vue';
// Use central i18n instance from renderer scope
import i18n from './i18n';
import pinia from '@renderer/stores';
import router from '@renderer/router';
import ElementPlus from 'element-plus';
// element-plus styles removed
// import 'element-plus/dist/index.css';
import registerAntDesign, { AntConfigProvider } from './plugins/ant-design'
// Import Ant Design runtime CSS (reset). Use package reset CSS from ES build to ensure path exists.
import 'ant-design-vue/dist/reset.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createApp } from 'vue';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(fas, far, fab);

const app = createApp(App);

// ElementPlus removed: using Ant Design exclusively
// app.use(ElementPlus);
// register Ant Design plugin (Sora migration) — keep ElementPlus until migration completes
registerAntDesign(app);
app.use(AntConfigProvider);
app.use(router);
app.use(pinia);
app.use(i18n);
app.component('FontAwesomeIcon', FontAwesomeIcon);

// NOTE: Ant Design locale provider can be wrapped here if needed in future
app.mount('#app');
