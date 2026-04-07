PBI: 14
Spec: specs/14/spec.md
Plan: specs/14/plan.md

# Test Cases - PBI 14 - Danh sách giao dịch thu chi

## Tổng quan

Tài liệu này chứa các test cases cho PBI 14 - Danh sách giao dịch thu chi. Mục tiêu của PBI này là triển khai API lấy danh sách giao dịch thu/chi từ database SQLite local với hỗ trợ phân trang và lọc từ phía server, thay thế cho cách xử lý client-side hiện tại.

**Các tính năng chính được test:**

- Database migration sang UUID v7
- API phân trang phía server
- Hiển thị danh sách giao dịch với filter và phân trang
- Search không phân biệt hoa thường và dấu tiếng Việt
- Hiển thị tổng thu/chi theo filter
- Xử lý lỗi và empty state
- Logging chỉ ở Electron main process
- Hiển thị số tiền âm với màu đỏ

---

## TC-14-01: Lấy dữ liệu giao dịch với filter mặc định

- **Type**: Integration
- **Priority**: High
- **AC ID**: AC1
- **Regression**: true

### Preconditions

Ứng dụng đã được cài đặt và khởi động thành công. Database đã được migrate và chứa dữ liệu giao dịch mẫu.

### Steps

1. Người dùng truy cập vào màn hình danh sách giao dịch (/transactions)
2. Ứng dụng khởi tạo và thực hiện gọi API với các tham số mặc định:
   - name: "" (chuỗi rỗng)
   - categoryId: null
   - accountId: null
   - sortBy: 'newest'
   - page: 1
   - pageSize: 10
3. API trả về dữ liệu phân trang

### Expected Result

API được gọi với đúng các tham số mặc định đã định nghĩa. Danh sách giao dịch được hiển thị theo ngày mới nhất. Kết quả trả về 10 giao dịch đầu tiên (nếu có).

---

## TC-14-02: API trả về dữ liệu phân trang đúng cấu trúc

- **Type**: Integration
- **Priority**: High
- **AC ID**: AC2
- **Regression**: true

### Preconditions

Database đã migrate và chứa ít nhất 15 bản ghi giao dịch

### Steps

1. Gọi API `db:getTransactions` với page=1, pageSize=10
2. Kiểm tra response trả về

### Expected Result

Response chứa các trường:

- data: mảng các giao dịch theo trang hiện tại (tối đa 10 phần tử)
- total: tổng số bản ghi thỏa mãn điều kiện lọc
- page: 1
- pageSize: 10

---

## TC-14-03: Hiển thị dữ liệu giao dịch lên bảng danh sách

- **Type**: Acceptance
- **Priority**: High
- **AC ID**: AC3
- **Regression**: false

### Preconditions

Database chứa dữ liệu giao dịch mẫu với đầy đủ các trường

### Steps

1. Truy cập màn hình danh sách giao dịch
2. Kiểm tra các cột hiển thị trên bảng ElTable

### Expected Result

Các cột hiển thị đúng:

- "Tên giao dịch" (name)
- "Danh mục" (categoryName)
- "Tài khoản" (accountName)
- "Số tiền" (amount) - định dạng VND, hỗ trợ số lẻ (VD: 10.02)
- "Ngày tháng" (time) - định dạng dd/MM/yyyy

---

## TC-14-04: Xử lý trường hợp không có dữ liệu

- **Type**: Acceptance
- **Priority**: High
- **AC ID**: AC4
- **Regression**: false

### Preconditions

Database không có bản ghi giao dịch nào (bảng transactions trống)

### Steps

1. Truy cập màn hình danh sách giao dịch
2. Quan sát giao diện khi không có dữ liệu

### Expected Result

Hiển thị thông báo "Không có giao dịch nào" (sử dụng i18n key `transactions.empty`). Bảng danh sách vẫn hiển thị (không ẩn).

---

## TC-14-05: Chuyển trang và thay đổi kích thước trang

- **Type**: Acceptance
- **Priority**: High
- **AC ID**: AC5
- **Regression**: false

### Preconditions

Database chứa ít nhất 25 bản ghi giao dịch. Đang ở trang 1 với pageSize=10.

### Steps

1. Nhấn chuyển sang trang 2
2. Thay đổi pageSize từ 10 thành 20
3. Quan sát dữ liệu được cập nhật

### Expected Result

Khi chuyển trang: API được gọi với page=2, pageSize=10, hiển thị 10 giao dịch tiếp theo. Khi thay đổi pageSize: API được gọi với page=1, pageSize=20, hiển thị tối đa 20 giao dịch đầu tiên.

---

## TC-14-06: Thay đổi bộ lọc và reset về trang 1

- **Type**: Acceptance
- **Priority**: High
- **AC ID**: AC6
- **Regression**: false

### Preconditions

Đang ở trang 2 hoặc cao hơn. Database chứa dữ liệu giao dịch với nhiều danh mục và tài khoản.

### Steps

1. Thay đổi danh mục (category) từ "Tất cả" sang một danh mục cụ thể
2. Thay đổi tài khoản (account) từ "Tất cả" sang một tài khoản cụ thể
3. Thay đổi sắp xếp từ "Mới nhất" sang "Cũ nhất"
4. Quan sát kết quả

### Expected Result

Khi thay đổi bất kỳ bộ lọc nào: API được gọi lại với filter mới. Trang được reset về 1 (page=1). Dữ liệu được lọc theo bộ lọc mới.

---

## TC-14-07: Hiển thị tổng thu/chi theo filter

- **Type**: Acceptance
- **Priority**: High
- **AC ID**: AC7
- **Regression**: false

### Preconditions

Database chứa dữ liệu giao dịch với cả giao dịch thu (amount > 0) và chi (amount < 0)

### Steps

1. Truy cập màn hình danh sách giao dịch
2. Kiểm tra phần hiển thị tổng thu và tổng chi

### Expected Result

- totalIncome: tổng amount > 0 theo filter hiện tại
- totalExpense: tổng giá trị tuyệt đối của amount < 0 theo filter hiện tại
- Hiển thị đúng định dạng VND

---

## TC-14-08: Tổng thu/chi cập nhật khi thay đổi filter

- **Type**: Acceptance
- **Priority**: High
- **AC ID**: AC8
- **Regression**: false

### Preconditions

Database chứa dữ liệu giao dịch đa dạng

### Steps

1. Xem tổng thu/chi với filter mặc định (tất cả danh mục, tất cả tài khoản)
2. Thay đổi filter danh mục sang một danh mục cụ thể
3. Quan sát tổng thu/chi được cập nhật theo filter mới

### Expected Result

Tổng thu/chi được cập nhật theo dữ liệu tương ứng với filter mới. Khi chọn một danh mục cụ thể, tổng chỉ tính cho các giao dịch thuộc danh mục đó.

---

## TC-14-09: Số tiền hỗ trợ số lẻ

- **Type**: Acceptance
- **Priority**: High
- **AC ID**: AC9
- **Regression**: false

### Preconditions

Database chứa giao dịch với số tiền lẻ (VD: 10.02 VND)

### Steps

1. Truy cập màn hình danh sách giao dịch
2. Tìm giao dịch có số tiền lẻ và kiểm tra cách hiển thị

### Expected Result

Số tiền được lưu đúng với số lẻ trong database (amount = 10.02). Số tiền được hiển thị đúng trên giao diện với định dạng VND (10.02).

---

## TC-14-10: Xử lý lỗi khi truy vấn database

- **Type**: Acceptance
- **Priority**: High
- **AC ID**: AC10
- **Regression**: false

### Preconditions

Mô phỏng lỗi database (có thể tạm thời đổi tên database hoặc gây lỗi connection)

### Steps

1. Gây lỗi database (ví dụ: đổi tên file database)
2. Truy cập màn hình danh sách giao dịch
3. Quan sát cách ứng dụng xử lý lỗi

### Expected Result

- Danh sách giao dịch trả về mảng rỗng
- summary.totalIncome = 0
- summary.totalExpense = 0
- Hiển thị toast thông báo lỗi với i18n key `transactions.error`

---

## TC-14-11: Category Dropdown lấy dữ liệu từ database

- **Type**: Integration
- **Priority**: High
- **AC ID**: AC11
- **Regression**: true

### Preconditions

Database chứa dữ liệu bảng categories

### Steps

1. Truy cập màn hình danh sách giao dịch
2. Mở dropdown Danh mục
3. Kiểm tra dữ liệu danh mục được load từ database

### Expected Result

Dữ liệu danh mục được load từ bảng categories trong database. Label hiển thị categoryName, value là categoryId. Có option mặc định "Tất cả" với giá trị null.

---

## TC-14-12: Account Dropdown lấy dữ liệu từ database

- **Type**: Integration
- **Priority**: High
- **AC ID**: AC12
- **Regression**: true

### Preconditions

Database chứa dữ liệu bảng accounts

### Steps

1. Truy cập màn hình danh sách giao dịch
2. Mở dropdown Tài khoản
3. Kiểm tra dữ liệu tài khoản được load từ database

### Expected Result

Dữ liệu tài khoản được load từ bảng accounts trong database. Label hiển thị accountName, value là accountId. Có option mặc định "Tất cả" với giá trị null.

---

## TC-14-13: Filter theo accountId thay vì account name

- **Type**: Integration
- **Priority**: High
- **AC ID**: AC13
- **Regression**: true

### Preconditions

Database chứa dữ liệu giao dịch với nhiều tài khoản

### Steps

1. Chọn một tài khoản cụ thể trong dropdown
2. Kiểm tra API được gọi với tham số accountId

### Expected Result

API filter sử dụng accountId (number) thay vì account name (string). Kết quả trả về chỉ các giao dịch thuộc tài khoản được chọn.

---

## TC-14-14: Search không phân biệt hoa thường và dấu tiếng Việt

- **Type**: Integration
- **Priority**: High
- **AC ID**: AC14
- **Regression**: false

### Preconditions

Database chứa giao dịch với tên tiếng Việt có dấu (VD: "Tiền lương", "Tiền điện")

### Steps

1. Nhập từ khóa "tiền" (không dấu, viết thường) vào ô search
2. Nhập từ khóa "Tien" (không dấu, viết hoa đầu)
3. Nhập từ khóa "Tim" (không dấu) để tìm "Tìm"

### Expected Result

- Khi nhập "tiền": tìm được "Tiền lương", "Tiền điện"
- Khi nhập "Tien": tìm được "Tiền lương", "Tiền điện"
- Khi nhập "Tim": tìm được "Tìm kiếm", "Tìm" (nếu có)

---

## TC-14-15: Logging chỉ ở Electron main process

- **Type**: Unit
- **Priority**: Medium
- **AC ID**: AC15
- **Regression**: true

### Preconditions

Ứng dụng đã được cài đặt và khởi động

### Steps

1. Mở DevTools của Electron (cả main process và renderer)
2. Thực hiện một số thao tác (truy cập danh sách giao dịch, lọc, phân trang)
3. Quan sát các log messages

### Expected Result

- Log chỉ được ghi ở Electron main process
- Không có log từ renderer/client process
- Các log trong main process: database errors, IPC errors, uncaught exceptions

---

## TC-14-16: Hiển thị số tiền âm (giao dịch chi) với màu đỏ

- **Type**: Acceptance
- **Priority**: High
- **AC ID**: AC16
- **Regression**: false

### Preconditions

Database chứa giao dịch chi với số tiền âm (amount < 0)

### Steps

1. Truy cập màn hình danh sách giao dịch
2. Tìm giao dịch chi (amount < 0)
3. Kiểm tra cách hiển thị số tiền

### Expected Result

Số tiền được hiển thị dưới dạng số dương với màu đỏ. Ví dụ: amount = -500000 hiển thị thành "500.000" với màu đỏ (sử dụng CSS class cho expense).

---

## TC-14-17: Database migration sang UUID v7

- **Type**: Integration
- **Priority**: High
- **AC ID**: AC1
- **Regression**: false

### Preconditions

Database schema cũ với id là INTEGER AUTOINCREMENT

### Steps

1. Khởi động ứng dụng (quá trình migration chạy tự động)
2. Kiểm tra bảng transactions sau migration

### Expected Result

- Cột id chuyển sang TEXT (UUID v7)
- Cột category chuyển thành categoryId (INTEGER, FK)
- Cột account chuyển thành accountId (INTEGER, FK)
- Cột amount chuyển sang REAL (hỗ trợ số lẻ)
- Cột time chuyển sang INTEGER (Unix timestamp)
- Các indexes được tạo đúng cho performance

---

## TC-14-18: Kiểm tra pagination response với tổng số bản ghi lớn

- **Type**: Integration
- **Priority**: High
- **AC ID**: AC2
- **Regression**: false

### Preconditions

Database chứa hơn 100 bản ghi giao dịch

### Steps

1. Gọi API với page=1, pageSize=10
2. Kiểm tra total trả về
3. Gọi API với page=3, pageSize=10

### Expected Result

- total = tổng số bản ghi trong database thỏa mãn filter
- page=3, pageSize=10 trả về 10 bản ghi từ vị trí 21-30

---

## TC-14-19: Verify custom function remove_diacritics hoạt động

- **Type**: Unit
- **Priority**: Medium
- **AC ID**: AC14
- **Regression**: false

### Preconditions

Database đã được khởi tạo với custom function remove_diacritics

### Steps

1. Viết unit test cho hàm remove_diacritics với các test cases:
   - "tiền" -> "tien"
   - "Tìm" -> "Tim"
   - "Đại" -> "Dai"
   - "ê" -> "e"

### Expected Result

Hàm remove_diacritics trả về chuỗi không dấu đúng. Hỗ trợ các ký tự tiếng Việt đặc biệt: ă, â, ơ, ư, đ, ê, ô, ủ, ị, ể...

---

## TC-14-20: Verify summary query tính đúng theo filter

- **Type**: Integration
- **Priority**: High
- **AC ID**: AC7
- **Regression**: false

### Preconditions

Database chứa dữ liệu:

- 3 giao dịch thu với tổng 30.000
- 2 giao dịch chi với tổng 15.000

### Steps

1. Gọi API với filter mặc định (không lọc)
2. Kiểm tra summary totalIncome = 30000, totalExpense = 15000
3. Lọc theo một categoryId cụ thể
4. Kiểm tra summary tính đúng theo filter mới

### Expected Result

- totalIncome = tổng các amount > 0 theo filter
- totalExpense = tổng giá trị tuyệt đối của các amount < 0 theo filter
- Summary query có categoryId filter

---

## Tổng kết

| STT | Test Case ID | Type        | Priority | AC ID |
| --- | ------------ | ----------- | -------- | ----- |
| 1   | TC-14-01     | Integration | High     | AC1   |
| 2   | TC-14-02     | Integration | High     | AC2   |
| 3   | TC-14-03     | Acceptance  | High     | AC3   |
| 4   | TC-14-04     | Acceptance  | High     | AC4   |
| 5   | TC-14-05     | Acceptance  | High     | AC5   |
| 6   | TC-14-06     | Acceptance  | High     | AC6   |
| 7   | TC-14-07     | Acceptance  | High     | AC7   |
| 8   | TC-14-08     | Acceptance  | High     | AC8   |
| 9   | TC-14-09     | Acceptance  | High     | AC9   |
| 10  | TC-14-10     | Acceptance  | High     | AC10  |
| 11  | TC-14-11     | Integration | High     | AC11  |
| 12  | TC-14-12     | Integration | High     | AC12  |
| 13  | TC-14-13     | Integration | High     | AC13  |
| 14  | TC-14-14     | Integration | High     | AC14  |
| 15  | TC-14-15     | Unit        | Medium   | AC15  |
| 16  | TC-14-16     | Acceptance  | High     | AC16  |
| 17  | TC-14-17     | Integration | High     | AC1   |
| 18  | TC-14-18     | Integration | High     | AC2   |
| 19  | TC-14-19     | Unit        | Medium   | AC14  |
| 20  | TC-14-20     | Integration | High     | AC7   |

### Thống kê

- **Tổng số test cases**: 20
- **Theo loại**: Unit: 2 | Integration: 8 | Acceptance: 10
- **Theo mức ưu tiên**: High: 18 | Medium: 2
- **Regression tests**: 6
- **AC Coverage**: 16/16 (100%)
