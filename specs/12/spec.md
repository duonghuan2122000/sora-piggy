# PBI 12 — Spec triển khai i18n (Quốc tế hóa)

- Phiên bản spec: 2026-04-05
- Trạng thái: Approved (Cập nhật với thông tin môi trường)
- Tác giả: Product Manager

## Mục tiêu

PBI 12 yêu cầu chuẩn hóa và hoàn thiện quốc tế hóa (i18n) cho ứng dụng. Mục tiêu cụ thể của spec này:

- Xác nhận thư viện i18n đang dùng trong dự án và cấu hình mặc định.
- Mô tả cách cấu hình i18n, nơi lưu trữ file ngôn ngữ, cách thêm bản dịch mới.
- Đưa ra acceptance criteria và checklist công việc cho developer/QA.

> **Tóm tắt cập nhật quan trọng:**
>
> - Dự án đang dùng thư viện `vue-i18n` (đã xác nhận bằng package.json).
> - Ngôn ngữ mặc định (default locale) của codebase là `vi` (Tiếng Việt).
> - Fallback locale (khi key không có trong locale đang dùng) cũng là `vi`.

> **Assumption:** Thông tin "dự án đang dùng vue-i18n" và các thiết lập mặc định (`locale = 'vi'`, `fallbackLocale = 'vi'`) được cung cấp và xác nhận theo yêu cầu của Product Owner / stakeholder.

> **Assumption:** Dự án sử dụng Vue 3 (Composition API) và `vue-i18n` phiên bản tương thích với Vue 3 (ví dụ v9.x). Nếu dự án thực tế dùng Vue 2 / vue-i18n v8, cần thông báo để điều chỉnh code mẫu.

## Phạm vi

- Cập nhật/spec hướng dẫn cho phần khởi tạo i18n (nếu cần) và chuẩn đặt file translation.
- Kiểm tra/ghi nhận cấu hình hiện tại: default locale và fallback locale là `vi`.
- Không bao gồm việc dịch toàn bộ UI — đây là task tiếp theo (nếu cần).

## Yêu cầu kỹ thuật

1. Thư viện i18n
   - Dự án sử dụng `vue-i18n` như dependency (đã kiểm tra package.json).
   - Developer không cần cài thêm thư viện i18n mới.

2. Cấu hình locale
   - Default locale (ngôn ngữ mặc định) = `vi`.
   - Fallback locale = `vi`.
   - Hệ thống phải lấy `vi` làm ngôn ngữ khởi tạo khi không có lựa chọn của user.

3. Vị trí và cấu trúc file tiếng
   - Khuyến nghị lưu file translation tại `src/locales/` hoặc `src/i18n/locales/`.
   - Ví dụ cấu trúc:
     - src/locales/vi.json
     - src/locales/en.json (nếu có)
   - Mỗi file JSON chứa object các key => translation.

4. Thiết lập i18n (ví dụ hướng dẫn cài đặt)
   - Mẫu khởi tạo (Vue 3 + vue-i18n v9):

   ```ts
   // src/i18n/index.ts
   import { createI18n } from 'vue-i18n';
   import vi from '@/locales/vi.json';
   // import en from '@/locales/en.json' // nếu có

   const messages = {
     vi
     // en,
   };

   export const i18n = createI18n({
     legacy: false, // tùy cấu hình dự án
     locale: 'vi', // ngôn ngữ mặc định
     fallbackLocale: 'vi', // fallback
     messages
   });

   export default i18n;
   ```

   - Mẫu tích hợp vào main.ts:

   ```ts
   import { createApp } from 'vue';
   import App from './App.vue';
   import i18n from './i18n';

   const app = createApp(App);
   app.use(i18n);
   app.mount('#app');
   ```

   > **Assumption:** Codebase hiện có một file khởi tạo tương tự; nếu khác, developer sẽ map mã mẫu cho phù hợp.

5. Cách sử dụng trong component
   - Composition API (setup):

   ```ts
   import { useI18n } from 'vue-i18n';

   export default {
     setup() {
       const { t } = useI18n();
       return { t };
     }
   };
   ```

   - Template: <span>{{ t('key.path') }}</span>

6. Quy ước key
   - Dùng key có cấu trúc tên miền/đối tượng để dễ quản lý, ví dụ: `auth.login.title`, `profile.settings.language`.
   - Không copy text trực tiếp trong template — luôn dùng t('...').

7. Khi fallbackLocale = vi
   - Nếu một key không tồn tại trong locale hiện tại, hệ thống sẽ tìm trong `vi`.
   - Vì default = `vi` và fallback = `vi`, khi dự án mới chỉ có `vi` thì mọi key thiếu sẽ vẫn trả về từ `vi`.
   - Khi thêm các locale khác (vd: en), cần đảm bảo minimal coverage cho các key quan trọng hoặc cho phép hiển thị `vi` làm fallback.

## Acceptance Criteria (Tiêu chí nghiệm thu)

- [ ] package.json chứa dependency `vue-i18n` (đã xác nhận).
- [ ] Ứng dụng khởi chạy và hiển thị giao diện bằng tiếng Việt khi không có lựa chọn ngôn ngữ từ người dùng.
- [ ] Cấu hình i18n trong ứng dụng có `locale: 'vi'` và `fallbackLocale: 'vi'`.
- [ ] Ít nhất một file translation `src/locales/vi.json` tồn tại và được nạp bởi i18n.
- [ ] Các component mới/đã sửa dùng `t('...')` cho text hiển thị.
- [ ] QA có checklist kiểm tra: đổi locale (nếu có), xóa 1 key trong vi.json để xác nhận fallback trả về giá trị vi (nếu applicable).

## Tasks (Công việc)

1. Dev task — Kiểm tra & Cập nhật cấu hình i18n
   - Xác nhận package.json có `vue-i18n`.
   - Kiểm tra hoặc thêm module `src/i18n/index.ts` theo mẫu (hoặc cập nhật khớp codebase).
   - Đảm bảo messages nạp từ `src/locales/vi.json`.

2. Dev task — Di chuyển/Chuẩn hóa các bản dịch
   - Tạo `src/locales/vi.json` nếu chưa có.
   - Chuẩn hóa key cho các component cần thiết trong PBI này.

3. Dev task — Sửa component
   - Thay text cứng bằng `t('...')` ở các component liên quan đến PBI 12.

4. QA
   - Chạy app, xác nhận ngôn ngữ mặc định là `vi`.
   - Mô phỏng missing key để kiểm tra fallback (phải trả về vi string).

5. Documentation
   - Cập nhật README hoặc một file CONTRIBUTING ngắn tại `docs/i18n.md` mô tả cách thêm bản dịch mới.

## Example nội dung file locales/vi.json

```json
{
  "auth": {
    "login": {
      "title": "Đăng nhập",
      "button": "Đăng nhập"
    }
  },
  "profile": {
    "settings": {
      "language": "Ngôn ngữ"
    }
  }
}
```

> **Assumption:** Cấu trúc JSON này phù hợp với phong cách hiện tại của dự án; nếu dự án dùng module-based (TS) exports cho messages, sẽ cần map tương ứng.

## Kiểm thử (Testing)

- Unit tests (nếu có): test helpers có thể mock i18n hoặc test rằng component hiển thị đúng `t('key')` khi nạp messages.
- E2E: kiểm tra luồng UI chính bằng Playwright / Cypress: khởi chạy app, xác nhận text hiển thị bằng tiếng Việt khi không thay đổi locale.

## Các lưu ý vận hành

- Vì fallbackLocale = vi, khi thêm ngôn ngữ mới (ví dụ en) mà không cung cấp đầy đủ key, người dùng sẽ thấy văn bản tiếng Việt cho các key thiếu.
- Khi cần thay đổi default locale (ví dụ cho bản build quốc tế), cần cập nhật config và thông báo rõ trong changelog.

## Mở & Ghi chú

- Hiện tại không còn câu hỏi mở liên quan tới PBI 12 — tất cả thông tin quan trọng (thư viện i18n, default locale, fallback locale) đã được cung cấp.

> **Assumption:** Không có thay đổi yêu cầu rằng người dùng có thể chọn ngôn ngữ ngay lập tức; nếu cần UI chọn ngôn ngữ, đây sẽ là PBI mở rộng.

---

Chú thích: nếu developer cần code mẫu cụ thể tương thích với phiên bản vue-i18n hiện tại của project, vui lòng cung cấp nội dung package.json (hoặc phiên bản vue-i18n) để điều chỉnh mẫu setup cho chính xác.
