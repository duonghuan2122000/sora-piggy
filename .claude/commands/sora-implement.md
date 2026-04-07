---
name: sora-implement
description: 'Command để thực hiện bước IMPLEMENT cho các task trong tasks.md. Cú pháp: /sora-implement <<product backlog item hoặc task id (tuỳ chọn)>> <<Mô tả thêm nếu có>>'
---

# sora-implement

Task ID (nếu có): $ARGUMENTS

Mục đích: Tự động hoá bước IMPLEMENT cho một hoặc nhiều task được liệt kê trong `tasks.md`.

Cú pháp chạy:

```
/sora-implement <<product backlog item hoặc task id (tuỳ chọn)>> <<Mô tả thêm nếu có>>
```

Ví dụ:

```
/sora-implement 123 "Triển khai API đăng nhập OTP"
```

Hành vi của command (tóm tắt):

- Đọc `tasks.md` và lọc các task có trạng thái `Todo` (chưa hoàn thành).
- Nếu user chỉ định một task (Task ID hoặc PBI) qua argument, chỉ xử lý task đó — nếu không tồn tại hoặc không có trạng thái `Todo`, báo cho user và dừng hoặc hỏi xác nhận tiếp tục.
- Với mỗi task cần thực hiện, thực hiện workflow lặp gồm các bước: gọi agent `dev` để generate code + unit tests; sau khi `dev` trả về, chạy song song `qc` (chạy test & verify test-case.md) và `solution-architect` (review code); nếu có vấn đề gửi feedback tổng hợp cho `dev` để sửa; lặp đến khi QC passed và Architect approved.
- Cập nhật checkpoint (status / note / checkpoint) vào `tasks.md` và cập nhật `test-case.md` tương ứng trong repo.
- Tổng hợp báo cáo hoàn tất sau khi xử lý xong tất cả task được chọn.

Luồng chi tiết (Implementer guidance):

1. Đọc và lọc tasks
   - Mở file `tasks.md` ở repository root.
   - Parse các mục task; mỗi task phải có ít nhất: id, title, description (tuỳ chọn), status (Todo/In Progress/Done), và optional: spec path hoặc liên kết tới spec/plan.
   - Lọc các task có `status: Todo`. Nếu command được gọi với argument Task ID, chỉ chọn task đó (kiểm tra tồn tại và trạng thái). Nếu argument không hợp lệ, thông báo lỗi cho user.

2. Chuẩn bị môi trường cho task
   - Trích xuất metadata quan trọng cho mỗi task: id, title, branch (nếu có), spec path, liên quan tới file `specs/<pbi>/`.
   - Nếu task có branch trong metadata, hướng dẫn hoặc kiểm tra branch đã checkout; nếu không, đề xuất name branch: `feature/<id>-<short-summary>`.
   - Luôn cảnh báo user trước khi checkout nếu workspace không sạch (unstaged/uncommitted changes). Command có thể chỉ hướng dẫn lệnh git hoặc thực thi tuỳ cấu hình — mặc định không tự động commit/push.

3. Gọi agent `dev` để generate code + unit tests
   - Sử dụng `functions.task` với `subagent_type: "dev"`.
   - Prompt nên bao gồm (tiếng Việt):
     - Task ID và tiêu đề
     - Nội dung liên quan từ `tasks.md` và `specs/<pbi>/spec.md` hoặc `plan.md` nếu có
     - Yêu cầu output rõ ràng:
       1. Các file code mới/đã sửa (đường dẫn và nội dung)
       2. Unit tests (đường dẫn, framework expected, ví dụ test input/output)
       3. Hướng dẫn chạy tests (câu lệnh) và dependencies nếu cần
       4. Checklist các điểm cần review (performance, security, edge-cases)
     - Yêu cầu agent trả về JSON/Markdown gồm: `code_changes` (list of {path, content}), `tests` (list), `run_commands` (list), `notes` (string).

4. Áp dụng code do `dev` trả về
   - Lưu file vào repository theo `code_changes` do agent trả về. (Implementer có thể tự động write file bằng tools phù hợp.)
   - Không tự động commit trừ khi user yêu cầu rõ ràng. Gợi ý commit message: `feat(implement): <task-id> <short-title>` hoặc `test: add unit tests for <task-id>`.

5. Chạy song song QC và Architecture review
   - Sau khi mã nguồn và unit tests đã được lưu, gọi song song hai agents:
     - `functions.task` với `subagent_type: "qc"` — nhiệm vụ: chạy test suite, verify `test-case.md`, produce test results and list of failing tests and flaky notes.
     - `functions.task` với `subagent_type: "solution-architect"` — nhiệm vụ: review code changes for architectural/regression/risk issues and return approval status plus review notes.
   - Khuyến nghị thực hiện hai tác vụ song song (Multi-tool parallel) để tiết kiệm thời gian.

6. Xử lý kết quả review
   - `qc` trả về: `status` (passed/failed), `failing_tests` (list), `log` (string), và `test-case-updates` (nếu cần cập nhật `test-case.md`).
   - `solution-architect` trả về: `approval` (approved / changes-requested), `notes` (list of issues), `severity` (per issue).
   - Nếu QC passed AND Architect approved -> mark task complete.
   - Nếu QC failed OR Architect requested changes:
     1. Tổng hợp feedback: failure logs + architect notes + suggested fixes.
     2. Gọi lại agent `dev` (subagent_type: "dev") kèm feedback để sửa code/tests. Yêu cầu `dev` trả về updated `code_changes` và `tests`.
     3. Lặp về bước 4 (áp dụng), rồi bước 5.

7. Lặp tới khi QC passed và Architect approved
   - Giới hạn vòng lặp: nên có một ngưỡng mặc định (ví dụ 8 iterations) để tránh vòng lặp vô hạn; nếu vượt ngưỡng, tạm dừng và thông báo cho user để can thiệp thủ công.

8. Cập nhật checkpoints và files
   - Khi task được chấp nhận:
     - Cập nhật `tasks.md`: thay `status: Todo` -> `status: Done` (hoặc `In Review` nếu team dùng bước khác) và thêm checkpoint note: timestamp, commit hashes (nếu commit), test results summary, architect reviewer id.
     - Cập nhật `test-case.md` theo `qc` feedback/updates (nếu `qc` trả về `test-case-updates`, áp dụng chúng hoặc ghi chúng vào file và tạo metadata `Updated-By: qc`).
   - Nếu để lại TODOs / follow-ups, thêm mục con trong `tasks.md` hoặc tạo một mục mới với tag `requires-approval`.

9. Báo cáo tổng kết
   - Sau khi xử lý xong toàn bộ task được chỉ định, command in/hiển thị một báo cáo tóm tắt bằng tiếng Việt gồm:
     - Danh sách task đã xử lý và trạng thái cuối cùng (Done / Failed / Needs Manual Review)
     - Kết quả test tổng hợp (passed/failed count)
     - Commit hashes hoặc file changes (nếu có)
     - Vấn đề còn tồn (nếu có) và đề xuất bước tiếp theo

Yêu cầu khi gọi agents (implementer notes kỹ thuật):

- Khi gọi agent `dev`: dùng `functions.task` với `subagent_type: "dev"`. Truyền prompt chi tiết (như phần 3). Yêu cầu agent trả về cấu trúc máy có thể parse (JSON hoặc Markdown có section rõ ràng) gồm `code_changes`, `tests`, `run_commands`, `notes`.
- Khi gọi agent `qc`: dùng `functions.task` với `subagent_type: "qc"`. Truyền: repo state (file diffs hoặc path to changed files), test run commands. Yêu cầu trả về structured result gồm `status`, `failing_tests`, `logs`, `test-case-updates`.
- Khi gọi agent `solution-architect`: dùng `functions.task` với `subagent_type: "solution-architect"`. Truyền: code changes, diff, and context (spec/plan). Yêu cầu trả về `approval` and `notes` and `suggested_changes`.

Quy tắc commit / git

- Command KHÔNG tự động commit hoặc push trừ khi user yêu cầu. Nếu tự động commit được bật, cần hỏi user xác nhận trước khi tạo commit; commit message phải ngắn gọn và mô tả task id.
- Khi cập nhật `tasks.md` hoặc `test-case.md`, commit những thay đổi này với message: `chore(tasks): update checkpoint for <task-id>`.

Handling errors và timeouts

- Nếu một agent không phản hồi hoặc trả về lỗi, ghi log và thông báo cho user, tạm dừng quy trình cho task đó.
- Nếu quá nhiều vòng lặp sửa (ví dụ >8), dừng và thông báo user cần can thiệp.

Ví dụ prompt mẫu cho agent `dev` (tiếng Việt):

```
Bạn là agent dev. Task: <task-id> - <title>
Input:
- Nội dung task: <tóm tắt từ tasks.md>
- Spec/Plan: <nội dung tóm tắt hoặc đường dẫn specs/...>

Yêu cầu output (định dạng JSON):
{
  "code_changes": [{"path": "src/...", "content": "..."}],
  "tests": [{"path": "tests/...", "content": "..."}],
  "run_commands": ["npm run test -- <filter>"],
  "notes": "Chuỗi mô tả bổ sung"
}
```

Ví dụ prompt mẫu cho agent `qc` (tiếng Việt):

```
Bạn là agent qc. Hãy chạy test suite cho các thay đổi được cung cấp. Input:
- Changed files diff or file list
- Run commands: [...]

Yêu cầu output (JSON): {"status": "passed|failed", "failing_tests": [...], "logs": "...", "test-case-updates": [{"path": "test-case.md", "patch": "..."}]}
```

Ví dụ prompt mẫu cho agent `solution-architect` (tiếng Việt):

```
Bạn là solution-architect. Hãy review thay đổi code sau và trả về approval status.
Input:
- Changed files (diff or file list)
- Spec/Plan content

Yêu cầu output (JSON): {"approval": "approved|changes-requested", "notes": [{"file": "..", "line": 123, "issue": "...", "severity": "low|medium|high"}], "suggested_changes": "..."}
```

Gợi ý implement chi tiết cho developer của command:

- Dùng `functions.read` để đọc `tasks.md` và `test-case.md`.
- Dùng `functions.task` để gọi các agents: `dev`, `qc`, `solution-architect`.
- Khi chạy `qc` và `solution-architect`, dùng `multi_tool_use.parallel` để gọi song song hai `functions.task`.
- Sử dụng `apply_patch` (hoặc tương đương) để lưu file code và cập nhật `tasks.md` / `test-case.md`.
- Luôn giữ mọi giao tiếp bằng tiếng Việt.

Limitations và cảnh báo:

- Command giả định rằng agents `dev`, `qc`, `solution-architect` có khả năng hiểu prompt chi tiết và trả về cấu trúc có thể parse; nếu agent không tuân theo định dạng, implementer phải thêm bước xử lý lỗi/parse.
- Không cố gắng tự động push lên remote trừ khi user yêu cầu rõ ràng.
- Khi thay đổi có tác động lớn (migrations, schema changes), command nên tách phần đó thành task `requires-approval` và không tự động apply database migrations.

Kết luận:

File này mô tả hành vi command `sora-implement`. Implementer cần gọi `functions.task` với `subagent_type` tương ứng (`dev`, `qc`, `solution-architect`), dùng `multi_tool_use.parallel` để song song hoá các bước review, và cập nhật `tasks.md` + `test-case.md` khi hoàn tất. Sau khi chạy xong, command trả về báo cáo tổng kết bằng tiếng Việt.
