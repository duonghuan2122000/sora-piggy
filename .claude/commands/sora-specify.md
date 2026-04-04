#!/bin/bash

# /sora-specify
# Thực hiện bước SPECIFY cho yêu cầu với format mới

## Cú pháp
# /sora-specify <pbi_id> <yêu_cầu>
## Ví dụ: /sora-specify 003 Tạo tính năng đăng nhập bằng email

# Kiểm tra argument
if [ -z "$1" ]; then
    echo "❌ ERROR: Cần cung cấp mã PBI (số) và mô tả yêu cầu"
    echo "Ví dụ: /sora-specify 003 Tạo tính năng đăng nhập"
    exit 1
fi

# Lấy mã PBI và tóm tắt
PBI_ID="$1"
shift
REQUIREMENT_SUMMARY="$@"

echo "📝 Bắt đầu thực hiện SPECIFY..."
echo "   Mã PBI: $PBI_ID"
echo "   Yêu cầu: $REQUIREMENT_SUMMARY"

# Tạo tóm tắt ngắn gọn (không dấu, không ký tự đặc biệt) cho branch
SUMMARY_NO_ACCENT=$(python3 -c "
import sys

def remove_accents(text):
    accents = {
        'áàảãạâấầẩẫậăắằẳẵặ': 'a',
        'éèẻẽẹêếềểễệ': 'e',
        'íìỉĩị': 'i',
        'óòỏõọôốồổỗộơớờởỡợ': 'o',
        'úùủũụưứừửữự': 'u',
        'ýỳỷỹỵ': 'y',
        'đ': 'd',
    }
    
    result = text.lower()
    for chars, replacement in accents.items():
        for char in chars:
            result = result.replace(char, replacement)
    
    return result

text = '$REQUIREMENT_SUMMARY'
print(remove_accents(text))
")

# Thay thế ký tự đặc biệt bằng dấu gạch ngang
SUMMARY_NO_SPECIAL=$(echo "$SUMMARY_NO_ACCENT" | tr -c '[:alnum:]-' '-' | tr -s '-')

# Xóa dấu gạch ngang đầu/cuối
SUMMARY_NO_LEADING_DASH=$(echo "$SUMMARY_NO_SPECIAL" | sed 's/^-//')
SUMMARY_NO_TRAILING_DASH=$(echo "$SUMMARY_NO_LEADING_DASH" | sed 's/-$//')

# Giới hạn độ dài (max 20 ký tự)
if [ ${#SUMMARY_NO_TRAILING_DASH} -gt 20 ]; then
    SUMMARY_NO_TRAILING_DASH="${SUMMARY_NO_TRAILING_DASH:0:20}"
    SUMMARY_NO_TRAILING_DASH=$(echo "$SUMMARY_NO_TRAILING_DASH" | sed 's/-$//')
fi

# Tạo tên folder chỉ sử dụng mã PBI
FOLDER_NAME="${PBI_ID}"
FULL_PATH="specs/${FOLDER_NAME}"

# Tạo tên branch với mã PBI và tóm tắt
BRANCH_NAME="feature/${PBI_ID}-${SUMMARY_NO_TRAILING_DASH}"

echo "📁 Tạo thư mục: $FULL_PATH"
echo "🌿 Tạo branch: $BRANCH_NAME"

# Bước 1: Tạo thư mục trong specs/
if [ ! -d "specs" ]; then
    mkdir -p "specs"
    echo "✅ Đã tạo thư mục specs/"
fi

if [ -d "$FULL_PATH" ]; then
    echo "⚠️  Thư mục $FULL_PATH đã tồn tại, sử dụng thư mục hiện có"
else
    mkdir -p "$FULL_PATH"
    echo "✅ Đã tạo thư mục: $FULL_PATH"
fi

# Bước 2: Tạo branch git
echo "🔄 Đang tạo branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Đã tạo branch: $BRANCH_NAME"
else
    echo "⚠️  Branch đã tồn tại hoặc lỗi khi tạo"
fi

# Bước 3: Tạo template spec.md với thông tin branch
SPEC_FILE="${FULL_PATH}/spec.md"
CURRENT_BRANCH=$(git branch --show-current)

cat > "$SPEC_FILE" << EOF
# SPEC: $REQUIREMENT_SUMMARY

## Thông tin PBI
- **Mã PBI**: $PBI_ID
- **Branch git**: $CURRENT_BRANCH
- **Thư mục**: $FULL_PATH

## Mô tả yêu cầu
$REQUIREMENT_SUMMARY

## Phạm vi
...

## Yêu cầu kỹ thuật
...

## acceptance criteria
...

## Ghi chú
...
EOF

echo "✅ Đã tạo template spec.md: $SPEC_FILE"

# Bước 4: Chuẩn bị thông tin cho agent
echo ""
echo "🤖 Gọi agent business-analyst để tạo spec.md"
echo ""
echo "Agent cần thực hiện:"
echo "1. Phân tích yêu cầu: $REQUIREMENT_SUMMARY"
echo "2. Cập nhật file spec.md: $SPEC_FILE"
echo "3. Báo cáo kết quả khi hoàn thành"
echo ""
echo "📂 Thư mục đích: $FULL_PATH"
echo "🌿 Branch hiện tại: $CURRENT_BRANCH"
echo "📄 File spec: $SPEC_FILE"

# Mặc định exit code 0
exit 0
