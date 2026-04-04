#!/bin/bash

# /sora-clarify
# Thực hiện bước CLARIFY cho spec.md hiện tại

## Cú pháp
# /sora-clarify <pbi_id> [nội dung mô tả bổ sung]
## Ví dụ: /sora-clarify 003 Xác nhận tính năng đăng nhập cần bảo mật

# Kiểm tra argument
if [ -z "$1" ]; then
    echo "❌ ERROR: Cần cung cấp mã PBI"
    echo "Ví dụ: /sora-clarify 003 Xác nhận yêu cầu bảo mật"
    exit 1
fi

# Lấy mã PBI và nội dung bổ sung
PBI_ID="$1"
shift
ADDITIONAL_NOTES="$@"

echo "📝 Bắt đầu thực hiện CLARIFY..."
echo "   Mã PBI: $PBI_ID"
if [ -n "$ADDITIONAL_NOTES" ]; then
    echo "   Nội dung bổ sung: $ADDITIONAL_NOTES"
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
echo "🤖 Gọi agent product-manager để làm rõ spec.md"
echo ""
echo "Agent cần thực hiện:"
echo "1. Review file spec.md: $SPEC_FILE"
echo "2. Làm rõ các điểm mơ hồ trong yêu cầu"
if [ -n "$ADDITIONAL_NOTES" ]; then
    echo "3. Lưu ý bổ sung: $ADDITIONAL_NOTES"
fi
echo "3. Cập nhật spec.md với clarifications"
echo "4. Báo cáo các assumption đã thực hiện"
echo ""
echo "📂 Thông tin:"
echo "   - Mã PBI: $PBI_ID"
echo "   - Thư mục: $SPEC_FOLDER"
echo "   - Branch: $BRANCH_FROM_SPEC"
echo "   - File spec: $SPEC_FILE"

# Mặc định exit code 0
exit 0
