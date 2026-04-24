# Hiến pháp [TÊN DỰ ÁN]
<!-- Ví dụ: Hiến pháp Đặc tả, Hiến pháp Quy trình, v.v. -->

## Nguyên tắc Cốt lõi

### [TÊN_NGUYÊN_TẮC_1]
<!-- Ví dụ: I. Thư viện-Trước -->
[MÔ TẢ_NGUYÊN_TẮC_1]
<!-- Ví dụ: Mọi tính năng bắt đầu như một thư viện độc lập; Thư viện phải tự chứa, có thể kiểm thử độc lập, có tài liệu; Mục đích rõ ràng - không có thư viện chỉ để tổ chức -->

### [TÊN_NGUYÊN_TẮC_2]
<!-- Ví dụ: II. Giao diện CLI -->
[MÔ TẢ_NGUYÊN_TẮC_2]
<!-- Ví dụ: Mọi thư viện暴露 chức năng qua CLI; Giao thức text in/out: stdin/args → stdout, lỗi → stderr; Hỗ trợ định dạng JSON + con người đọc được -->

### [TÊN_NGUYÊN_TẮC_3]
<!-- Ví dụ: III. Kiểm thử-Trước (KHÔNG THƯƠNG LƯỢNG) -->
[MÔ TẢ_NGUYÊN_TẮC_3]
<!-- Ví dụ: TDD bắt buộc: Viết kiểm thử → Người dùng phê duyệt → Kiểm thử thất bại → Sau đó triển khai; Chu trình Red-Green-Refactor được thực thi nghiêm ngặt -->

### [TÊN_NGUYÊN_TẮC_4]
<!-- Ví dụ: IV. Kiểm thử Tích hợp -->
[MÔ TẢ_NGUYÊN_TẮC_4]
<!-- Ví dụ: Các lĩnh vực cần kiểm thử tích hợp: Kiểm thử contract thư viện mới, Thay đổi contract, Giao tiếp liên dịch vụ, Schema dùng chung -->

### [TÊN_NGUYÊN_TẮC_5]
<!-- Ví dụ: V. Quan sát được, VI. Phiên bản & Thay đổi Phá vỡ, VII. Đơn giản -->
[MÔ TẢ_NGUYÊN_TẮC_5]
<!-- Ví dụ: I/O text đảm bảo khả năng gỡ lỗi; Log có cấu trúc bắt buộc; Hoặc: Định dạng MAJOR.MINOR.BUILD; Hoặc: Bắt đầu đơn giản, nguyên tắc YAGNI -->

## [TÊN_MỤC_2]
<!-- Ví dụ: Ràng buộc Bổ sung, Yêu cầu Bảo mật, Tiêu chuẩn Hiệu năng, v.v. -->

[NỘI_DUNG_MỤC_2]
<!-- Ví dụ: Yêu cầu công nghệ, tiêu chuẩn tuân thủ, chính sách triển khai, v.v. -->

## [TÊN_MỤC_3]
<!-- Ví dụ: Quy trình Phát triển, Quy trình Xem xét, Cổng Chất lượng, v.v. -->

[NỘI_DUNG_MỤC_3]
<!-- Ví dụ: Yêu cầu review code, cổng kiểm thử, quy trình phê duyệt triển khai, v.v. -->

## Quản trị
<!-- Ví dụ: Hiến pháp thay thế mọi thực hành khác; Sửa đổi yêu cầu tài liệu, phê duyệt, kế hoạch di chuyển -->

[QUY_TẮC_QUẢN_TRỊ]
<!-- Ví dụ: Mọi PR/review phải xác minh tuân thủ; Độ phức tạp phải được biện minh; Sử dụng [FILE_HƯỚNG_DẪN] cho hướng dẫn phát triển runtime -->

**Phiên bản**: [PHIÊN_BẢN_HIẾN_PHÁP] | **Phê chuẩn**: [NGÀY_PHÊ_CHUẨN] | **Sửa đổi lần cuối**: [NGÀY_SỬA_ĐỔI_CUỐI]
<!-- Ví dụ: Phiên bản: 2.1.1 | Phê chuẩn: 2025-06-13 | Sửa đổi lần cuối: 2025-07-16 -->
