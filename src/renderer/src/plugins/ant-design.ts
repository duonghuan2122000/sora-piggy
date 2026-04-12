import { App } from 'vue';
import Antd, { ConfigProvider } from 'ant-design-vue';
// Import commonly used components for better tree-shaking and explicit registration
import { message, notification } from 'ant-design-vue';

export function registerAntDesign(app: App): void {
  app.use(Antd);
  // enable global message and notification aliases
  app.config.globalProperties.$message = message;
  app.config.globalProperties.$notification = notification;
  // Attach message/notification to globalProperties for easy usage
  app.config.globalProperties.$message = message;
  app.config.globalProperties.$notification = notification;
}

export const AntConfigProvider = ConfigProvider;

export default registerAntDesign;
