# Đặc tả Tính năng: Sửa lỗi phân trang danh sách giao dịch

**Branch Tính năng**: `feature/pbi-58-transactions-phan-trang`  
**Ngày tạo**: 2026-04-27  
**Trạng thái**: Nháp  
**Đầu vào**: Mô tả người dùng: "58 Tôi có một bug trên màn hình danh sách giao dịch khi thực hiện các chức năng phân trang"

## User Scenarios & Testing

### User Story 1 - Điều hướng đến trang cụ thể (Ưu tiên: P1)

Người dùng đang ở màn hình danh sách giao dịch, muốn xem giao dịch ở một trang khác. Người dùng click vào số trang (ví dụ: trang 2) trên thanh phân trang. Hệ thống hiển thị danh sách giao dịch tương ứng với trang đã chọn.

**Tại sao ưu tiên này**: Đây là chức năng cốt lõi của phân trang - người dùng cần có thể chọn trang bất kỳ để xem dữ liệu.

**Kiểm thử độc lập**: Có thể kiểm thử bằng cách click vào từng số trang trên thanh phân trang và xác nhận danh sách giao dịch thay đổi tương ứng.

**Kịch bản chấp nhận**:

1. **Cho** màn hình danh sách giao dịch có nhiều hơn 1 trang dữ liệu, **Khi** người dùng click vào số "2" trên thanh phân trang, **Thì** danh sách hiển thị các giao dịch của trang 2 và số trang "2" được đánh dấu là đang active
2. **Cho** người dùng đang ở trang 2, **Khi** người dùng click vào số "1" trên thanh phân trang, **Thì** danh sách hiển thị các giao dịch của trang 1 và số trang "1" được đánh dấu là đang active

---

### User Story 2 - Điều hướng qua các nút Previous/Next (Ưu tiên: P1)

Người dùng muốn di chuyển tuần tự qua các trang. Người dùng click nút "Next" để sang trang tiếp theo hoặc "Previous" để quay lại trang trước.

**Tại sao ưu tiên này**: Cơ chế điều hướng cơ bản, song song với User Story 1, tạo nên trải nghiệm phân trang hoàn chỉnh.

**Kiểm thử độc lập**: Có thể kiểm thử bằng cách click nút Next/Previous và xác nhận danh sách giao dịch chuyển trang đúng.

**Kịch bản chấp nhận**:

1. **Cho** người dùng đang ở trang 1, **Khi** người dùng click nút "Next", **Thì** danh sách chuyển sang trang 2 và nút "Previous" được kích hoạt (không còn bị vô hiệu)
2. **Cho** người dùng đang ở trang cuối cùng, **Khi** người dùng click nút "Next", **Thì** không có hành động nào xảy ra (nút "Next" bị vô hiệu)
3. **Cho** người dùng đang ở trang 2, **Khi** người dùng click nút "Previous", **Thì** danh sách quay về trang 1

---

### User Story 3 - Phân trang kết hợp với bộ lọc (Ưu tiên: P2)

Người dùng áp dụng bộ lọc cho danh sách giao dịch, sau đó sử dụng phân trang để xem kết quả đã lọc trên nhiều trang.

**Tại sao ưu tiên này**: Phân trang cần hoạt động nhất quán với dữ liệu đã lọc, tránh hiển thị sai kết quả.

**Kiểm thử độc lập**: Có thể kiểm thử bằng cách áp dụng bộ lọc, sau đó phân trang qua các trang để xác nhận dữ liệu nhất quán với bộ lọc.

**Kịch bản chấp nhận**:

1. **Cho** người dùng đã áp dụng bộ lọc theo danh mục, **Khi** người dùng click sang trang 2, **Thì** danh sách trang 2 chỉ hiển thị các giao dịch thuộc danh mục đã lọc
2. **Cho** người dùng đã thay đổi bộ lọc, **Khi** danh sách được tải lại, **Thì** phân trang reset về trang 1

### Trường hợp biên

- **Trang duy nhất**: Khi danh sách giao dịch chỉ có 1 trang, thanh phân trang không hiển thị hoặc bị vô hiệu
- **Không có dữ liệu**: Khi không có giao dịch nào, thanh phân trang không xuất hiện
- **Tổng số trang thay đổi**: Khi thêm/xóa giao dịch làm thay đổi tổng số trang, thanh phân trang cập nhật tương ứng
- **Click nhanh liên tiếp**: Khi người dùng click nhiều lần vào nút Next trong thời gian ngắn, hệ thống vẫn hoạt động ổn định
- **Trang quá lớn**: Khi tổng số trang > 100, thanh phân trang hiển thị gọn gàng (ví dụ: rút gọn bằng dấu "...")
- **Xóa giao dịch cuối trang**: Khi xóa giao dịch cuối cùng của trang hiện tại, user ở lại trang đó (có thể thấy trang trống)

## Yêu cầu

### Yêu cầu chức năng

- **FR-001**: Hệ thống PHẢI cho phép người dùng click vào số trang bất kỳ trên thanh phân trang và hiển thị đúng dữ liệu của trang đó
- **FR-002**: Hệ thống PHẢI đánh dấu trạng thái active cho trang hiện tại trên thanh phân trang
- **FR-003**: Hệ thống PHẢI cho phép người dùng click nút "Next" để chuyển đến trang kế tiếp
- **FR-004**: Hệ thống PHẢI cho phép người dùng click nút "Previous" để quay lại trang trước đó
- **FR-005**: Hệ thống PHẢI vô hiệu hóa nút "Previous" khi đang ở trang 1
- **FR-006**: Hệ thống PHẢI vô hiệu hóa nút "Next" khi đang ở trang cuối cùng
- **FR-007**: Hệ thống PHẢI cập nhật tổng số trang khi dữ liệu giao dịch thay đổi
- **FR-008**: Hệ thống PHẢI reset phân trang về trang 1 khi người dùng thay đổi bộ lọc
- **FR-009**: Hệ thống PHẢI ẩn thanh phân trang khi danh sách giao dịch không có dữ liệu hoặc chỉ có 1 trang
- **FR-010**: Hệ thống PHẢI xử lý đúng khi người dùng click nhanh liên tiếp vào các nút phân trang
- **FR-011**: Hệ thống PHẢI hiện thông báo lỗi ngắn gọn và ở lại trang hiện tại nếu có lỗi xảy ra trong quá trình chuyển trang
- **FR-012**: Hệ thống PHẢI reset trang về 1 khi người dùng điều hướng ra khỏi màn hình danh sách và quay lại

### Thực thể chính

- **Transaction (Giao dịch)**: Dữ liệu chi tiêu/giao dịch của người dùng, là đối tượng chính được hiển thị trong danh sách phân trang
- **Pagination State (Trạng thái phân trang)**: Thông tin trạng thái phân trang bao gồm trang hiện tại, tổng số trang, tổng số bản ghi, kích thước trang

## Tiêu chí thành công

### Kết quả đo lường

- **SC-001**: Người dùng có thể click vào bất kỳ số trang nào và thấy danh sách giao dịch thay đổi ngay lập tức (dưới 1 giây)
- **SC-002**: Người dùng có thể điều hướng qua lại giữa các trang bằng nút Next/Previous mà không gặp lỗi
- **SC-003**: Trạng thái active của trang hiện tại được hiển thị rõ ràng, không gây nhầm lẫn
- **SC-004**: Phân trang hoạt động nhất quán với dữ liệu đã lọc, không hiển thị giao dịch không thuộc bộ lọc

## Clarifications

### Session 2026-04-27

- Q: Khi lỗi xảy ra lúc chuyển trang, xử lý thế nào? → A: Ở lại trang hiện tại, hiện thông báo lỗi ngắn gọn
- Q: Khi quay lại màn hình danh sách, giữ hay reset trang? → A: Reset về trang 1
- Q: Khi xóa giao dịch cuối cùng của trang, chuyển về trang nào? → A: Ở lại trang hiện tại (có thể hiển thị trang trống)

## Giả định

- Kích thước trang (số giao dịch mỗi trang) giữ nguyên như đang triển khai hiện tại
- Dữ liệu giao dịch được tải từ nguồn dữ liệu local (SQLite), không phải API từ xa - do đó tốc độ chuyển trang nhanh
- Bug hiện tại nằm ở tầng UI/event handling, không phải ở tầng dữ liệu
- Không thay đổi cấu trúc dữ liệu hoặc schema database
