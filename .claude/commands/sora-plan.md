#!/bin/bash

# Bao gồm: đọc CLAUDE.md và constitution.md ở gốc repository trước

# Luôn đọc file CLAUDE.md ở cấp repository và file constitution.md ở gốc repository trước khi thực hiện bất kỳ hành động nào.

# Agents (đại lý) nên sử dụng công cụ Read để mở các file này và tuân thủ mọi quy tắc hoặc thông tin được liệt kê trong đó.

# /sora-plan

# Thực hiện bước PLAN từ spec.md đã được approve

## Cú pháp

# /sora-plan <pbi_id> [nội dung mô tả bổ sung]

## Ví dụ: /sora-plan 003 Xác nhận yêu cầu bảo mật cho giải pháp

# Kiểm tra argument

if [ -z "$1" ]; then
echo "❌ ERROR: Cần cung cấp mã PBI"
echo "Ví dụ: /sora-plan 003 Xác nhận yêu cầu bổ sung"
exit 1
fi

# Lấy mã PBI và nội dung bổ sung

PBI_ID="$1"
shift
ADDITIONAL_NOTES="$@"

echo "📝 Bắt đầu thực hiện PLAN..."
echo " Mã PBI: $PBI_ID"
if [ -n "$ADDITIONAL_NOTES" ]; then
echo " Nội dung bổ sung: $ADDITIONAL_NOTES"
fi

# Xác định thư mục spec

SPEC_FOLDER="specs/${PBI_ID}"
SPEC_FILE="${SPEC_FOLDER}/spec.md"

# Kiểm tra file spec.md có tồn tại không

if [ ! -f "$SPEC_FILE" ]; then
echo "❌ ERROR: Không tìm thấy file spec.md tại $SPEC_FILE"
echo "Vui lòng chạy /sora-specify trước hoặc kiểm tra lại mã PBI"
exit 1
fi

echo "📁 Tìm thấy spec.md tại: $SPEC_FILE"

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
echo "🤖 Gọi agent solution-architect để tạo plan.md"
echo ""
echo "Agent cần thực hiện:"
echo "1. Đọc và review file spec.md: $SPEC_FILE"
if [ -n "$ADDITIONAL_NOTES" ]; then
echo "2. Lưu ý bổ sung: $ADDITIONAL_NOTES"
fi
echo "2. Thiết kế giải pháp kỹ thuật"
echo "3. Tạo file plan.md trong: $SPEC_FOLDER/"
echo "4. Báo cáo kiến trúc đề xuất"
echo ""
echo "📂 Thông tin:"
echo " - Mã PBI: $PBI_ID"
echo " - Thư mục: $SPEC_FOLDER"
echo " - Branch: $BRANCH_FROM_SPEC"
echo " - File spec: $SPEC_FILE"

# Mặc định exit code 0

exit 0
