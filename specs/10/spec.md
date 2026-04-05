# SPEC: thêm giao dịch thu chi trong app

## Thông tin PBI
- **Mã PBI**: 10
- **Branch git**: feature/10-them-giao-dich-luu-giao-dich
- **Thư mục**: specs/10

## Mô tả yêu cầu
Hiện trạng:
- Hiện tại, tôi đã xây dựng giao diện thêm giao dịch nhưng chưa bổ sung tính năng để lưu được giao dịch thu/chi
- IPC handler `db:addTransaction` đã được implement trong `src/main/index.ts`
- Preload script đã expose `window.api.createTransaction`

Yêu cầu:
Bổ sung tính năng thêm giao dịch khi người dùng lưu giao dịch, cụ thể:
- Action: Khi người dùng chọn button Lưu hoặc nhấn phím tắt Ctrl + S (cần implement global keyboard listener)
- Giao diện:
  + Tên khoản thu/chi: Bắt buộc
  + Mô tả/Nội dùng khoản thu/chi: không bắt buộc
  + Thời gian: bắt buộc
  + Số tiền: bắt buộc và nhập số dương (> 0)
  + Danh mục: Bắt buộc (theo database schema)
  + Tài khoản: Bắt buộc (theo database schema)

## Phạm vi
- Cập nhật transaction form để xử lý lưu giao dịch
- Gọi API lưu giao dịch từ database (main process)
- Xử lý validate dữ liệu trước khi lưu
- Reset form sau khi lưu thành công
- Hiển thị thông báo thành công/thất bại

## Yêu cầu kỹ thuật
- Sử dụng Pinia store để quản lý state form
- Gọi IPC API `db:addTransaction` (thông qua `window.api.createTransaction`) để lưu vào database
- Validate dữ liệu:
  - `name`: Bắt buộc, không rỗng
  - `time`: Bắt buộc, format datetime
  - `amount`: Bắt buộc, số dương (> 0)
  - `category`: Bắt buộc (theo database schema)
  - `account`: Bắt buộc (theo database schema)
- Hiển thị loading state khi đang lưu (spinner hoặc disable button)
- Xử lý lỗi từ database và hiển thị thông báo (sử dụng Element Plus ElMessage)
- Reset form về trạng thái mặc định sau khi lưu thành công
- Implement global keyboard listener cho phím tắt Ctrl+S

## Acceptance Criteria
1. Người dùng có thể nhập đầy đủ thông tin giao dịch (tên, thời gian, số tiền, mô tả, danh mục, tài khoản)
2. Khi nhấn "Lưu" hoặc Ctrl+S:
   - Validate các trường bắt buộc (name, time, amount, category, account)
   - Validate amount > 0
   - Gửi request lưu đến database thông qua `db:addTransaction`
   - Hiển thị loading trong quá trình lưu (button spinner hoặc disabled)
3. Lưu thành công:
   - Reset form về trạng thái mặc định (clear các trường)
   - Hiển thị thông báo "Giao dịch đã được lưu" (sử dụng ElMessage)
   - Chuyển hướng về danh sách giao dịch (hoặc giữ nguyên nếu là modal)
4. Lưu thất bại:
   - Hiển thị thông báo lỗi (sử dụng ElMessage)
   - Giữ nguyên dữ liệu đã nhập
5. Phím tắt Ctrl+S phải hoạt động全局 (global keyboard listener)

## Assumptions
> **Assumption:** Danh mục (category) và tài khoản (account) là bắt buộc dựa trên database schema (`NOT NULL`), mặc dù spec cũ ghi là không bắt buộc.
> **Assumption:** Số tiền phải là số dương > 0 (strictly positive), không cho phép 0.
> **Assumption:** Phím tắt Ctrl+S cần được implement global listener để hoạt động mọi nơi trong app.
> **Assumption:** Thông báo thành công/thất bại sử dụng Element Plus `ElMessage`.
> **Assumption:** Form sẽ được reset về giá trị mặc định sau khi lưu thành công.

## Ghi chú
- IPC handler `db:addTransaction` đã được implement trong `src/main/index.ts`
- Preload script đã expose `window.api.createTransaction` ở `src/preload/index.ts`
- TransactionForm store đã có hàm `addTransaction` ở `src/renderer/src/stores/transactionForm.ts`
- **Cần implement**:
  - Global keyboard listener cho Ctrl+S (chưa có trong codebase)
  - Hiển thị loading state trong `SoraAddTransactionView.vue` (chưa có)
  - Hiển thị thông báo ElMessage khi thành công/thất bại (chưa có)
  - Reset form sau khi lưu thành công (chưa có, đang comment lại)
  - Update validation rules cho category và account thành bắt buộc (theo database schema)
  - Update validation rule cho amount: > 0 thay vì >= 0
