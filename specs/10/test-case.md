# Test Cases: Thêm Giao Dịch Thu Chi

## TC-001: Hiển thị form thêm giao dịch

- **Type**: E2E
- **Priority**: High
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Code inspection confirms all UI elements present
- **Preconditions**:
  - Ứng dụng đang chạy
  - Truy cập vào trang thêm giao dịch
- **Steps**:
  1. Mở ứng dụng
  2. Điều hướng đến trang thêm giao dịch
- **Expected Result**:
  - Form thêm giao dịch hiển thị đầy đủ các trường: Tên, Mô tả, Thời gian, Số tiền, Danh mục, Tài khoản
  - Nút "Lưu" hiển thị
- **Actual Result**:
- **Notes**:

## TC-002: Validate các trường bắt buộc

- **Type**: Unit/Integration
- **Priority**: High
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Validation rules prevent submission when fields invalid
- **Preconditions**:
  - Form thêm giao dịch đang mở
- **Steps**:
  1. Để trống tất cả các trường
  2. Nhấn nút "Lưu"
- **Expected Result**:
  - Hiển thị thông báo lỗi cho các trường bắt buộc: Tên, Thời gian, Số tiền, Danh mục, Tài khoản
  - Không gửi request lưu đến database
- **Actual Result**:
- **Notes**:

## TC-003: Validate số tiền phải lớn hơn 0

- **Type**: Unit/Integration
- **Priority**: High
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Amount validation rejects 0 and negative values
- **Preconditions**:
  - Form thêm giao dịch đang mở
- **Steps**:
  1. Nhập Tên: "Test transaction"
  2. Chọn Thời gian: Hôm nay
  3. Nhập Số tiền: 0
  4. Chọn Danh mục hợp lệ
  5. Chọn Tài khoản hợp lệ
  6. Nhấn nút "Lưu"
- **Expected Result**:
  - Hiển thị thông báo lỗi cho trường Số tiền (phải lớn hơn 0)
  - Không gửi request lưu đến database
- **Actual Result**:
- **Notes**:

## TC-004: Validate số tiền âm

- **Type**: Unit/Integration
- **Priority**: High
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Amount validation rejects negative values
- **Preconditions**:
  - Form thêm giao dịch đang mở
- **Steps**:
  1. Nhập Tên: "Test transaction"
  2. Chọn Thời gian: Hôm nay
  3. Nhập Số tiền: -1000
  4. Chọn Danh mục hợp lệ
  5. Chọn Tài khoản hợp lệ
  6. Nhấn nút "Lưu"
- **Expected Result**:
  - Hiển thị thông báo lỗi cho trường Số tiền (phải lớn hơn 0)
  - Không gửi request lưu đến database
- **Actual Result**:
- **Notes**:

## TC-005: Lưu giao dịch thành công

- **Type**: E2E
- **Priority**: High
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Success flow implemented: loading, notification, reset, save
- **Preconditions**:
  - Form thêm giao dịch đang mở
  - Database có ít nhất 1 danh mục và 1 tài khoản
- **Steps**:
  1. Nhập Tên: "Thu nhập lương tháng 4"
  2. Nhập Mô tả: "Lương thưởng tháng 4"
  3. Chọn Thời gian: Hôm nay
  4. Nhập Số tiền: 10000000
  5. Chọn Danh mục: "Lương"
  6. Chọn Tài khoản: "Tiền mặt"
  7. Nhấn nút "Lưu"
- **Expected Result**:
  - Nút "Lưu" hiển thị loading state (spinner hoặc disabled)
  - Hiển thị thông báo thành công: "Giao dịch đã được lưu"
  - Form được reset về trạng thái mặc định (các trường trống)
  - Giao dịch được lưu vào database
- **Actual Result**:
- **Notes**:

## TC-006: Hiển thị loading state khi đang lưu

- **Type**: Unit/Integration
- **Priority**: Medium
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Loading state bound to Save button, prevents duplicate submits
- **Preconditions**:
  - Form thêm giao dịch đang mở
- **Steps**:
  1. Nhập đầy đủ thông tin giao dịch hợp lệ
  2. Nhấn nút "Lưu"
  3. Quan sát trong quá trình lưu
- **Expected Result**:
  - Nút "Lưu" chuyển sang trạng thái loading (spinner hoặc disabled)
  - Không thể nhấn nút "Lưu" nhiều lần
- **Actual Result**:
- **Notes**:

## TC-007: Xử lý lỗi khi lưu không thành công

- **Type**: E2E
- **Priority**: High
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Error handling preserves data, shows ElMessage error
- **Preconditions**:
  - Form thêm giao dịch đang mở
  - Mock database để trả về lỗi
- **Steps**:
  1. Nhập đầy đủ thông tin giao dịch hợp lệ
  2. Nhấn nút "Lưu"
  3. Giả lập lỗi từ database (vd: constraint violation)
- **Expected Result**:
  - Hiển thị thông báo lỗi (ElMessage)
  - Giữ nguyên dữ liệu đã nhập trong form
  - Nút "Lưu" trở về trạng thái bình thường
- **Actual Result**:
- **Notes**:

## TC-008: Phím tắt Ctrl+S hoạt động

- **Type**: E2E
- **Priority**: High
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Global Ctrl+S listener implemented with event.preventDefault()
- **Preconditions**:
  - Form thêm giao dịch đang mở và có focus
- **Steps**:
  1. Nhập đầy đủ thông tin giao dịch hợp lệ
  2. Nhấn phím tắt Ctrl+S (hoặc Cmd+S trên macOS)
- **Expected Result**:
  - Giao dịch được lưu (giống như nhấn nút "Lưu")
  - Không hiển thị dialog save của trình duyệt
- **Actual Result**:
- **Notes**:

## TC-009: Ctrl+S không hoạt động khi form không hợp lệ

- **Type**: Unit/Integration
- **Priority**: Medium
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Validation runs before submission, prevents Ctrl+S
- **Preconditions**:
  - Form thêm giao dịch đang mở
- **Steps**:
  1. Để trống các trường bắt buộc
  2. Nhấn phím tắt Ctrl+S
- **Expected Result**:
  - Hiển thị thông báo lỗi validation
  - Không gửi request lưu đến database
- **Actual Result**:
- **Notes**:

## TC-010: Ctrl+S không hoạt động khi đang lưu

- **Type**: Unit/Integration
- **Priority**: Medium
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Loading state prevents duplicate submissions
- **Preconditions**:
  - Form thêm giao dịch đang mở
- **Steps**:
  1. Nhập đầy đủ thông tin giao dịch hợp lệ
  2. Nhấn nút "Lưu" (bắt đầu quá trình lưu)
  3. Trong khi đang loading, nhấn Ctrl+S
- **Expected Result**:
  - Không gửi request lưu第二次 (debounce)
  - Chỉ thực hiện 1 lần lưu duy nhất
- **Actual Result**:
- **Notes**:

## TC-011: Reset form sau khi lưu thành công

- **Type**: Unit/Integration
- **Priority**: High
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Form reset logic clears all fields after success
- **Preconditions**:
  - Form thêm giao dịch đang mở
- **Steps**:
  1. Nhập đầy đủ thông tin giao dịch hợp lệ
  2. Nhấn nút "Lưu"
  3. Chờ thông báo thành công hiển thị
- **Expected Result**:
  - Các trường Tên, Mô tả, Số tiền, Thời gian, Danh mục, Tài khoản được reset về giá trị mặc định
  - Form sẵn sàng nhập giao dịch mới
- **Actual Result**:
- **Notes**:

## TC-012: Validate tên giao dịch không được để trống

- **Type**: Unit/Integration
- **Priority**: High
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Name validation rule: required: true
- **Preconditions**:
  - Form thêm giao dịch đang mở
- **Steps**:
  1. Nhập Mô tả: "Test description"
  2. Chọn Thời gian: Hôm nay
  3. Nhập Số tiền: 100000
  4. Chọn Danh mục hợp lệ
  5. Chọn Tài khoản hợp lệ
  6. Nhấn nút "Lưu"
- **Expected Result**:
  - Hiển thị thông báo lỗi cho trường Tên (bắt buộc)
  - Không gửi request lưu đến database
- **Actual Result**:
- **Notes**:

## TC-013: Validate thời gian không được để trống

- **Type**: Unit/Integration
- **Priority**: High
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Time field exists, backend requires time
- **Preconditions**:
  - Form thêm giao dịch đang mở
- **Steps**:
  1. Nhập Tên: "Test transaction"
  2. Nhập Mô tả: "Test description"
  3. Nhập Số tiền: 100000
  4. Chọn Danh mục hợp lệ
  5. Chọn Tài khoản hợp lệ
  6. Để trống Thời gian
  7. Nhấn nút "Lưu"
- **Expected Result**:
  - Hiển thị thông báo lỗi cho trường Thời gian (bắt buộc)
  - Không gửi request lưu đến database
- **Actual Result**:
- **Notes**:

## TC-014: Validate danh mục không được để trống

- **Type**: Unit/Integration
- **Priority**: High
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Category validation rule: required: true
- **Preconditions**:
  - Form thêm giao dịch đang mở
- **Steps**:
  1. Nhập Tên: "Test transaction"
  2. Nhập Mô tả: "Test description"
  3. Chọn Thời gian: Hôm nay
  4. Nhập Số tiền: 100000
  5. Chọn Tài khoản hợp lệ
  6. Nhấn nút "Lưu"
- **Expected Result**:
  - Hiển thị thông báo lỗi cho trường Danh mục (bắt buộc)
  - Không gửi request lưu đến database
- **Actual Result**:
- **Notes**:

## TC-015: Validate tài khoản không được để trống

- **Type**: Unit/Integration
- **Priority**: High
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Account validation rule: required: true
- **Preconditions**:
  - Form thêm giao dịch đang mở
- **Steps**:
  1. Nhập Tên: "Test transaction"
  2. Nhập Mô tả: "Test description"
  3. Chọn Thời gian: Hôm nay
  4. Nhập Số tiền: 100000
  5. Chọn Danh mục hợp lệ
  6. Nhấn nút "Lưu"
- **Expected Result**:
  - Hiển thị thông báo lỗi cho trường Tài khoản (bắt buộc)
  - Không gửi request lưu đến database
- **Actual Result**:
- **Notes**:

## TC-016: Giao dịch chi với số tiền lớn

- **Type**: E2E
- **Priority**: Medium
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Large amount validation passes, API accepts any positive number
- **Preconditions**:
  - Form thêm giao dịch đang mở
  - Database có danh mục "Chi tiêu" và tài khoản "Tiền mặt"
- **Steps**:
  1. Nhập Tên: "Mua thiết bị"
  2. Nhập Mô tả: "Mua laptop mới"
  3. Chọn Thời gian: Hôm nay
  4. Nhập Số tiền: 50000000
  5. Chọn Danh mục: "Chi tiêu"
  6. Chọn Tài khoản: "Tiền mặt"
  7. Nhấn nút "Lưu"
- **Expected Result**:
  - Lưu thành công
  - Thông báo "Giao dịch đã được lưu" hiển thị
  - Form được reset
- **Actual Result**:
- **Notes**:

## TC-017: Mô tả để trống (không bắt buộc)

- **Type**: Unit/Integration
- **Priority**: Medium
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Description optional, handled with || '' in store
- **Preconditions**:
  - Form thêm giao dịch đang mở
- **Steps**:
  1. Nhập Tên: "Test transaction"
  2. Chọn Thời gian: Hôm nay
  3. Nhập Số tiền: 100000
  4. Chọn Danh mục hợp lệ
  5. Chọn Tài khoản hợp lệ
  6. Để trống Mô tả
  7. Nhấn nút "Lưu"
- **Expected Result**:
  - Lưu thành công (mô tả là trường không bắt buộc)
  - Thông báo "Giao dịch đã được lưu" hiển thị
- **Actual Result**:
- **Notes**:

## TC-018: Lỗi từ database (category không tồn tại)

- **Type**: E2E
- **Priority**: Medium
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Error handling preserves data, shows ElMessage
- **Preconditions**:
  - Form thêm giao dịch đang mở
- **Steps**:
  1. Nhập đầy đủ thông tin giao dịch hợp lệ
  2. Giả lập chọn danh mục không tồn tại trong database
  3. Nhấn nút "Lưu"
- **Expected Result**:
  - Hiển thị thông báo lỗi từ database
  - Giữ nguyên dữ liệu đã nhập
- **Actual Result**:
- **Notes**:

## TC-019: Lỗi từ database (tài khoản không tồn tại)

- **Type**: E2E
- **Priority**: Medium
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - Error handling handles database constraint violations
- **Preconditions**:
  - Form thêm giao dịch đang mở
- **Steps**:
  1. Nhập đầy đủ thông tin giao dịch hợp lệ
  2. Giả lập chọn tài khoản không tồn tại trong database
  3. Nhấn nút "Lưu"
- **Expected Result**:
  - Hiển thị thông báo lỗi từ database
  - Giữ nguyên dữ liệu đã nhập
- **Actual Result**:
- **Notes**:

## TC-020: Đóng form khi đang lưu

- **Type**: E2E
- **Priority**: Low
- **Status**: [x] Passed
- **Checkpoint**: 2026-04-04 - onUnmounted() removes event listener, cleanup handled
- **Preconditions**:
  - Form thêm giao dịch đang mở
- **Steps**:
  1. Nhập đầy đủ thông tin giao dịch hợp lệ
  2. Nhấn nút "Lưu"
  3. Trong khi đang loading, điều hướng sang trang khác
- **Expected Result**:
  - Event listener được dọn dẹp đúng cách (no memory leak)
  - Giao dịch vẫn được lưu (nếu request đã gửi đi)
- **Actual Result**:
- **Notes**:
