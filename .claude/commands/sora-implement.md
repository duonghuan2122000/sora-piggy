Thực hiện bước IMPLEMENT. Task ID cụ thể (nếu có): $ARGUMENTS

## Cấu hình

max_review_iterations: 3

## Chuẩn bị

Đọc `tasks.md`:

- Nếu $ARGUMENTS có Task ID cụ thể → chỉ xử lý task đó
- Nếu không → lấy tất cả task có Status "Todo", sắp xếp theo Priority và Depends on

## Với mỗi task — thực hiện tuần tự

### Bước A — Generate

Gọi agent `dev` với context:

- Nội dung task từ `tasks.md`
- Các test cases liên quan từ `test-case.md` (map theo Task ID hoặc tên feature)
- Codebase hiện tại (nếu có)

Agent `dev` phải:

1. Generate code implementation
2. Generate unit tests tương ứng với test cases trong `test-case.md`
3. Báo cáo danh sách file đã tạo/sửa

### Bước B — Review song song (vòng lặp, tối đa 3 lần)

Với mỗi review_iteration (đếm từ 1):

Chạy đồng thời:

- `qc`: chạy unit tests, đối chiếu từng test case trong `test-case.md`
  → trả về: PASSED hoặc danh sách test case failed + lý do
- `solution-architect`: review code vừa được generate
  → trả về: APPROVED hoặc danh sách vấn đề (code smell, security, design)

Sau khi cả hai xong:

**Nếu QC PASSED và Architect APPROVED** → chuyển sang Bước C.

**Nếu có vấn đề** và review_iteration < 3:

- Tổng hợp toàn bộ feedback từ QC và Architect thành một report
- Gửi report cho `dev` để fix
- `dev` fix xong báo cáo danh sách thay đổi
- Tăng review_iteration, quay lại review

**Nếu đã đủ 3 review_iterations mà vẫn còn vấn đề**:

- Dừng loop cho task này
- Ghi vấn đề vào `implement-issues.md` với format:

## Task [ID] — Unresolved after 3 iterations

### QC Issues

[danh sách]

### Architect Issues

[danh sách]

- Đánh dấu task với Status "⚠ Needs Manual Review" trong `tasks.md`
- Chuyển sang task tiếp theo

### Bước C — Checkpoint (ngay lập tức sau khi task passed)

Không chờ đến cuối. Ngay khi task được QC PASSED + Architect APPROVED:

1. Dùng Edit tool cập nhật `tasks.md`:
   - Đổi `- **Status:** [ ] Todo` → `- **Status:** [x] Done`
   - Điền `- **Checkpoint:** Completed <timestamp> — <tóm tắt 1 dòng những gì đã implement>`

2. Dùng Edit tool cập nhật `test-case.md` cho từng test case của task này:
   - Đổi `- **Status:** [ ] Pending` → `- **Status:** [x] Passed`
   - Điền `- **Actual Result:** <kết quả thực tế từ test run>`

3. Confirm checkpoint đã ghi xong trước khi chuyển task tiếp theo.

## Báo cáo tổng kết (sau khi xử lý hết các task)

### Implement Summary

- Tasks Done: X / Y
- Tasks Pending: Z (xem implement-issues.md nếu có)
- Total iterations: tổng số review iterations đã dùng
- Files changed: danh sách file code đã tạo/sửa
