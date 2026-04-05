---
name: sora-plan
description: 'Command để tạo TASKS từ plan.md, chạy agents tech-lead và qc, rồi review và lặp lại đến khi APPROVED.'
---

# sora-plan

Mục đích: tự động hoá bước chuyển plan.md thành danh sách TASKS và test-case, phối hợp giữa các agent technical và QA, đồng thời chạy quy trình review đến khi cả hai được approve.

Cú pháp chạy:

```
/sora-plan <<product backlog item>> <<mô tả thêm yêu cầu về kỹ thuật (nếu có)>>
```

Ví dụ:

```
/sora-plan 123 "Cần hỗ trợ migration DB và tối ưu API"
```

Hành vi của command:

- Nhận hai tham số: `product backlog item` (số nguyên) và `mô tả thêm` (chuỗi, tuỳ chọn).
- Mục tiêu chính: từ `plan.md` (của PBI) tạo `tasks.md` (danh sách task chi tiết) và từ `spec.md` + `plan.md` tạo `test-case.md`.

Luồng chi tiết (flow):

1. Xác thực đầu vào
   - Nếu `product backlog item` không phải số nguyên, báo lỗi và yêu cầu nhập lại.

2. Xác định vị trí `plan.md` và `spec.md`
   - Mặc định command kỳ vọng các file nằm trong `specs/<pbi>/plan.md` và `specs/<pbi>/spec.md`.
   - Nếu không tìm thấy, command nên báo rõ cho user vị trí cần có `plan.md`/`spec.md` và dừng.

2.1. Xác định và chuyển nhánh Git an toàn

- Trước khi chạy agents, command nên xác định tên nhánh Git từ metadata trong `spec.md` (dòng có dạng `Branch: <branch-name>`).
- Nếu tìm thấy `Branch:` trong `spec.md`, command sẽ cố gắng checkout về nhánh đó trước khi tạo tasks/test-case.
  - Hành động checkout có thể được thực hiện tự động hoặc chỉ hướng dẫn user tuỳ policy dự án; nếu thực hiện tự động, cần kiểm tra workspace sạch (không có thay đổi unstaged hoặc uncommitted).
  - Nếu workspace không sạch, command phải cảnh báo user và dừng hoặc đề xuất các lựa chọn: stash thay đổi, commit tạm, hoặc user tự checkout.
- Nếu `Branch:` không có trong `spec.md`, command có thể đề xuất một tên nhánh theo mẫu: `feature/<pbi>-<short-summary>` (dựa trên mô tả thêm) và yêu cầu user xác nhận hoặc cập nhật `spec.md` trước khi tiếp tục.
- Khi thực hiện checkout tự động, implementer nên dùng `git status --porcelain` để kiểm tra sạch workspace và `git checkout <branch-name>` để chuyển nhánh. Nếu cần, hướng dẫn dùng `git stash push -m "sora-plan auto-stash"` trước khi checkout và `git stash pop` sau.
- Tóm lại: trước khi gọi agents, command phải đảm bảo đang ở đúng nhánh liên quan đến PBI, hoặc thông báo rõ cho user để họ tự chuyển nhánh.

3. Chạy song song hai agent (parallel):
   - `tech-lead`: tạo `tasks.md` từ `plan.md`.
     - Yêu cầu gửi tới agent `tech-lead` (khi gọi sử dụng `functions.task` đặt `subagent_type: "tech-lead"`):
       - product backlog item (số), nội dung `plan.md` (nguyên văn), mô tả kỹ thuật thêm (nếu có).
       - Output mong muốn: file `tasks.md` bằng tiếng Việt, cấu trúc rõ ràng: Metadata (PBI: <pbi>), Summary, List of Tasks (mỗi task gồm: title, description, estimate (h), priority, dependencies, owner-suggestion), Implementation Notes, Checklist.
       - Ghi metadata đầu file: `PBI: <pbi>` và `Source: specs/<pbi>/plan.md`.

   - `qc`: tạo `test-case.md` từ `spec.md` và `plan.md`.
     - Yêu cầu gửi tới agent `qc` (khi gọi sử dụng `functions.task` đặt `subagent_type: "qc"`):
       - product backlog item (số), nội dung `spec.md`, nội dung `plan.md`.
       - Output mong muốn: file `test-case.md` bằng tiếng Việt, cấu trúc gồm: Metadata (PBI), Test Summary, Test Cases (Acceptance tests, Integration tests, Edge cases, Non-functional tests), Pre-conditions, Test Data, Steps, Expected Results, Automation notes (nếu có).
       - Ghi metadata đầu file: `PBI: <pbi>` và `Source: specs/<pbi>/spec.md, specs/<pbi>/plan.md`.

4. Chờ cả hai agent hoàn thành. Lưu file trả về lần lượt vào:
   - `specs/<pbi>/tasks.md` (từ `tech-lead`)
   - `specs/<pbi>/test-case.md` (từ `qc`)

5. Sau khi cả hai file có sẵn, chạy song song review:
   - `solution-architect`: review `tasks.md` (subagent_type: "solution-architect"). Yêu cầu review trả về trạng thái rõ ràng: APPROVED hoặc REQUEST_CHANGES kèm feedback chi tiết (mức độ: blocker/major/minor) và các gợi ý sửa.
   - `qc-lead`: review `test-case.md` (subagent_type: "qc-lead"). Yêu cầu review trả về trạng thái rõ ràng: APPROVED hoặc REQUEST_CHANGES với feedback chi tiết.

6. Nếu cả hai đều APPROVED => command kết thúc thành công, trả lời user rằng `tasks.md` và `test-case.md` đã được APPROVED và sẵn sàng để assign/implement.

7. Nếu có review trả về `REQUEST_CHANGES`:
   - Nếu `solution-architect` REQUEST_CHANGES:
     - Gửi feedback architect cho `tech-lead` (subagent_type: "tech-lead") để sửa `tasks.md` tương ứng. Yêu cầu `tech-lead` trả về phiên bản cập nhật của `tasks.md`.
   - Nếu `qc-lead` REQUEST_CHANGES:
     - Gửi feedback qc-lead cho `qc` (subagent_type: "qc") để sửa `test-case.md` tương ứng. Yêu cầu `qc` trả về phiên bản cập nhật của `test-case.md`.
   - Sau khi các sửa được nộp, lặp lại bước 5 (review) cho các file được cập nhật.
   - Lặp lại cho đến khi cả hai review trả về APPROVED.

8. Ghi chú commit / hướng dẫn git:
   - Command này KHÔNG tự động commit hoặc push trừ khi user yêu cầu rõ ràng.
   - Hướng dẫn commit mẫu:

```
git add specs/<pbi>/tasks.md specs/<pbi>/test-case.md
git commit -m "chore(<pbi>): add tasks and test cases generated from plan/spec"
```

Hướng dẫn chi tiết cho implementer (yêu cầu kỹ thuật khi triển khai command):

- Gọi agent `tech-lead` và `qc` song song: dùng `functions.task` hai lần trong một call `multi_tool_use.parallel` (nếu implementer hỗ trợ), hoặc gọi hai `functions.task` không phụ thuộc.
- Đảm bảo truyền nội dung file `plan.md` và `spec.md` (đã đọc bằng `functions.read`) vào prompt của agent để agent có đủ ngữ cảnh.
- Lưu kết quả trả về từ từng agent vào tệp đúng đường dẫn `specs/<pbi>/tasks.md` và `specs/<pbi>/test-case.md`.
- Khi chạy review, truyền nội dung file và yêu cầu trạng thái review rõ ràng (APPROVED / REQUEST_CHANGES) cùng feedback có cấu trúc (mức độ severity, mô tả, dòng/section liên quan nếu có).
- Nếu bất kỳ reviewer trả về REQUEST_CHANGES, tự động gửi feedback đó về cho tác nhân tương ứng (`tech-lead` hoặc `qc`) để sửa. Lặp lại cho đến khi reviewer trả về APPROVED.

Yêu cầu định dạng output từ agents (bắt buộc):

- Đầu file phải có metadata rõ ràng, ví dụ:

```
PBI: 123
Source: specs/123/plan.md
Status: DRAFT
```

- File `tasks.md` phải chứa ít nhất 5 field cho mỗi task: id, title, description, estimate (giờ), dependencies.
- File `test-case.md` phải chứa test case id, title, steps, expected result, priority.

Ghi chú cuối:

- File command này mô tả hành vi; khi implement, hãy dùng `functions.task` với `subagent_type` tương ứng: `tech-lead`, `qc`, `solution-architect`, `qc-lead`.
- Quy trình review là một vòng lặp: generate -> review -> feedback -> fix -> review cho đến khi APPROVED. Người triển khai nên đảm bảo timeout / max iterations hợp lý và báo lỗi cho user nếu vượt quá giới hạn (ví dụ 5 vòng).

(End of file)
