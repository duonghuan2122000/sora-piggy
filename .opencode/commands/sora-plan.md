---
name: sora-plan
description: 'Command để thực hiện bước PLAN từ spec.md đã được approve. Cú pháp: /sora-plan <<pbi>> <<mô tả thêm yêu cầu kỹ thuật (nếu có)>>'
---

# sora-plan

Mục đích: Tự động hoá bước PLAN (thiết kế giải pháp kỹ thuật, lập kế hoạch triển khai) dựa trên `spec.md` đã được approve cho một Product Backlog Item (PBI). Command sẽ gọi agent `solution-architect` để tạo `plan.md` và các tệp liên quan, đồng thời báo cáo kiến trúc đề xuất.

Cú pháp chạy:

```
/sora-plan <<product backlog item>> <<mô tả thêm yêu cầu kỹ thuật (nếu có)>>
```

Ví dụ:

```
/sora-plan 123 "Sử dụng Redis cho session cache, yêu cầu tối ưu latency"
```

Hành vi của command:

- Nhận hai tham số: `product backlog item` (số nguyên) và `mô tả thêm yêu cầu kỹ thuật` (chuỗi, tuỳ chọn).
- Kiểm tra tồn tại file `specs/<pbi>/spec.md`. Nếu không tồn tại, báo lỗi và yêu cầu user tạo hoặc chỉ định đúng PBI.
- Kiểm tra metadata trong `spec.md` để đảm bảo spec đã được approve. Gợi ý: tìm từ khoá `Approved:`, `Status:` hoặc dòng tương tự (implementer có thể điều chỉnh). Nếu không thấy dấu hiệu approve, cảnh báo user và dừng (hoặc yêu cầu confirm tiếp tục).
- Trích xuất metadata quan trọng từ `spec.md`: `PBI`, `Branch` (nếu có), `Title`/Summary.
  - Nếu không tìm thấy `Branch:` trong metadata, command sẽ đề xuất tên nhánh theo mẫu `feature/<pbi>-<short-summary>`.

- Xử lý Git branch (thực hiện ngay sau khi đọc spec.md):
  - Lấy tên branch từ metadata `Branch:` trong `spec.md` (case-insensitive). Nếu có nhiều dòng `Branch:`, ưu tiên dòng xuất hiện đầu tiên.
  - Nếu không có `Branch:` trong metadata, sử dụng tên nhánh đề xuất `feature/<pbi>-<short-summary>` và hiển thị cho user trước khi tiếp tục.
  - Trước khi checkout, kiểm tra workspace git có sạch (không có thay đổi unstaged/uncommitted). Nếu workspace không sạch, cảnh báo user và yêu cầu họ stash/commit thay đổi hoặc xác nhận cho phép command tự stash.
  - Hướng dẫn hoặc thực hiện checkout:
    - Nếu implementer chọn chỉ hướng dẫn: hiển thị lệnh

```
git checkout <branch-name>
```

    - Nếu implementer hỗ trợ thực thi tự động (tuỳ cấu hình): thực hiện `git checkout <branch-name>` (thực hiện qua Bash tool). Trước khi chạy, yêu cầu xác nhận user nếu workspace bẩn.

- Nếu checkout thất bại vì branch không tồn tại, gợi ý tạo branch mới theo mẫu `git checkout -b <branch-name>` và hỏi user có muốn tạo hay không.
- Sau khi checkout thành công, tiếp tục gọi agent `solution-architect` và/hoặc lưu `plan.md` trên branch đó (nếu user muốn commit trên branch hiện tại).
- Gợi ý commit trên branch:

```
git add specs/<pbi>/plan.md [và file liên quan]
git commit -m "plan: add implementation plan for PBI <pbi>"
```

- Lưu ý: KHÔNG tự động push trừ khi user yêu cầu rõ ràng.
- Gọi agent `solution-architect` để thiết kế giải pháp kỹ thuật và tạo nội dung `plan.md`:
  - Khi gọi agent qua `functions.task`, set `subagent_type: "solution-architect"`.
  - Truyền cho agent các dữ liệu sau trong prompt (tiếng Việt):
    - Product Backlog Item (số) và tiêu đề/spec summary.
    - Nội dung đầy đủ của `specs/<pbi>/spec.md`.
    - Mô tả thêm yêu cầu kỹ thuật (nếu user cung cấp).
    - Tên nhánh git đề xuất (nếu có trong metadata) hoặc khuyến nghị tên nhánh (ví dụ `feature/<pbi>-<short-summary>`).
    - Định dạng output mong muốn: `plan.md` bằng tiếng Việt, cấu trúc bắt buộc gồm các phần: Executive Summary, Proposed Architecture (kèm sơ đồ/diagram notes), Components & Interfaces, Data Model changes (nếu có), APIs & Contracts, Non-functional Requirements (scalability, security, observability), Migration/Migration Plan (nếu cần), Implementation Tasks (phân nhỏ thành tickets/tasks có estimate), Timeline/Phases, Risks & Mitigations, Open Questions, Dependencies, Acceptance Criteria Mapping (mapping từ spec tới work items).
  - Yêu cầu thêm: agent trả về
    1. `plan.md` (markdown) hoàn chỉnh
    2. Một báo cáo kiến trúc tóm tắt (architectural report) — 1 trang ngắn gọn (có thể lặp lại một phần của plan) để dùng trong review
    3. Danh sách file/tài nguyên phụ đề xuất (ví dụ: diagram file path, migration scripts placeholder, terraform snippets) và tên các file được tạo.

- Lưu/ghi file `specs/<pbi>/plan.md` với nội dung `plan.md` do agent trả về. Nếu agent đề xuất thêm file (ví dụ `specs/<pbi>/architecture/diagram.drawio` hoặc `docs/arch/<pbi>-diagram.svg`), tạo đường dẫn placeholder kèm hướng dẫn nếu cần (có thể chỉ tạo file README hoặc TODO file chứ không bắt buộc tạo binary diagram).
- Thêm metadata lên đầu `plan.md` bao gồm ít nhất: `PBI: <pbi>`, `Spec: specs/<pbi>/spec.md`, `Branch: <branch-name hoặc recommended>`.
- Gợi ý commit (command không tự động commit trừ khi user yêu cầu):

```
git add specs/<pbi>/plan.md [và file liên quan]
git commit -m "plan: add implementation plan for PBI <pbi>"
```

Hướng dẫn chi tiết cho implementer command:

1. Xác thực đầu vào
   - Nếu `product backlog item` không phải số nguyên, thông báo lỗi.

2. Kiểm tra spec tồn tại và trạng thái approve
   - Đọc `specs/<pbi>/spec.md`.
   - Tìm các dòng metadata như `Status: approved`/`Approved: true`/`Reviewed: yes` (case-insensitive). Nếu không tìm thấy, command nên cảnh báo: "Spec chưa được approve — có muốn tiếp tục không?" và đợi xác nhận user.

3. Gọi agent `solution-architect`
   - Sử dụng `functions.task` với `subagent_type: "solution-architect"`.
   - Truyền prompt rõ ràng, kèm nội dung spec và yêu cầu output ở định dạng Markdown tiếng Việt như mô tả ở trên.
   - Yêu cầu agent trả về cấu trúc JSON/Markdown gồm: `plan_md` (string), `architecture_report` (string), `suggested_files` (list of {path, description}).

4. Lưu file
   - Tạo thư mục `specs/<pbi>/` nếu chưa có.
   - Ghi `specs/<pbi>/plan.md` với metadata header và nội dung `plan_md`.
   - Đối với mỗi `suggested_file` có thể tạo placeholder file text (ví dụ `specs/<pbi>/architecture/README.md` kèm mô tả) để ghi chú nơi sẽ lưu diagram hoặc migration scripts.

5. Output cho user
   - Hiển thị tóm tắt ngắn (3-6 dòng) của plan và link đến `specs/<pbi>/plan.md`.
   - Hiển thị báo cáo kiến trúc tóm tắt.
   - Liệt kê các task/tickets/estimates do agent tạo ra.
   - Hướng dẫn commit và tiếp tục (ví dụ: tạo branch, commit, push, tạo PR).

6. Quy tắc commit
   - Command KHÔNG tự động commit hoặc push trừ khi user rõ ràng yêu cầu.
   - Nếu implementer hỗ trợ commit tự động, phải kiểm tra workspace sạch hoặc yêu cầu user stash/commit thay vì tự động mất dữ liệu.

Gợi ý cho nội dung `plan.md` (mẫu):

```
PBI: 123
Spec: specs/123/spec.md
Branch: feature/123-optimize-session-cache

# Plan: <Title>

## Executive Summary
... (1-3 đoạn ngắn)

## Proposed Architecture
- Kiến trúc tổng quát
- Diagram notes: (mô tả sơ đồ hoặc đường dẫn tới file)

## Components & Interfaces
- Component A: responsibilities
- API contracts

## Implementation Tasks
1. Task A - estimate
2. Task B - estimate

## Risks & Mitigations
...

```

Lưu ý triển khai cho implementer command:

- Khi gọi `functions.task` cho `solution-architect`, truyền prompt chi tiết và yêu cầu agent trả về `plan_md` cùng `architecture_report` và `suggested_files` rõ ràng để implementer biết phải lưu gì vào repository.
- Nếu agent trả về nội dung rất dài hoặc có code snippets, đảm bảo ghi file nguyên vẹn và không cắt bớt.
- Nếu agent đề xuất thay đổi lớn (ví dụ: thay đổi database scheme), command nên cảnh báo user và tách phần đó vào tasks có tag `requires-approval` để người quản lý review trước khi implement.
- Giữ mọi output bằng tiếng Việt.

Ví dụ luồng tương tác mong muốn:

1. User chạy: `/sora-plan 123 "Sử dụng Redis cho session cache"`
2. Command kiểm tra `specs/123/spec.md` và thấy `Status: Approved`.
3. Command trích xuất metadata, xác định tên branch và thực hiện (hoặc hướng dẫn) `git checkout <branch>` theo quy tắc đã mô tả (kiểm tra workspace sạch, đề xuất tạo branch nếu cần).
4. Sau khi đã ở trên branch đúng, command gọi agent `solution-architect` với nội dung spec và yêu cầu tạo plan.
5. Agent trả về `plan.md`, `architecture_report`, và `suggested_files`.
6. Command lưu `specs/123/plan.md`, tạo placeholder cho file diagram, và hiển thị tóm tắt + hướng dẫn commit cho user.

Kết luận:

Command `sora-plan` giúp chuẩn hoá bước thiết kế kỹ thuật và lập kế hoạch triển khai từ spec đã approved bằng cách tận dụng agent `solution-architect`. File `sora-plan.md` này là tài liệu mô tả hành vi — phần implementer cần gọi `functions.task` với `subagent_type: "solution-architect"` và lưu lại các file mà agent trả về.

(End of file)
