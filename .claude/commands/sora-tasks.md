#!/bin/bash

# Bao gồm: đọc CLAUDE.md và constitution.md ở gốc repository trước
# Luôn đọc file CLAUDE.md ở cấp repository và file constitution.md ở gốc repository trước khi thực hiện bất kỳ hành động nào.
# Agents (đại lý) nên sử dụng công cụ Read để mở các file này và tuân thủ mọi quy tắc hoặc thông tin được liệt kê trong đó.

# /sora-tasks
# Thực hiện bước TASKS từ plan.md

## Cú pháp
# /sora-tasks <pbi_id> [nội dung mô tả bổ sung]
## Ví dụ: /sora-tasks 003 Xác nhận yêu cầu bổ sung cho tasks

# Kiểm tra argument
if [ -z "$1" ]; then
    echo "❌ ERROR: Cần cung cấp mã PBI"
    echo "Ví dụ: /sora-tasks 003 Xác nhận yêu cầu bổ sung"
    exit 1
fi

# Lấy mã PBI và nội dung bổ sung
PBI_ID="$1"
shift
ADDITIONAL_NOTES="$@"

echo "📝 Bắt đầu thực hiện TASKS..."
echo "   Mã PBI: $PBI_ID"
if [ -n "$ADDITIONAL_NOTES" ]; then
    echo "   Nội dung bổ sung: $ADDITIONAL_NOTES"
fi

# Xác định thư mục spec
SPEC_FOLDER="specs/${PBI_ID}"
SPEC_FILE="${SPEC_FOLDER}/spec.md"
PLAN_FILE="${SPEC_FOLDER}/plan.md"

# Kiểm tra file spec.md có tồn tại không
if [ ! -f "$SPEC_FILE" ]; then
    echo "❌ ERROR: Không tìm thấy file spec.md tại $SPEC_FILE"
    echo "Vui lòng chạy /sora-specify trước hoặc kiểm tra lại mã PBI"
    exit 1
fi

# Kiểm tra file plan.md có tồn tại không
if [ ! -f "$PLAN_FILE" ]; then
    echo "❌ ERROR: Không tìm thấy file plan.md tại $PLAN_FILE"
    echo "Vui lòng chạy /sora-plan trước hoặc kiểm tra lại mã PBI"
    exit 1
fi

echo "📁 Tìm thấy spec.md tại: $SPEC_FILE"
echo "📁 Tìm thấy plan.md tại: $PLAN_FILE"

# Đọc branch từ file spec.md
BRANCH_FROM_SPEC=$(grep -E "Branch git:|branch:" "$SPEC_FILE" | head -1 | sed 's/.*Branch git: *//' | sed 's/.*branch: *//' | tr -d '\r')

if [ -z "$BRANCH_FROM_SPEC" ]; then
    echo "⚠️  Không tìm thấy branch trong spec.md, sử dụng branch mặc định"
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
    echo "   Branch hiện tại: $BRANCH_FROM_SPEC"
fi

# Chuẩn bị thông tin cho agent
echo ""
echo "🤖 Gọi agent tech-lead và qc để tạo tasks.md và test-case.md"
echo ""
echo "## Cấu hình"
echo "max_iterations: 3"
echo ""
echo "## Giai đoạn 1 — Song song tạo file"
echo "Chạy đồng thời hai agent:"
echo "- tech-lead: đọc plan.md ($PLAN_FILE), tạo tasks.md"
echo "- qc: đọc spec.md và plan.md, tạo test-case.md"
echo ""
echo "## Giai đoạn 2 — Song song review (vòng lặp, tối đa 3 lần)"
echo "Với mỗi iteration (đếm từ 1):"
echo "- solution-architect: review tasks.md → APPROVED hoặc danh sách vấn đề"
echo "- qc-lead: review test-case.md → APPROVED hoặc danh sách vấn đề"
echo ""
echo "Sau khi cả hai review xong:"
echo "- Nếu cả hai đều APPROVED → kết thúc, báo cáo thành công"
echo "- Nếu có vấn đề và iteration < 3:"
echo "  + Nếu architect có vấn đề → gửi feedback cho tech-lead để fix tasks.md"
echo "  + Nếu qc-lead có vấn đề → gửi feedback cho qc để fix test-case.md"
echo "  + Tăng iteration, quay lại review"
echo "- Nếu đã đủ 3 iterations mà vẫn còn vấn đề:"
echo "  + Dừng loop, ghi file tasks-review-issues.md"
echo ""
echo "📂 Thông tin:"
echo "   - Mã PBI: $PBI_ID"
echo "   - Thư mục: $SPEC_FOLDER"
echo "   - Branch: $BRANCH_FROM_SPEC"
echo "   - File plan: $PLAN_FILE"
if [ -n "$ADDITIONAL_NOTES" ]; then
    echo "   - Lưu ý bổ sung: $ADDITIONAL_NOTES"
fi

# Mặc định exit code 0
exit 0
