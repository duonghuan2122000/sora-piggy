Thực hiện bước TASKS từ plan.md.

## Cấu hình

max_iterations: 3

## Giai đoạn 1 — Song song tạo file

Chạy đồng thời hai agent:

- `tech-lead`: đọc `plan.md`, tạo `tasks.md`
- `qc`: đọc `spec.md` và `plan.md`, tạo `test-case.md`

Chờ cả hai hoàn thành trước khi chuyển sang giai đoạn 2.

## Giai đoạn 2 — Song song review (vòng lặp, tối đa 3 lần)

Với mỗi iteration (đếm từ 1):

Chạy đồng thời:

- `solution-architect`: review `tasks.md` → trả về APPROVED hoặc danh sách vấn đề
- `qc-lead`: review `test-case.md` → trả về APPROVED hoặc danh sách vấn đề

Sau khi cả hai review xong:

**Nếu cả hai đều APPROVED** → kết thúc, báo cáo thành công.

**Nếu có vấn đề** và iteration < 3:

- Nếu architect có vấn đề → gửi feedback cho `tech-lead` để fix `tasks.md`
- Nếu qc-lead có vấn đề → gửi feedback cho `qc` để fix `test-case.md`
- Tăng iteration, quay lại review

**Nếu đã đủ 3 iterations mà vẫn còn vấn đề**:

- Dừng loop
- Ghi file `tasks-review-issues.md` với toàn bộ feedback chưa resolve
- Báo cáo: "Đã đạt max_iterations (3). Vui lòng xem `tasks-review-issues.md` và xử lý thủ công."

## Báo cáo kết thúc

Tóm tắt:

- Số iterations đã thực hiện
- Trạng thái cuối: tasks.md [APPROVED/PENDING], test-case.md [APPROVED/PENDING]
- Danh sách file đã tạo/cập nhật
