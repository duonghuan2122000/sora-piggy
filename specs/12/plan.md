PBI: 12
Spec: specs/12/spec.md
Branch: feature/12-localize-danh-sach-giao-dich

# PBI 12 — Plan triển khai i18n (Quốc tế hóa)

---

## Executive Summary

Mục tiêu của PBI 12 là chuẩn hóa và hoàn thiện phần quốc tế hóa (i18n) cho ứng dụng, khởi tạo/cập nhật cấu hình i18n hiện có và đảm bảo danh sách giao dịch (và các component liên quan trong scope) sử dụng translation keys thay vì text cố định. Spec đã Approved và xác nhận dự án dùng `vue-i18n` với default locale = `vi` và fallbackLocale = `vi`.

Mục tiêu ngắn hạn cho PBI này:

- Xác nhận/hoàn thiện module i18n (src/i18n/index.ts) theo mẫu phù hợp với codebase.
- Tạo/chuẩn hóa `src/locales/vi.json` và nạp vào i18n.
- Thay các text cố định trong các component liên quan tới danh sách giao dịch bằng hàm `t('...')` theo quy ước key.
- Cập nhật tài liệu ngắn `docs/i18n.md` mô tả cách thêm bản dịch.
- QA kiểm tra fallback behaviour và acceptance criteria trong spec.

Scope không bao gồm dịch toàn bộ UI sang ngôn ngữ khác; chỉ chuẩn hóa i18n và localize các component liên quan tới PBI 12.

---

## Proposed Architecture (diagram notes)

Kiến trúc i18n là một module tách riêng, nhẹ, được mount vào Vue app trong main.ts.

- Component diagram (textual):
  - App (main.ts)
    - use(i18n)
    - Router -> Components
      - TransactionListComponent (dùng useI18n -> t('transactions.\*'))
      - TransactionItemComponent
      - Các component phụ khác
  - src/i18n/index.ts
    - import messages từ src/locales/\*.json
    - export default i18n instance

Ghi chú diagram:

- Không thay đổi server/backend API.
- Locale files là JSON thuần, version-controlled, nằm ở src/locales/
- Nếu muốn tối ưu bundle size, có thể lazy-load locale files theo demand (phần mở rộng)

---

## Components & Interfaces

1. i18n module
   - File: src/i18n/index.ts
   - Interface: export default i18n (Vue plugin) và export helper types nếu cần
   - Behavior: legacy: false (composition API), locale: 'vi', fallbackLocale: 'vi'

2. Locale files
   - Location: src/locales/vi.json (bắt buộc)
   - Structure: JSON object, nested keys theo domain: e.g. {
     "transactions": {
     "title": "Danh sách giao dịch",
     "empty": "Không có giao dịch",
     "columns": {
     "date": "Ngày",
     "amount": "Số tiền"
     }
     }
     }

3. Components sử dụng i18n
   - Trong setup(): const { t } = useI18n()
   - Template: {{ t('transactions.title') }}

4. Coding convention / contracts
   - Key naming: <domain>.<feature>.<component>.<element> (ví dụ transactions.list.title)
   - Không sử dụng chuỗi cố định trong template cho UI text
   - Nếu text cần tham số, dùng t('key', { var }) theo vue-i18n API

---

## Data Model changes

- Không thay đổi data model backend.
- Thêm artifacts: locale JSON files under src/locales/ (không ảnh hưởng DB).
- Nếu project có lưu preference user locale (future), ensure default behavior when no pref -> 'vi'. Hiện spec yêu cầu ứng dụng mặc định dùng 'vi' và fallback 'vi'.

---

## APIs & Contracts

Không có API HTTP mới. Hợp đồng nội bộ/contract liên quan:

- useI18n() (vue-i18n) contract: provide t(key, values?)
- Quy ước keys (domain-based) phải được team tuân thủ
- Nếu có shared components library, đảm bảo các props cho nội dung văn bản là keys thay vì raw strings (ví dụ <SoraButton :labelKey="'auth.login'" /> hoặc prop label mà component sử dụng t(labelKey)) — tùy quyết định implement.

Khuyến nghị: nếu cần, tạo small wrapper helper i18n-t(path: string, params?: Record) để centralize behavior.

---

## Non-functional Requirements

- Performance: nạp messages cơ bản (vi) tại startup; giữ nhỏ file JSON; nếu thêm nhiều locale sau này, implement lazy-load để tránh tăng bundle.
- Reliability: fallbackLocale = 'vi' đảm bảo không có missing text khi chỉ có vi.
- Security: locale files là static JSON, không chứa secret. Nếu có nội dung do người dùng cung cấp -> sanitize khi render HTML (không dùng v-html cho translations trừ khi kiểm soát được input).
- Maintainability: file locales phải có cấu trúc rõ ràng; cung cấp docs hướng dẫn cách thêm key, quy ước đặt tên; khuyến nghị tool kiểm tra coverage key (ví dụ vue-i18n-extract) nhưng không bắt buộc cài mới trong scope này.

---

## Migration Plan (if any)

PBI này là non-breaking. Migration steps for repo:

1. Tạo/đặt file src/locales/vi.json (commit mới).
2. Thêm/hoàn thiện src/i18n/index.ts và integrate vào main.ts (màu xanh trên branch feature).
3. Thay các text cố định trong các component liên quan PBI 12 (Transaction list) bằng keys.
4. QA: chạy ứng dụng, kiểm tra fallback behaviour.

Rollback: revert commit branch nếu lỗi; không ảnh hưởng DB.

---

## Implementation Tasks (ticketized, with estimates)

Note: 1 dev = senior frontend (Vue 3). Estimates in hours (including code + basic test). Story points optional.

- TASK-12-01: Kiểm tra dependency
  - Mô tả: Xác nhận package.json có vue-i18n phiên bản tương thích (v9.x). Nếu khác (v8 / Vue2), report ngay.
  - Estimate: 0.5h
  - Dependency: none

- TASK-12-02: Tạo/Cập nhật module i18n
  - Mô tả: Thêm file src/i18n/index.ts theo mẫu spec; export default i18n instance; ensure legacy:false phù hợp composition API; update main.ts để app.use(i18n)
  - Estimate: 2h
  - Dependency: TASK-12-01

- TASK-12-03: Tạo folder locale và vi.json
  - Mô tả: Tạo src/locales/vi.json, khởi tạo các key tối thiểu cho danh sách giao dịch (title, columns, empty state, actions). Đặt encoding UTF-8.
  - Estimate: 1.5h
  - Dependency: TASK-12-02

- TASK-12-04: Chuẩn hóa key và cập nhật component giao dịch
  - Mô tả: Thay tất cả text hard-coded trong TransactionList và TransactionItem bằng t('transactions.\*'). Refactor nhỏ nếu cần để truyền key xuống component con.
  - Files target: src/renderer/src/components/TransactionList.vue (hoặc tương đương). Team phải list chính xác component.
  - Estimate: 3h (2h dev + 1h review)
  - Dependency: TASK-12-03

- TASK-12-05: Unit/Integration check (lint + run)
  - Mô tả: Chạy npm run typecheck và lint, sửa warning liên quan i18n import/unused.
  - Estimate: 1h
  - Dependency: TASK-12-04

- TASK-12-06: QA & Test cases
  - Mô tả: QA xác nhận: app khởi chạy bằng tiếng Việt; xóa 1 key trong vi.json để kiểm tra fallback trả về giá trị vi (nếu applicable); confirm t(...) hiển thị đúng.
  - Estimate: 2h
  - Dependency: TASK-12-05

- TASK-12-07: Documentation
  - Mô tả: Tạo/ cập nhật docs/i18n.md mô tả vị trí file, cách thêm key, key convention, ví dụ dùng trong components.
  - Estimate: 1h
  - Dependency: TASK-12-02, TASK-12-03

- TASK-12-08: Code review & merge
  - Mô tả: PR, review, fix feedback, merge to feature branch. Ensure no force push.
  - Estimate: 1.5h
  - Dependency: tất cả trên

Tổng estimate: ~12.5 giờ (~2 developer-days)

---

## Timeline / Phases

Phối hợp thực hiện trong 2 ngày làm việc (hoặc 1 sprint nhỏ):

- Ngày 1: TASK-12-01, TASK-12-02, TASK-12-03
- Ngày 2: TASK-12-04, TASK-12-05, TASK-12-06
- Cuối ngày 2 (hoặc đầu ngày 3): TASK-12-07, TASK-12-08

Nếu có blocker (ví dụ vue-i18n incompatible), cần pause và quyết định điều chỉnh (see Risks).

---

## Risks & Mitigations

1. Vue / vue-i18n version mismatch
   - Risk: codebase dùng Vue 2 / vue-i18n v8, mẫu trong spec dành cho v9 -> code không chạy
   - Mitigation: TASK-12-01 kiểm tra version; nếu mismatch, báo PM & đề xuất either adjust code mẫu hoặc nâng cấp (upgrade lớn ngoài scope PBI này)

2. Missing or unknown component paths
   - Risk: component tên/đường dẫn khác so với assumption
   - Mitigation: dev trước khi commit, grep tìm text cứng liên quan "Danh sách giao dịch" hoặc "Giao dịch"; coordinate with repo owner to map files

3. Large locale files increase bundle
   - Risk: nếu thêm nhiều locale khi chưa lazy-load, bundle lớn
   - Mitigation: keep only vi loaded by default; consider lazy-load cho locale khác (future PBI)

4. Missing keys or inconsistent key usage
   - Risk: developers dùng text thay vì keys
   - Mitigation: update docs, implement code review checks, consider adding static check tooling (vue-i18n-extract) in future

5. Encoding / special characters
   - Risk: encoding issues for vi (accents)
   - Mitigation: ensure files saved UTF-8, CI lint checks may include file encoding

---

## Open Questions

1. Xác nhận chính xác các component liên quan đến "danh sách giao dịch" (đường dẫn file). Ai là owner? (Dev Lead)
2. Xác nhận version vue-i18n hiện tại (package.json). Nếu không phải v9, muốn nâng cấp hay điều chỉnh mẫu?
3. Có muốn áp dụng lazy-load locales ngay bây giờ hay để làm trong PBI sau?
4. Có policy cho pluralization, date/time formatting, currency formatting hay dùng i18n built-ins? (ví dụ Intl)
5. Có cần pipeline/CI check cho missing translation keys không? Nếu có, sẽ chọn tool nào?

---

## Dependencies

- package.json phải chứa vue-i18n (v9.x recommended)
- Access to repo and ability to create feature branch: feature/12-localize-danh-sach-giao-dich
- Test environment: ability chạy `npm run dev` (Electron + Vite)
- QA resources to run acceptance checklist

---

## Acceptance Criteria Mapping (to spec)

- [ ] package.json chứa dependency `vue-i18n` -> TASK-12-01
- [ ] Ứng dụng khởi chạy và hiển thị giao diện bằng tiếng Việt khi không có lựa chọn ngôn ngữ -> TASK-12-02..06
- [ ] Cấu hình i18n có `locale: 'vi'` và `fallbackLocale: 'vi'` -> TASK-12-02
- [ ] Ít nhất một file translation `src/locales/vi.json` tồn tại và được nạp -> TASK-12-03
- [ ] Các component mới/đã sửa dùng `t('...')` cho text hiển thị -> TASK-12-04
- [ ] QA checklist: đổi locale / xóa 1 key trong vi.json để test fallback -> TASK-12-06

---

## Implementation notes & best practices

- Luôn dùng keys theo domain (transactions.\*).
- Sử dụng t('key', { var }) cho interpolation.
- Tránh dùng v-html cho translations nếu không cần thiết.
- Nếu component library muốn hỗ trợ i18n, dùng props chấp nhận key hoặc slot để nội dung tùy chỉnh.

---

## Checklist trước khi merge

- [ ] Typecheck và lint pass
- [ ] Chạy app local, kiểm tra giao diện của Transaction list
- [ ] QA verify acceptance criteria
- [ ] Docs updated (docs/i18n.md)
