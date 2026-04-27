<!--
  Sync Impact Report
  ==================
  Version change: (none) → 1.0.0
  First populated version (was all placeholders).
  
  Added sections:
    - I. Chất Lượng Code
    - II. Kiểm Thử (bắt buộc, có ngưỡng đo lường)
    - III. Kiến Trúc (ràng buộc công nghệ + IPC)
    - IV. Giao Diện & Trải Nghiệm Người Dùng
    - V. Bảo Mật
    - Quản Trị Quyết Định
    - Quy Trình Phát Triển
    - Quản trị (governance, amendment procedure)
  Removed sections: None
  
  Templates requiring updates:
    - ✅ .specify/templates/tasks-template.md (testing: optional → mandatory)
  Follow-up TODOs: None
-->

# Hiến pháp Sora Piggy

## Nguyên tắc Cốt lõi

### I. Chất Lượng Code

Tuân thủ SOLID và DRY; không lặp logic ở nhiều nơi. Mỗi hàm chỉ làm một việc, không vượt quá 30 dòng. TypeScript bật strict mode, tuyệt đối không dùng kiểu `any`. Mọi thao tác bất đồng bộ PHẢI xử lý lỗi tường minh. Không để code comment-out trong commit. Các hàm cần có comment bằng tiếng Việt để thân thiện với AI và người đọc.

### II. Kiểm Thử (BẮT BUỘC)

Unit test bắt buộc cho toàn bộ tầng service và business logic. Sử dụng Jest + Testing Library cho frontend. Độ phủ test tối thiểu 80%. Không đánh dấu task hoàn thành nếu test chưa pass.

### III. Kiến Trúc

Tuân thủ kiến trúc Electron + Vue 3 (Composition API) + Pinia + Vue Router. Mọi truy vấn dữ liệu PHẢI qua IPC (`ipcMain`/`ipcRenderer`) để đảm bảo tách biệt main/renderer process. Không truy cập database trực tiếp từ renderer.

### IV. Giao Diện & Trải Nghiệm Người Dùng

Hiển thị loading indicator cho mọi thao tác kéo dài hơn 300ms. Validation form hiển thị inline, không chờ đến khi submit. Thông báo lỗi PHẢI rõ ràng, thân thiện, hỗ trợ đa ngôn ngữ (en/vi). Giao diện PHẢI phù hợp desktop trên Windows, macOS và Linux.

### V. Bảo Mật

Validate và sanitize toàn bộ dữ liệu đầu vào từ người dùng. Dùng parameterized query, tuyệt đối không nối chuỗi để tạo SQL.

## Quản Trị Quyết Định

Ưu tiên thư viện đã có hơn tự viết lại từ đầu. Khi không chắc chắn, hỏi lại thay vì tự suy đoán. Không thêm thư viện mới mà không có lý do rõ ràng. Thay đổi ảnh hưởng đến nghiệp vụ lớn PHẢI thảo luận trước khi thực hiện.

## Quy Trình Phát Triển

Mỗi tính năng triển khai theo quy trình: Specify → Clarify → Plan → Tasks → Implement. Chạy `typecheck && lint && test` trước mỗi commit. Chạy impact analysis (GitNexus) trước khi sửa symbol. Không tự động commit/push/tạo PR — chờ xác nhận từ người dùng. Commit message theo format `<type>(<scope>): <description>`.

## Quản trị

Hiến pháp này thay thế mọi thực hành trước đó khi có xung đột. Mọi PR/review PHẢI xác minh tuân thủ hiến pháp. Sửa đổi hiến pháp yêu cầu tài liệu hóa lý do, phê duyệt, và cập nhật phiên bản. Phiên bản tuân theo semver: MAJOR cho thay đổi nguyên tắc phá vỡ, MINOR cho bổ sung nguyên tắc mới, PATCH cho làm rõ/sửa lỗi chính tả.

**Phiên bản**: 1.0.0 | **Phê chuẩn**: 2026-04-27 | **Sửa đổi lần cuối**: 2026-04-27
