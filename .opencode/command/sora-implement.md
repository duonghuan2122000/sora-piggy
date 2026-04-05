#!/bin/bash

# Bao gồm: đọc AGENTS.md và constitution.md ở gốc repository trước

# Luôn đọc file AGENTS.md ở cấp repository và file constitution.md ở gốc repository trước khi thực hiện bất kỳ hành động nào.

# Agents (đại lý) nên sử dụng công cụ Read để mở các file này và tuân thủ mọi quy tắc hoặc thông tin được liệt kê trong đó.

# /sora-implement

# Thực hiện bước IMPLEMENT

## Cú pháp

# /sora-implement <pbi_id> [task_id]

# /sora-implement <pbi_id> [nội dung mô tả bổ sung]

## Ví dụ: /sora-implement 003

## Ví dụ: /sora-implement 003 task-001

# Kiểm tra argument

if [ -z "$1" ]; then
echo "❌ ERROR: Cần cung cấp mã PBI"
echo "Ví dụ: /sora-implement 003"
echo "Ví dụ: /sora-implement 003 task-001"
exit 1
fi

# Lấy mã PBI

PBI_ID="$1"
shift
TASK_ID="$@"

echo "📝 Bắt đầu thực hiện IMPLEMENT..."
echo " Mã PBI: $PBI_ID"
if [ -n "$TASK_ID" ]; then
echo " Task ID: $TASK_ID"
fi

# Xác định thư mục spec

SPEC_FOLDER="specs/${PBI_ID}"
SPEC_FILE="${SPEC_FOLDER}/spec.md"
TASKS_FILE="${SPEC_FOLDER}/tasks.md"
TEST_CASE_FILE="${SPEC_FOLDER}/test-case.md"

# Kiểm tra file spec.md có tồn tại không

if [ ! -f "$SPEC_FILE" ]; then
echo "❌ ERROR: Không tìm thấy file spec.md tại $SPEC_FILE"
echo "Vui lòng chạy /sora-specify trước hoặc kiểm tra lại mã PBI"
exit 1
fi

# Kiểm tra file tasks.md có tồn tại không

if [ ! -f "$TASKS_FILE" ]; then
echo "❌ ERROR: Không tìm thấy file tasks.md tại $TASKS_FILE"
echo "Vui lòng chạy /sora-tasks trước hoặc kiểm tra lại mã PBI"
exit 1
fi

echo "📁 Tìm thấy spec.md tại: $SPEC_FILE"
echo "📁 Tìm thấy tasks.md tại: $TASKS_FILE"

# Đọc branch từ file spec.md

BRANCH_FROM_SPEC=$(grep -E "Branch git:|branch:" "$SPEC_FILE" | head -1 | sed 's/._Branch git: _//' | sed 's/._branch: _//' | tr -d '\r')

if [ -z "$BRANCH_FROM_SPEC" ]; then
echo "⚠️ Không tìm thấy branch trong spec.md, sử dụng branch mặc định"
BRANCH_FROM_SPEC="feature/${PBI_ID}"
fi

echo "🌿 Đọc branch từ spec.md: $BRANCH_FROM_SPEC"

# Switch sang branch

echo "🔄 Switch sang branch: $BRANCH_FROM_SPEC"
git checkout "$BRANCH_FROM_SPEC" 2>/dev/null

if [ $? -eq 0 ]; then
echo "✅ Đã switch sang branch: $BRANCH_FROM_SPEC"
else
    echo "⚠️  Không thể switch sang branch, sử dụng branch hiện tại"
    BRANCH_FROM_SPEC=$(git branch --show-current)
echo " Branch hiện tại: $BRANCH_FROM_SPEC"
fi

# Chuẩn bị thông tin cho agent

echo ""
echo "🤖 Gọi agent dev để implement tasks"
echo ""
echo "## Cấu hình"
echo "max_review_iterations: 3"
echo ""
echo "## Chuẩn bị"
echo "Đọc tasks.md ($TASKS_FILE):"
if [ -n "$TASK_ID" ]; then
echo "- Có Task ID cụ thể: $TASK_ID → chỉ xử lý task đó"
else
echo "- Không có Task ID → lấy tất cả task có Status 'Todo'"
fi
echo ""
echo "## Với mỗi task — thực hiện tuần tự"
echo "### Bước A — Generate"
echo "Gọi agent dev với context:"
echo "- Nội dung task từ tasks.md"
echo "- Các test cases liên quan từ test-case.md"
echo "- Codebase hiện tại (nếu có)"
echo ""
echo "Agent dev phải:"
echo "1. Generate code implementation"
echo "2. Generate unit tests tương ứng với test cases trong test-case.md"
echo "3. Báo cáo danh sách file đã tạo/sửa"
echo ""
echo "### Bước B — Review song song (vòng lặp, tối đa 3 lần)"
echo "Với mỗi review_iteration (đếm từ 1):"
echo "Chạy đồng thời:"
echo "- qc: chạy unit tests, đối chiếu test case trong test-case.md → PASSED hoặc danh sách failed"
echo "- solution-architect: review code → APPROVED hoặc danh sách vấn đề"
echo ""
echo "Sau khi cả hai xong:"
echo "- Nếu QC PASSED và Architect APPROVED → chuyển sang Bước C"
echo "- Nếu có vấn đề và review_iteration < 3:"
echo " + Tổng hợp feedback từ QC và Architect thành report"
echo " + Gửi report cho dev để fix"
echo " + Tăng review_iteration, quay lại review"
echo "- Nếu đã đủ 3 iterations mà vẫn còn vấn đề:"
echo " + Dừng loop, ghi vấn đề vào implement-issues.md"
echo " + Đánh dấu task Status '⚠ Needs Manual Review'"
echo ""
echo "### Bước C — Checkpoint (ngay lập tức sau khi task passed)"
echo "Ngay khi task được QC PASSED + Architect APPROVED:"
echo "1. Cập nhật tasks.md: Đổi Status Todo → Done, thêm Checkpoint"
echo "2. Cập nhật test-case.md: Đổi Status Pending → Passed, thêm Actual Result"
echo ""
echo "📂 Thông tin:"
echo " - Mã PBI: $PBI_ID"
echo " - Task ID: ${TASK_ID:-Tất cả task}"
echo " - Thư mục: $SPEC_FOLDER"
echo " - Branch: $BRANCH_FROM_SPEC"
echo " - File tasks: $TASKS_FILE"
echo " - File test-case: $TEST_CASE_FILE"

# Mặc định exit code 0

## Ghi chú về commit

# Sau khi hoàn thành tất cả tasks:

# - Bạn cần tự commit các file đã thay đổi

# - Sử dụng: `git add .` và `git commit -m "PBI_ID: Mô tả commit"`

# - Hoặc dùng kèm với /sora-commit để tự động commit

exit 0
