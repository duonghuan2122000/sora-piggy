import { message } from 'ant-design-vue'

export function notifySuccess(content: string, duration = 3) {
  message.success(content, duration)
}

export function notifyError(content: string, duration = 3) {
  message.error(content, duration)
}

export default { notifySuccess, notifyError }
