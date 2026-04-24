# Đặc tả Tính năng: [TÊN TÍNH NĂNG]

**Branch Tính năng**: `[###-ten-tinh-nang]`  
**Ngày tạo**: [NGÀY]  
**Trạng thái**: Nháp  
**Đầu vào**: Mô tả người dùng: "$ARGUMENTS"

## User Scenarios & Testing *(bắt buộc)*

<!--
  QUAN TRỌNG: User stories cần được ƯU TIÊN theo thứ tự quan trọng.
  Mỗi user story/journey phải có thể KIỂM THỬ ĐỘC LẬP - nghĩa là nếu chỉ implement MỘT trong số chúng,
  bạn vẫn có một MVP (Sản phẩm khả dụng tối thiểu) mang lại giá trị.
  
  Gán mức ưu tiên (P1, P2, P3, v.v.) cho mỗi story, P1 là quan trọng nhất.
  Mỗi story là một lát cắt chức năng độc lập có thể:
  - Phát triển độc lập
  - Kiểm thử độc lập
  - Triển khai độc lập
  - Demo cho người dùng độc lập
-->

### User Story 1 - [Tiêu đề ngắn] (Ưu tiên: P1)

[Mô tả hành trình người dùng bằng ngôn ngữ đơn giản]

**Tại sao ưu tiên này**: [Giải thích giá trị và lý do chọn mức ưu tiên]

**Kiểm thử độc lập**: [Mô tả cách kiểm thử độc lập - vd: "Có thể kiểm thử đầy đủ bằng [hành động cụ thể] và mang lại [giá trị cụ thể]"]

**Kịch bản chấp nhận**:

1. **Cho** [trạng thái ban đầu], **Khi** [hành động], **Thì** [kết quả mong đợi]
2. **Cho** [trạng thái ban đầu], **Khi** [hành động], **Thì** [kết quả mong đợi]

---

### User Story 2 - [Tiêu đề ngắn] (Ưu tiên: P2)

[Mô tả hành trình người dùng bằng ngôn ngữ đơn giản]

**Tại sao ưu tiên này**: [Giải thích giá trị và lý do chọn mức ưu tiên]

**Kiểm thử độc lập**: [Mô tả cách kiểm thử độc lập]

**Kịch bản chấp nhận**:

1. **Cho** [trạng thái ban đầu], **Khi** [hành động], **Thì** [kết quả mong đợi]

---

### User Story 3 - [Tiêu đề ngắn] (Ưu tiên: P3)

[Mô tả hành trình người dùng bằng ngôn ngữ đơn giản]

**Tại sao ưu tiên này**: [Giải thích giá trị và lý do chọn mức ưu tiên]

**Kiểm thử độc lập**: [Mô tả cách kiểm thử độc lập]

**Kịch bản chấp nhận**:

1. **Cho** [trạng thái ban đầu], **Khi** [hành động], **Thì** [kết quả mong đợi]

---

[Thêm các user stories khác nếu cần, mỗi story có mức ưu tiên]

### Trường hợp biên

<!--
  HÀNH ĐỘNG YÊU CẦU: Nội dung trong section này là placeholders.
  Điền các trường hợp biên phù hợp.
-->

- Điều gì xảy ra khi [điều kiện biên]?
- Hệ thống xử lý thế nào với [kịch bản lỗi]?

## Yêu cầu *(bắt buộc)*

<!--
  HÀNH ĐỘNG YÊU CẦU: Nội dung trong section này là placeholders.
  Điền các yêu cầu chức năng phù hợp.
-->

### Yêu cầu chức năng

- **FR-001**: Hệ thống PHẢI [khả năng cụ thể, vd: "cho phép người dùng tạo tài khoản"]
- **FR-002**: Hệ thống PHẢI [khả năng cụ thể, vd: "xác thực địa chỉ email"]  
- **FR-003**: Người dùng PHẢI có thể [tương tác chính, vd: "đặt lại mật khẩu"]
- **FR-004**: Hệ thống PHẢI [yêu cầu dữ liệu, vd: "lưu trữ tùy chọn người dùng"]
- **FR-005**: Hệ thống PHẢI [hành vi, vd: "ghi log tất cả sự kiện bảo mật"]

*Ví dụ đánh dấu yêu cầu chưa rõ:*

- **FR-006**: Hệ thống PHẢI xác thực người dùng qua [CẦN LÀM RÕ: phương thức xác thực chưa xác định - email/password, SSO, OAuth?]
- **FR-007**: Hệ thống PHẢI lưu giữ dữ liệu người dùng trong [CẦN LÀM RÕ: thời gian lưu giữ chưa xác định]

### Thực thể chính *(bao gồm nếu tính năng liên quan đến dữ liệu)*

- **[Thực thể 1]**: [Mô tả thực thể, thuộc tính chính không bao gồm chi tiết triển khai]
- **[Thực thể 2]**: [Mô tả thực thể, quan hệ với các thực thể khác]

## Tiêu chí thành công *(bắt buộc)*

<!--
  HÀNH ĐỘNG YÊU CẦU: Định nghĩa tiêu chí thành công có thể đo lường.
  Các tiêu chí này phải độc lập với công nghệ và có thể đo lường được.
-->

### Kết quả đo lường

- **SC-001**: [Chỉ số đo lường, vd: "Người dùng có thể hoàn tất tạo tài khoản trong vòng 2 phút"]
- **SC-002**: [Chỉ số đo lường, vd: "Hệ thống xử lý 1000 người dùng đồng thời không suy giảm"]
- **SC-003**: [Chỉ số hài lòng người dùng, vd: "90% người dùng hoàn thành tác vụ chính ở lần thử đầu tiên"]
- **SC-004**: [Chỉ số kinh doanh, vd: "Giảm 50% ticket hỗ trợ liên quan đến [X]"]

## Giả định

<!--
  HÀNH ĐỘNG YÊU CẦU: Nội dung trong section này là placeholders.
  Điền các giả định phù hợp dựa trên các mặc định hợp lý
  được chọn khi mô tả tính năng không xác định chi tiết cụ thể.
-->

- [Giả định về người dùng mục tiêu, vd: "Người dùng có kết nối internet ổn định"]
- [Giả định về ranh giới phạm vi, vd: "Hỗ trợ di động nằm ngoài phạm vi cho v1"]
- [Giả định về dữ liệu/môi trường, vd: "Hệ thống xác thực hiện tại sẽ được tái sử dụng"]
- [Phụ thuộc vào hệ thống/dịch vụ hiện có, vd: "Yêu cầu truy cập API hồ sơ người dùng hiện tại"]
