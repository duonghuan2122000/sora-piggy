---
name: sora-clarify
description: 'Command để review và làm rõ spec cho một Product Backlog Item (PBI). Cú pháp: /sora-clarify <<pbi>> <<mô tả yêu cầu (nếu có)>>'
---

# sora-clarify

Mục đích: hỗ trợ review và làm rõ spec.md của một Product Backlog Item (PBI) bằng cách sử dụng agent `product-manager`, chuyển nhánh Git tương ứng và cập nhật spec theo kết quả trao đổi.

Cú pháp chạy:

```
/sora-clarify <<product backlog item>> <<mô tả yêu cầu (nếu có)>>
```

Ví dụ:

```
/sora-clarify 123 "Một số chi tiết bổ sung nếu muốn"
```

Hành vi của command:

- Nhận hai tham số: `product backlog item` (số nguyên) và `mô tả yêu cầu` (chuỗi, tuỳ chọn).
- Đọc file `specs/<pbi>/spec.md` trong repository.
- Trích xuất tên nhánh Git từ metadata trong `spec.md` (dòng có dạng `Branch: <branch-name>`). Nếu không tìm thấy, báo lỗi và yêu cầu người dùng cung cấp tên nhánh hoặc cập nhật spec.md trước.
- Checkout về nhánh được chỉ định: `git checkout <branch-name>` (command sẽ chỉ hướng dẫn hoặc thực hiện tuỳ implementer; command không nên push tự động).
- Sau khi chuyển nhánh, gọi agent `product-manager` để review nội dung `spec.md`:
  - Khi gọi agent qua `functions.task`, set `subagent_type: "product-manager"`.
  - Truyền cho agent: product backlog item (số), nội dung đầy đủ của `spec.md`, tóm tắt mô tả (nếu có), và tên nhánh.
  - Yêu cầu agent trả về hai phần rõ ràng trong tiếng Việt:
    1. Một danh sách các câu hỏi cần làm rõ (mỗi câu hỏi ngắn gọn, có id/ordinal),
    2. Một version gợi ý của `spec.md` đã được review/điều chỉnh (một bản draft hoàn chỉnh) — phần này có thể là spec đã được cập nhật dựa trên giả định trả lời các câu hỏi chưa được giải đáp.

- Sau khi agent trả về danh sách câu hỏi, command sẽ lần lượt trình bày các câu hỏi này cho user (qua chat/CLI) để user trả lời. Mỗi câu trả lời của user cần được gửi lại cho agent để agent có thể cập nhật spec.md dần dần.

- Quy trình lặp:
  1. Agent gửi danh sách câu hỏi.
  2. Assistant (hoặc command) hỏi user từng câu một và nhận câu trả lời.
  3. Sau mỗi câu trả lời (hoặc sau tập câu trả lời), gọi lại agent `product-manager` để cập nhật draft spec.md (gọi `functions.task` với cùng `subagent_type`).
  4. Lặp đến khi agent xác nhận rằng không còn câu hỏi mở hoặc user chọn kết thúc phiên làm rõ.

- Cuối cùng, ghi (ghi đè) nội dung hoàn thiện vào `specs/<pbi>/spec.md` với nội dung do agent + user phối hợp tạo ra.

- Gợi ý commit (không tự động commit trừ khi user yêu cầu):

```
git add specs/<pbi>/spec.md
git commit -m "spec: clarify and update PBI <pbi> spec"
```

Lưu ý triển khai cho implementer command:

- Kiểm tra tồn tại của `specs/<pbi>/spec.md` trước khi gọi agent; nếu file không tồn tại, báo lỗi rõ ràng cho user.
- Khi đọc `spec.md`, parse metadata tìm dòng `Branch:` (case-insensitive) để lấy tên nhánh. Nếu metadata chứa nhiều dòng dạng `Branch:`, ưu tiên hàng đầu xuất hiện.
- Việc checkout nhánh có thể được thực hiện tự động bởi command (gọi shell `git checkout`) hoặc hướng dẫn user thực hiện — tuỳ chính sách dự án. Nếu tự checkout, phải kiểm tra workspace sạch (không có thay đổi unstaged) hoặc cảnh báo user trước khi checkout.
- Khi gọi `functions.task` để sử dụng agent `product-manager`, truyền prompt rõ ràng yêu cầu:
  - Trả về 'questions' dưới dạng danh sách có id
  - Trả về 'updated_spec' là nội dung spec.md đã chỉnh sửa
  - Trả về ở định dạng Markdown tiếng Việt

- Yêu cầu agent cũng phải liệt kê mức độ ưu tiên/loại câu hỏi (ví dụ: functional, UX, data, non-functional) để người thực hiện biết nên trả lời trước câu nào.

Ví dụ nội dung metadata bắt buộc trong spec.md (mẫu):

```
PBI: 123
Branch: feature/123-otp-login
# Spec PBI 123 — Cho phép người dùng đăng nhập bằng OTP
...
```

Kết quả mong muốn:

- Một workflow tương tác trong đó agent `product-manager` review spec, tạo danh sách câu hỏi cần làm rõ, user trả lời từng câu, và file `specs/<pbi>/spec.md` được cập nhật cuối cùng.
