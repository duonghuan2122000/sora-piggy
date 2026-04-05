---
name: sora-tasks
description: 'Command để thực hiện bước TASKS từ plan.md. Cú pháp: /sora-tasks <<pbi>> <<mô tả thêm (nếu có)>>'
---

# sora-tasks

Mục đích: Tự động hoá bước tạo Tasks và Test Cases cho một Product Backlog Item (PBI) dựa trên `plan.md` và `spec.md`. Command sẽ chạy hai agent song song để tạo `tasks.md` và `test-case.md`, sau đó chạy hai agent khác để review song song. Nếu review yêu cầu thay đổi, gửi feedback cho agent tương ứng để sửa và lặp review tối đa 3 lần.

Cú pháp chạy:

```
/sora-tasks <<product backlog item>> <<Mô tả thêm (nếu có)>>
```

Ví dụ:

```
/sora-tasks 123 "Ưu tiên refactor module X trước"
```

Hành vi của command (tóm tắt):

- Xác thực tham số: `product backlog item` phải là số nguyên.
- Kiểm tra tồn tại `specs/<pbi>/plan.md` và `specs/<pbi>/spec.md`. Nếu file `plan.md` không tồn tại, báo lỗi và dừng. Nếu `spec.md` thiếu, vẫn tiếp tục nhưng cảnh báo rằng `test-case.md` có thể thiếu thông tin.
- Chạy song song hai agent (bằng `functions.task`):
  1. `tech-lead` (subagent_type: "tech-lead"): Tạo `tasks.md` từ nội dung `plan.md`.
  2. `qc` (subagent_type: "qc"): Tạo `test-case.md` từ `spec.md` và `plan.md`.
- Khi cả hai agent hoàn thành, chạy song song review:
  1. `solution-architect` (subagent_type: "solution-architect"): review `tasks.md` và trả về trạng thái review cùng feedback.
  2. `qc-lead` (subagent_type: "qc-lead"): review `test-case.md` và trả về trạng thái review cùng feedback.
- Nếu reviewer trả về yêu cầu thay đổi (`REQUEST_CHANGES`), gửi feedback về cho agent tạo tương ứng (`tech-lead` hoặc `qc`) để sửa file và lặp lại bước review.
- Lặp review tối đa 3 lần. Nếu sau 3 lần vẫn chưa `APPROVED`, command dừng và báo lỗi/summary cho user.

Hành vi chi tiết & hướng dẫn implementer:

1. Xác thực đầu vào
   - Nếu `product backlog item` không phải số nguyên, báo lỗi cho user và yêu cầu nhập lại.

2. Kiểm tra file cần thiết
   - Tìm `specs/<pbi>/plan.md`. Nếu không tồn tại: dừng và báo lỗi: "Không tìm thấy specs/<pbi>/plan.md — hãy chạy /sora-plan hoặc tạo plan.md trước khi chạy /sora-tasks".
   - Tìm `specs/<pbi>/spec.md`. Nếu không tồn tại: cảnh báo user nhưng vẫn cho phép `qc` agent chạy (agent có thể yêu cầu thông tin thiếu).

3. Chuẩn bị input cho agent
   - Đọc đầy đủ nội dung `plan.md` và `spec.md` (nếu có).
   - Gọi hai agent song song với `functions.task`:
     - tech-lead: `subagent_type: "tech-lead"`.
       Prompt (tiếng Việt) phải bao gồm:
       - Product Backlog Item (số) và tiêu đề/summary nếu có trong metadata.
       - Nội dung đầy đủ của `plan.md`.
       - Mô tả thêm (tham số tuỳ chọn) nếu user cung cấp.
       - Yêu cầu output: `tasks_md` (string) và `tasks_list` (mảng các task đối tượng có ít nhất: id/title/description/estimate/dependencies/assignee?/labels).
       - Định dạng mong muốn: Markdown tiếng Việt, file `tasks.md` phải có metadata header: `PBI: <pbi>`, `Plan: specs/<pbi>/plan.md`.

     - qc: `subagent_type: "qc"`.
       Prompt (tiếng Việt) phải bao gồm:
       - Product Backlog Item (số) và nội dung `spec.md` (nếu có) và `plan.md`.
       - Mô tả thêm (nếu có).
       - Yêu cầu output: `test_case_md` (string) và `test_cases` (mảng test cases: id/title/steps/preconditions/expected_result/type/regression?)
       - Định dạng mong muốn: Markdown tiếng Việt, file `test-case.md` phải có metadata header: `PBI: <pbi>`, `Spec: specs/<pbi>/spec.md`, `Plan: specs/<pbi>/plan.md`.

4. Lưu kết quả ban đầu
   - Sau khi cả hai agent trả về, ghi file:
     - `specs/<pbi>/tasks.md` chứa metadata header và nội dung `tasks_md` do `tech-lead` trả về.
     - `specs/<pbi>/test-case.md` chứa metadata header và nội dung `test_case_md` do `qc` trả về.
   - Nếu agent trả về danh sách `suggested_files`, tạo placeholder README cho mỗi suggested file (ví dụ `specs/<pbi>/architecture/README.md` ghi mô tả nơi lưu diagram).

5. Review song song và vòng feedback
   - Thực hiện review song song bằng hai `functions.task`:
     - solution-architect: `subagent_type: "solution-architect"`. Truyền `tasks.md` nội dung và yêu cầu trả về JSON/Markdown gồm: `status` ("APPROVED" hoặc "REQUEST_CHANGES"), `comments` (mảng, chi tiết), và nếu cần `suggested_edits` (patch hoặc markdown snippet) để sửa `tasks.md`.
     - qc-lead: `subagent_type: "qc-lead"`. Truyền `test-case.md` nội dung và yêu cầu trả về tương tự: `status`, `comments`, `suggested_edits`.

   - Nếu cả hai trả về `APPROVED`: kết thúc thành công, hiển thị summary ngắn (3-6 dòng) và đường dẫn tới `specs/<pbi>/tasks.md` và `specs/<pbi>/test-case.md`.

   - Nếu một trong hai trả về `REQUEST_CHANGES`:
     1. Gửi feedback (comments + suggested_edits nếu có) về cho agent tạo tương ứng:
        - Nếu `solution-architect` REQUEST_CHANGES -> gọi `tech-lead` lại (functions.task) với prompt: "Hãy sửa tasks.md theo feedback sau" + đính kèm `comments` và `suggested_edits`. Yêu cầu `tech-lead` trả về updated `tasks_md`.
        - Nếu `qc-lead` REQUEST_CHANGES -> gọi `qc` lại (functions.task) với prompt: "Hãy sửa test-case.md theo feedback sau" + đính kèm `comments` và `suggested_edits`. Yêu cầu `qc` trả về updated `test_case_md`.
     2. Ghi đè file `specs/<pbi>/tasks.md` hoặc `specs/<pbi>/test-case.md` tương ứng với nội dung cập nhật.
     3. Lặp lại bước Review cho file(s) bị yêu cầu thay đổi.

   - Giới hạn vòng lặp review: tối đa 3 lần (3 iterations). Mỗi lần lặp là: review -> nếu REQUEST_CHANGES thì gửi cho creator sửa -> creator trả về cập nhật -> review lại. Nếu sau 3 lần vẫn chưa APPROVED, command dừng và hiển thị summary gồm các comments còn tồn đọng, trạng thái final và gợi ý hành động tiếp theo cho user (ví dụ assign người review, họp sync, hoặc review thủ công).

6. Quy ước status/format giữa agents (để implementer điều chỉnh prompt rõ ràng):
   - Khi yêu cầu reviewer trả về, bắt buộc trả về object (JSON hoặc Markdown có code block JSON) với các trường:
     - status: one of ["APPROVED","REQUEST_CHANGES"]
     - comments: [{line_or_section: string, comment: string}] (mảng)
     - suggested_edits: optional string (markdown patch hoặc snippet) để creator dễ apply

   - Khi yêu cầu creator agent trả về sau khi sửa, bắt buộc trả về:
     - tasks_md / test_case_md: full markdown string
     - change_log: optional short summary các thay đổi

7. Lưu file và metadata
   - Mỗi file tạo ra `specs/<pbi>/tasks.md` và `specs/<pbi>/test-case.md` phải bắt đầu bằng header metadata ngắn, ví dụ:

```
PBI: <pbi>
Spec: specs/<pbi>/spec.md
Plan: specs/<pbi>/plan.md
```

8. Gợi ý commit (command KHÔNG tự động commit/push trừ khi user yêu cầu rõ ràng):

```
git add specs/<pbi>/tasks.md specs/<pbi>/test-case.md
git commit -m "tasks: add tasks and test cases for PBI <pbi>"
```

9. Trường hợp lỗi và thông báo cho user
   - Nếu thiếu `plan.md`: dừng và báo lỗi rõ ràng.
   - Nếu một trong các agent trả về lỗi/timeout: hiển thị lỗi agent kèm thông tin log, và hướng dẫn user cách retry (ví dụ: kiểm tra network, tăng timeout, hoặc chạy lại command).
   - Nếu đạt giới hạn 3 lần review mà vẫn chưa APPROVED: show summary và stop, KHÔNG tự động commit.

10. Ví dụ prompt tóm tắt cho implementer khi gọi functions.task
    - tech-lead prompt (viết tiếng Việt):
      "Bạn là tech-lead. Input: PBI, nội dung specs/<pbi>/plan.md, mô tả thêm. Hãy tạo file tasks.md gồm danh sách công việc chi tiết (id, title, description, estimate (h), dependencies, assignee suggestion, labels). Trả về JSON gồm: tasks_md (string), tasks_list (array)."

    - qc prompt (viết tiếng Việt):
      "Bạn là QC. Input: PBI, specs/<pbi>/spec.md (nếu có), specs/<pbi>/plan.md, mô tả thêm. Hãy tạo file test-case.md gồm test cases đầy đủ (unit/integration/e2e/acceptance) mapping đến acceptance criteria trong spec. Trả về JSON gồm: test_case_md (string), test_cases (array)."

11. Lưu ý cho implementer
    - Sử dụng `functions.task` để chạy agents; thực hiện hai tác vụ tạo song song, sau đó hai tác vụ review song song. Khi gửi feedback, gọi lại agent tương ứng. Sử dụng cơ chế retry và đếm iterations để giới hạn 3 lần review.
    - Giữ mọi output bằng tiếng Việt.
    - Không tự động push lên remote trừ khi user rõ ràng cho phép.

Kết luận:

Command `sora-tasks` tự động hoá bước chuyển Plan -> Tasks và chuẩn hoá Test Cases, tổ chức workflow song song giữa các agent (tech-lead & qc) và review (solution-architect & qc-lead) với vòng feedback có giới hạn 3 lần. File này mô tả hành vi; phần implement phải gọi `functions.task` với `subagent_type` tương ứng và thực hiện lưu/tracking các file như mô tả.

(End of file)
