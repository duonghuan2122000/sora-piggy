PBI: 12
Branch: feature/12-localize-danh-sach-giao-dich

Summary

- Tên ngắn: Bổ sung localize cho màn hình danh sách giao dịch
- Mô tả ngắn: Thêm bản dịch (tiếng Việt) cho toàn bộ văn bản trên màn hình danh sách giao dịch: placeholder ô tìm kiếm, tiêu đề các tag tóm tắt (Tổng thu, Tổng chi, Số dư cuối) và tiêu đề các cột trong bảng giao dịch.
- Actors:
  - End user (người dùng cuối) - mong muốn UI tiếng Việt dễ hiểu.
  - Developer - cài đặt i18n keys và thay đổi component để dùng chuỗi i18n.
  - QA - kiểm thử UI/hiển thị bản dịch.
- User stories:
  1. As a người dùng, I want the transaction list screen displayed in Vietnamese, so that I can understand labels và thao tác dễ dàng.
  2. As a developer, I want clear i18n keys và file resource cho màn hình này, so that translations có thể được quản lý và mở rộng.

Goals

- Goals:
  - Mặc định hiển thị ngôn ngữ là tiếng Việt (locale = 'vi') khi mở màn hình danh sách giao dịch.
  - Thay thế tất cả text tĩnh trên màn hình bằng các key i18n và đưa bản dịch tiếng Việt vào resource file.
  - Đảm bảo placeholder ô tìm kiếm, tiêu đề tag summary và tiêu đề các cột bảng đúng theo yêu cầu.
  - Cung cấp danh sách i18n keys rõ ràng để QA và reviewer kiểm tra.
- Non-goals (Không thuộc phạm vi):
  - Không thay đổi logic nghiệp vụ của bảng giao dịch (lọc, phân trang, sort).
  - Không thêm multi-locale switching UI (chỉ đảm bảo default = vi). Hỗ trợ chuyển ngôn ngữ (nếu có) là out of scope cho PBI này.
  - Không dịch nội dung dữ liệu động do user tạo (ví dụ tên giao dịch, ghi chú) — chỉ dịch UI static.

Acceptance Criteria (Given / When / Then)

1. Default language = Vietnamese

- Given: Người dùng mở màn hình "Danh sách giao dịch"
- When: màn hình được render lần đầu
- Then: tất cả text UI mặc định trên màn hình hiển thị tiếng Việt theo các key đã định nghĩa (không còn text tiếng Anh).

2. Search input placeholder

- Given: ô nhập tìm kiếm giao dịch hiển thị
- When: trường search chưa có nội dung
- Then: placeholder phải là "Tìm kiếm giao dịch"

3. Card summary tags — Tổng thu

- Given: card summary hiện trên màn hình chứa tag doanh thu
- When: card summary render
- Then: tag hiển thị tiêu đề "Tổng thu" tương ứng key transactions.card.totalIncome

4. Card summary tags — Tổng chi

- Given: card summary hiện trên màn hình chứa tag chi phí
- When: card summary render
- Then: tag hiển thị tiêu đề "Tổng chi" tương ứng key transactions.card.totalExpense

5. Card summary tags — Số dư cuối

- Given: card summary hiện trên màn hình chứa tag số dư
- When: card summary render
- Then: tag hiển thị tiêu đề "Số dư cuối" tương ứng key transactions.card.latestBalance

6. Bảng danh sách giao dịch — tiêu đề cột

- Given: bảng danh sách giao dịch hiển thị tiêu đề header cột
- When: header render
- Then: các tiêu đề cột phải là:
  - Transaction Name => "Tên giao dịch" (key: transactions.table.headers.name)
  - Category => "Danh mục" (key: transactions.table.headers.category)
  - Account => "Tài khoản" (key: transactions.table.headers.account)
  - TransactionTime => "Thời gian" (key: transactions.table.headers.time)
  - Amount => "Số tiền" (key: transactions.table.headers.amount)

7. Fallback / missing translation behavior (kỹ thuật, có thể kiểm thử)

- Given: key i18n không tồn tại trong file 'vi'
- When: màn hình render
- Then: hệ thống sẽ:
  a) log cảnh báo (dev console) cho key thiếu
  b) hiển thị fallback: nếu có bản dịch trong locale mặc định dự phòng (ví dụ 'en') dùng bản đó; nếu không, hiển thị key giữa ngoặc (ví dụ "[transactions.table.headers.name]") để QA dễ phát hiện.

UX/Flows

- Luồng chính:
  1. Người dùng điều hướng tới màn hình "Danh sách giao dịch".
  2. Ứng dụng load resource i18n cho locale hiện tại. Vì mặc định là 'vi', load file locales/vi.json.
  3. Components trên màn hình (SearchInput, SummaryCard, TransactionsTable) sử dụng hook/fn i18n (ví dụ t('...')) để lấy chuỗi hiển thị.
  4. Nếu user nhập tìm kiếm, placeholder "Tìm kiếm giao dịch" vẫn hiển thị đến khi input có nội dung.
  5. QA kiểm tra các thành phần hiển thị đúng các chuỗi tiếng Việt.
- Vị trí UI liên quan:
  - Header/Toolbar: vị trí ô Search (placeholder)
  - Section Summary: các tag Tổng thu / Tổng chi / Số dư cuối
  - Data Table: header của bảng giao dịch ở hàng đầu

Data Model (i18n keys / resource file)

- File resource đề xuất: src/locales/vi.json (hoặc dựa theo cấu trúc project)
- Suggested JSON structure (ví dụ):

```json
{
  "transactions": {
    "search": {
      "placeholder": "Tìm kiếm giao dịch"
    },
    "card": {
      "totalIncome": "Tổng thu",
      "totalExpense": "Tổng chi",
      "latestBalance": "Số dư cuối"
    },
    "table": {
      "headers": {
        "name": "Tên giao dịch",
        "category": "Danh mục",
        "account": "Tài khoản",
        "time": "Thời gian",
        "amount": "Số tiền"
      }
    }
  }
}
```

- Key naming convention: lower-dot-separated, prefix theo màn hình (transactions.\*). Đảm bảo consistency với các key i18n đang có trên project.

Business Rules / Constraints

- Ngôn ngữ mặc định must be 'vi' cho màn hình này (nếu app có global locale khác, override locale cho màn hình này hoặc đảm bảo global default = vi khi mở màn hình).
- Không dịch dữ liệu người dùng (Transaction.name, memo) — chỉ UI static.
- Tất cả key mới phải có entry trong file vi.json trước khi merge. Missing keys gây fail trong QA checklist.
- Fallback behavior như phần Acceptance Criteria: log + fallback to 'en' if exists + show key bracket nếu không.
- Không thay đổi layout hoặc CSS dẫn đến overflow text; nếu bản dịch dài hơn, đảm bảo giao diện responsive (ellipsis hoặc wrap tuỳ thiết kế hiện có).

Non-functional Requirements

- Hiệu năng: việc load file i18n không gây chậm UI (load nhẹ, file JSON nhỏ).
- Reliability: Nếu file vi.json không load được, màn hình vẫn render với fallback keys thay vì crash.
- Maintainability: keys đặt rõ ràng, có comment nếu cần để dịch viên hiểu ngữ cảnh.
- Testability: các AC viết rõ Given/When/Then để QA tự động hóa có thể assert text node bằng selector.

Tasks / Notes (Dev & QA)

- Dev tasks:
  1. Tạo / cập nhật file locales/vi.json theo cấu trúc đề xuất với các key ở phần Data Model.
  2. Thay thế text tĩnh trong components: SearchInput, SummaryCard, TransactionsTable header để dùng i18n function (ví dụ t('transactions.search.placeholder')).
  3. Đảm bảo default locale cho màn hình là 'vi' (nếu app hỗ trợ multi-locale, set locale khi màn hình mount hoặc đảm bảo config global mặc định).
  4. Thêm log cảnh báo khi key missing (nếu chưa có cơ chế).
  5. Viết unit tests / snapshot tests cho components để verify keys được render (mock i18n).
  6. Cập nhật storybook / docs component (nếu project có) để phản ánh i18n usage.
  7. Run lint/format, build, typecheck.
- QA tasks:
  1. Mở màn hình, verify các AC (check placeholder, card tags, table headers).
  2. Kiểm tra trường hợp key bị xóa/thiếu (simulate missing key) để verify fallback behavior.
  3. Chụp màn hình, lưu làm evidence cho review.
  4. Kiểm tra responsive: các label dài không bị tràn UI.
- Notes kỹ thuật:
  - Nếu project dùng i18next: dùng t('transactions.table.headers.name') hoặc useTranslation hook.
  - Nếu project dùng another i18n lib, tuân theo API hiện tại.
  - Đường dẫn file đề xuất: src/locales/vi.json (hoặc src/i18n/vi.json) — điều chỉnh theo cấu trúc repo.
  - Nếu có pipeline kiểm tra missing translation keys (script), thêm keys mới vào whitelist.
  - Nếu sử dụng TypeScript, thêm types cho keys nếu có i18n type generation.
  - Nếu components hiện tại nhận props cho label text, update prop để nhận value từ t('...') ở container hoặc pass key string và resolve ở component tùy pattern dự án.

Estimate (ước lượng)

- Story points: 3 (medium)
- Thời gian ước tính: 1.5 - 2.5 ngày công (bao gồm dev + unit test + QA)
  - Dev implementation: 0.5 - 1 ngày
  - Tests & fixes: 0.5 ngày
  - QA verification & feedback: 0.5 - 1 ngày

Phụ thuộc (Dependencies)

- Hệ thống i18n hiện tại (i18next / vue-i18n...) phải có cơ chế load locales.
- File locales/vi.json (hoặc tương đương) sẵn sàng để sửa/commit.
- CI/checker (nếu có script check missing translations) cần cập nhật nếu phát hiện keys mới.
- Nếu có component library dùng label props, cần phối hợp với team component nếu cần thay đổi prop signature.

Out of Scope (nhắc lại)

- Thay đổi multi-language switching UI.
- Dịch nội dung do user nhập.
- Thay đổi layout/visual design trừ trường hợp cần điều chỉnh để tránh overflow.

Kết luận / Acceptance checklist cho PR reviewer

- [ ] File locales/vi.json đã được cập nhật với tất cả keys nêu trên.
- [ ] Components dùng hàm t('...') thay vì text cứng.
- [ ] Màn hình mặc định hiển thị tiếng Việt khi mở.
- [ ] Unit/snapshot tests cập nhật (nếu có).
- [ ] QA đã thực hiện các Acceptance Criteria và sign-off.

Tags i18n (tóm tắt keys đề xuất)

- transactions.search.placeholder
- transactions.card.totalIncome
- transactions.card.totalExpense
- transactions.card.latestBalance
- transactions.table.headers.name
- transactions.table.headers.category
- transactions.table.headers.account
- transactions.table.headers.time
- transactions.table.headers.amount

Tên nhánh đề xuất

- feature/12-localize-danh-sach-giao-dich
