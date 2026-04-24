# Kế hoạch Triển khai: [TÍNH NĂNG]

**Branch**: `[###-ten-tinh-nang]` | **Ngày**: [NGÀY] | **Đặc tả**: [đường dẫn]
**Đầu vào**: Đặc tả tính năng từ `/specs/[###-ten-tinh-nang]/spec.md`

**Ghi chú**: Template này được điền bởi lệnh `/speckit.plan`. Xem `.specify/templates/plan-template.md` cho quy trình thực thi.

## Tổng quan

[Trích xuất từ đặc tả tính năng: yêu cầu chính + cách tiếp cận kỹ thuật từ nghiên cứu]

## Bối cảnh Kỹ thuật

<!--
  HÀNH ĐỘNG YÊU CẦU: Thay thế nội dung trong section này bằng chi tiết kỹ thuật
  cho dự án. Cấu trúc được trình bày dưới dạng hướng dẫn tham khảo.
-->

**Ngôn ngữ/Phiên bản**: [vd: Python 3.11, Swift 5.9, Rust 1.75 hoặc CẦN LÀM RÕ]  
**Thư viện chính**: [vd: FastAPI, UIKit, LLVM hoặc CẦN LÀM RÕ]  
**Lưu trữ**: [nếu có, vd: PostgreSQL, CoreData, file hoặc KHÔNG CÓ]  
**Kiểm thử**: [vd: pytest, XCTest, cargo test hoặc CẦN LÀM RÕ]  
**Nền tảng mục tiêu**: [vd: Linux server, iOS 15+, WASM hoặc CẦN LÀM RÕ]
**Loại dự án**: [vd: thư viện/cli/dịch vụ web/ứng dụng di động/trình biên dịch/ứng dụng desktop hoặc CẦN LÀM RÕ]  
**Mục tiêu hiệu năng**: [theo miền, vd: 1000 req/s, 10k dòng/giây, 60 fps hoặc CẦN LÀM RÕ]  
**Ràng buộc**: [theo miền, vd: <200ms p95, <100MB bộ nhớ, hoạt động offline hoặc CẦN LÀM RÕ]  
**Quy mô/Phạm vi**: [theo miền, vd: 10k người dùng, 1M dòng code, 50 màn hình hoặc CẦN LÀM RÕ]

## Kiểm tra Hiến pháp

*CỔNG: Phải vượt qua trước Nghiên cứu Phase 0. Kiểm tra lại sau thiết kế Phase 1.*

[Cổng được xác định dựa trên file hiến pháp]

## Cấu trúc Dự án

### Tài liệu (tính năng này)

```text
specs/[###-ten-tinh-nang]/
├── plan.md              # File này (kết quả lệnh /speckit.plan)
├── research.md          # Kết quả Phase 0 (lệnh /speckit.plan)
├── data-model.md        # Kết quả Phase 1 (lệnh /speckit.plan)
├── quickstart.md        # Kết quả Phase 1 (lệnh /speckit.plan)
├── contracts/           # Kết quả Phase 1 (lệnh /speckit.plan)
└── tasks.md             # Kết quả Phase 2 (lệnh /speckit.tasks - KHÔNG phải /speckit.plan)
```

### Mã nguồn (thư mục gốc repository)
<!--
  HÀNH ĐỘNG YÊU CẦU: Thay thế cây thư mục placeholder bên dưới bằng cấu trúc cụ thể
  cho tính năng này. Xóa các option không dùng và mở rộng cấu trúc đã chọn với
  đường dẫn thực tế (vd: apps/admin, packages/something). Kế hoạch đầu ra
  không được bao gồm nhãn Option.
-->

```text
# [XÓA NẾU KHÔNG DÙNG] Option 1: Dự án đơn (MẶC ĐỊNH)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [XÓA NẾU KHÔNG DÙNG] Option 2: Ứng dụng Web (khi phát hiện "frontend" + "backend")
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [XÓA NẾU KHÔNG DÙNG] Option 3: Di động + API (khi phát hiện "iOS/Android")
api/
└── [giống backend trên]

ios/ hoặc android/
└── [cấu trúc theo nền tảng: module tính năng, luồng UI, kiểm thử nền tảng]
```

**Quyết định Cấu trúc**: [Ghi lại cấu trúc đã chọn và tham chiếu thư mục thực tế bên trên]

## Theo dõi Độ phức tạp

> **Chỉ điền NẾU Kiểm tra Hiến pháp có vi phạm cần biện minh**

| Vi phạm | Tại sao Cần | Giải pháp Thay thế Đơn giản Bị Từ chối Vì |
|----------|------------|-------------------------------------------|
| [vd: dự án thứ 4] | [nhu cầu hiện tại] | [tại sao 3 dự án không đủ] |
| [vd: Repository pattern] | [vấn đề cụ thể] | [tại sao truy cập DB trực tiếp không đủ] |
