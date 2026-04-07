---
name: sora-specify
description: 'Command tùy chỉnh để tạo spec cho một Product Backlog Item (PBI). Gọi theo cú pháp: /sora-specify <<pbi>> <<mô tả yêu cầu (nếu có)>>'
---

# sora-specify

Mục đích: tự động hoá các bước khởi tạo spec cho một Product Backlog Item (PBI).

Cú pháp chạy:

```
/sora-specify <<product backlog item>> <<mô tả yêu cầu (nếu có)>>
```

Ví dụ:

```
/sora-specify 123 "Cho phép người dùng đăng nhập bằng OTP"
```

Hành vi của command:

- Nhận hai tham số: `product backlog item` (chỉ số nguyên - số PBI) và `mô tả yêu cầu` (chuỗi, tuỳ chọn).
- Tóm tắt mô tả yêu cầu (nếu có) thành một cụm từ ngắn (1-6 từ) để dùng làm phần tên nhánh và thư mục.
- Tạo nhánh Git mới theo mẫu: `feature/<pbi>-<tóm-tắt-mô-tả-yêu-cầu>`
- Tạo thư mục `specs/<pbi>` trong repository
- Sử dụng agent `business-analyst` để tạo `spec.md` trong `specs/<pbi>/spec.md` dựa trên mô tả yêu cầu gốc; agent phải nhận mô tả yêu cầu và trả về nội dung spec hoàn chỉnh.

Hướng dẫn chi tiết cho người dùng (flow mà command sẽ thực hiện):

1. Xác thực đầu vào
   - Nếu `product backlog item` không phải số nguyên, báo lỗi và yêu cầu nhập lại.

2. Tóm tắt mô tả yêu cầu
   - Nếu có mô tả, tóm tắt thành 1-6 từ (không dấu, nối bằng dấu `-`) để dùng trong tên nhánh và tên thư mục.
   - Nếu không có mô tả, dùng `pbi-<pbi>` làm tóm tắt.

3. Tạo nhánh Git
   - Mẫu tên nhánh (khuyến nghị): `feature/<pbi>-<short-summary>`
     - Ví dụ thực tế: `feature/123-otp-login`
   - Lưu ý: nếu team dùng ticket ID có tiền tố (ví dụ `SORA-123`), bạn có thể dùng `feature/SORA-123-otp-login`; nhưng mặc định command sẽ sử dụng chỉ số PBI (số) để giữ đơn giản.
   - Hành động thực tế: hướng dẫn người dùng chạy các lệnh Git sau (command không tự động push):

```
git checkout -b feature/<pbi>-<short-summary>
```

4. Tạo thư mục specs

```
mkdir -p specs/<pbi>
```

5. Gọi agent `business-analyst` để tạo spec.md
   - Yêu cầu gửi tới agent `business-analyst` (khi gọi sử dụng `functions.task` đặt `subagent_type: "business-analyst"`):
     - product backlog item (số)
     - mô tả yêu cầu gốc (nguyên bản)
     - tóm tắt mô tả (đã tạo ở bước 2)
     - tên nhánh git đề xuất (ví dụ `feature/<pbi>-<short-summary>`)
     - định dạng output: `spec.md` bằng tiếng Việt, cấu trúc bao gồm: Summary, Goals, Acceptance Criteria, UX/Flows, Data Model (nếu cần), Non-functional Requirements, Tasks/Notes.
   - Yêu cầu thêm: file `spec.md` do agent trả về phải chứa metadata rõ ràng về PBI và tên nhánh git (ví dụ dòng: `PBI: 123` và `Branch: feature/123-otp-login`).

6. Lưu file `specs/<pbi>/spec.md` với nội dung do agent trả về. Đảm bảo file bao gồm metadata PBI và tên nhánh như yêu cầu ở bước 5.

7. Hướng dẫn commit (do command không tự commit trừ khi user yêu cầu):

```
git add specs/<pbi>/spec.md
git commit -m "spec: add OTP login spec for <pbi>"
```

8. Tùy chọn: push và tạo PR bằng tay.

Ví dụ đầu ra mong đợi (một phần của spec.md):

```
# Spec PBI 123 — Cho phép người dùng đăng nhập bằng OTP

## Tóm tắt
Người dùng có thể đăng nhập bằng số điện thoại và nhận mã OTP.

## Goals
- Giảm rào cản đăng nhập cho người dùng mới

## Acceptance Criteria
- Khi người dùng nhập số điện thoại hợp lệ, hệ thống gửi OTP...

...
```

Ghi chú thực thi cho implementer command:

- File command.md này là mô tả hành vi. Việc gọi agent `business-analyst` phải dùng `functions.task` với `subagent_type: "business-analyst"`; người implementer nên truyền prompt chi tiết và đảm bảo agent trả về `spec.md` có metadata PBI và tên nhánh.
- command này KHÔNG tự động push lên remote; chỉ tạo nhánh local và file. Nếu muốn tự động commit/push, cần xin phép rõ ràng trước khi thực hiện.
