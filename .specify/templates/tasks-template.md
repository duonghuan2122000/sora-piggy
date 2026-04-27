---

description: "Template danh sách tác vụ cho triển khai tính năng"
---

# Tác vụ: [TÊN TÍNH NĂNG]

**Đầu vào**: Tài liệu thiết kế từ `/specs/[###-ten-tinh-nang]/`
**Tiên quyết**: plan.md (bắt buộc), spec.md (bắt buộc cho user stories), research.md, data-model.md, contracts/

**Kiểm thử**: BẮT BUỘC theo Hiến pháp (mục II). Viết test TRƯỚC khi triển khai, đảm bảo test fail (red), sau đó implement (green).

**Tổ chức**: Tác vụ được nhóm theo user story để cho phép triển khai và kiểm thử độc lập từng story.

## Định dạng: `[ID] [P?] [Story] Mô tả`

- **[P]**: Có thể chạy song song (file khác nhau, không phụ thuộc)
- **[Story]**: User story mà tác vụ này thuộc về (vd: US1, US2, US3)
- Bao gồm đường dẫn file chính xác trong mô tả

## Quy ước Đường dẫn

- **Dự án đơn**: `src/`, `tests/` tại thư mục gốc repository
- **Web app**: `backend/src/`, `frontend/src/`
- **Di động**: `api/src/`, `ios/src/` hoặc `android/src/`
- Đường dẫn bên dưới giả định dự án đơn - điều chỉnh dựa trên cấu trúc trong plan.md

<!-- 
  ============================================================================
  QUAN TRỌNG: Các tác vụ bên dưới là MẪU chỉ nhằm mục đích minh họa.
  
  Lệnh /speckit.tasks PHẢI thay thế chúng bằng tác vụ thực tế dựa trên:
  - User stories từ spec.md (với ưu tiên P1, P2, P3...)
  - Yêu cầu tính năng từ plan.md
  - Thực thể từ data-model.md
  - Endpoint từ contracts/
  
  Tác vụ PHẢI được tổ chức theo user story để mỗi story có thể:
  - Triển khai độc lập
  - Kiểm thử độc lập
  - Phân phối như một bản tăng MVP
  
  KHÔNG giữ các tác vụ mẫu này trong file tasks.md được tạo ra.
  ============================================================================
-->

## Phase 1: Thiết lập (Hạ tầng dùng chung)

**Mục đích**: Khởi tạo dự án và cấu trúc cơ bản

- [ ] T001 Tạo cấu trúc dự án theo kế hoạch triển khai
- [ ] T002 Khởi tạo dự án [ngôn ngữ] với thư viện [framework]
- [ ] T003 [P] Cấu hình công cụ lint và format

---

## Phase 2: Nền tảng (Tiên quyết chặn)

**Mục đích**: Hạ tầng cốt lõi PHẢI hoàn thành trước khi có thể triển khai BẤT KỲ user story nào

**⚠️ NGHIÊM TRỌNG**: Không thể bắt đầu user story cho đến khi phase này hoàn thành

Ví dụ tác vụ nền tảng (điều chỉnh theo dự án):

- [ ] T004 Thiết lập schema database và framework migration
- [ ] T005 [P] Triển khai framework xác thực/phân quyền
- [ ] T006 [P] Thiết lập cấu trúc API routing và middleware
- [ ] T007 Tạo model/thực thể cơ sở mà tất cả story phụ thuộc
- [ ] T008 Cấu hình xử lý lỗi và hạ tầng logging
- [ ] T009 Thiết lập quản lý cấu hình môi trường

**Checkpoint**: Nền tảng sẵn sàng - có thể bắt đầu triển khai user story song song

---

## Phase 3: User Story 1 - [Tiêu đề] (Ưu tiên: P1) 🎯 MVP

**Mục tiêu**: [Mô tả ngắn gọn những gì story này mang lại]

**Kiểm thử độc lập**: [Cách xác minh story này hoạt động độc lập]

### Kiểm thử cho User Story 1 (BẮT BUỘC - theo Hiến pháp) 🔴

> **GHI CHÚ**: Viết các kiểm thử này TRƯỚC, đảm bảo chúng THẤT BẠI trước khi triển khai

- [ ] T010 [P] [US1] Kiểm thử contract cho [endpoint] trong tests/contract/test_[tên].py
- [ ] T011 [P] [US1] Kiểm thử tích hợp cho [hành trình người dùng] trong tests/integration/test_[tên].py

### Triển khai cho User Story 1

- [ ] T012 [P] [US1] Tạo model [Entity1] trong src/models/[entity1].py
- [ ] T013 [P] [US1] Tạo model [Entity2] trong src/models/[entity2].py
- [ ] T014 [US1] Triển khai [Service] trong src/services/[service].py (phụ thuộc T012, T013)
- [ ] T015 [US1] Triển khai [endpoint/tính năng] trong src/[vị trí]/[file].py
- [ ] T016 [US1] Thêm xác thực và xử lý lỗi
- [ ] T017 [US1] Thêm logging cho thao tác user story 1

**Checkpoint**: User Story 1 hoạt động đầy đủ và có thể kiểm thử độc lập

---

## Phase 4: User Story 2 - [Tiêu đề] (Ưu tiên: P2)

**Mục tiêu**: [Mô tả ngắn gọn những gì story này mang lại]

**Kiểm thử độc lập**: [Cách xác minh story này hoạt động độc lập]

### Kiểm thử cho User Story 2 (BẮT BUỘC - theo Hiến pháp) 🔴

- [ ] T018 [P] [US2] Kiểm thử contract cho [endpoint] trong tests/contract/test_[tên].py
- [ ] T019 [P] [US2] Kiểm thử tích hợp cho [hành trình người dùng] trong tests/integration/test_[tên].py

### Triển khai cho User Story 2

- [ ] T020 [P] [US2] Tạo model [Entity] trong src/models/[entity].py
- [ ] T021 [US2] Triển khai [Service] trong src/services/[service].py
- [ ] T022 [US2] Triển khai [endpoint/tính năng] trong src/[vị trí]/[file].py
- [ ] T023 [US2] Tích hợp với User Story 1 (nếu cần)

**Checkpoint**: User Story 1 VÀ 2 đều hoạt động độc lập

---

## Phase 5: User Story 3 - [Tiêu đề] (Ưu tiên: P3)

**Mục tiêu**: [Mô tả ngắn gọn những gì story này mang lại]

**Kiểm thử độc lập**: [Cách xác minh story này hoạt động độc lập]

### Kiểm thử cho User Story 3 (BẮT BUỘC - theo Hiến pháp) 🔴

- [ ] T024 [P] [US3] Kiểm thử contract cho [endpoint] trong tests/contract/test_[tên].py
- [ ] T025 [P] [US3] Kiểm thử tích hợp cho [hành trình người dùng] trong tests/integration/test_[tên].py

### Triển khai cho User Story 3

- [ ] T026 [P] [US3] Tạo model [Entity] trong src/models/[entity].py
- [ ] T027 [US3] Triển khai [Service] trong src/services/[service].py
- [ ] T028 [US3] Triển khai [endpoint/tính năng] trong src/[vị trí]/[file].py

**Checkpoint**: Tất cả user stories hoạt động độc lập

---

[Thêm các phase user story khác nếu cần, theo cùng mẫu]

---

## Phase N: Hoàn thiện & Quan tâm xuyên suốt

**Mục đích**: Cải tiến ảnh hưởng nhiều user stories

- [ ] TXXX [P] Cập nhật tài liệu trong docs/
- [ ] TXXX Dọn dẹp mã nguồn và tái cấu trúc
- [ ] TXXX Tối ưu hiệu năng cho tất cả stories
- [ ] TXXX [P] Unit test bổ sung (nếu yêu cầu) trong tests/unit/
- [ ] TXXX Tăng cường bảo mật
- [ ] TXXX Chạy xác thực quickstart.md

---

## Phụ thuộc & Thứ tự thực thi

### Phụ thuộc giữa các Phase

- **Thiết lập (Phase 1)**: Không phụ thuộc - có thể bắt đầu ngay
- **Nền tảng (Phase 2)**: Phụ thuộc Thiết lập - CHẶN tất cả user stories
- **User Stories (Phase 3+)**: Đều phụ thuộc vào Phase Nền tảng
  - User stories có thể tiến hành song song (nếu đủ nhân lực)
  - Hoặc tuần tự theo thứ tự ưu tiên (P1 → P2 → P3)
- **Hoàn thiện (Phase cuối)**: Phụ thuộc tất cả user stories hoàn thành

### Phụ thuộc giữa User Stories

- **User Story 1 (P1)**: Có thể bắt đầu sau Nền tảng (Phase 2) - Không phụ thuộc story khác
- **User Story 2 (P2)**: Có thể bắt đầu sau Nền tảng (Phase 2) - Có thể tích hợp US1 nhưng phải kiểm thử độc lập
- **User Story 3 (P3)**: Có thể bắt đầu sau Nền tảng (Phase 2) - Có thể tích hợp US1/US2 nhưng phải kiểm thử độc lập

### Trong mỗi User Story

- Kiểm thử (nếu có) PHẢI được viết và THẤT BẠI trước khi triển khai
- Models trước services
- Services trước endpoints
- Triển khai lõi trước tích hợp
- Story hoàn thành trước khi chuyển sang ưu tiên tiếp theo

### Cơ hội Song song

- Tất cả tác vụ Thiết lập đánh dấu [P] có thể chạy song song
- Tất cả tác vụ Nền tảng đánh dấu [P] có thể chạy song song (trong Phase 2)
- Khi Phase Nền tảng hoàn thành, tất cả user stories có thể bắt đầu song song (nếu đủ nhân lực)
- Tất cả kiểm thử cho một user story đánh dấu [P] có thể chạy song song
- Các model trong một story đánh dấu [P] có thể chạy song song
- Các user stories khác nhau có thể được làm song song bởi thành viên khác nhau

---

## Ví dụ Song song: User Story 1

```bash
# Chạy tất cả kiểm thử cho User Story 1 cùng nhau (nếu có yêu cầu kiểm thử):
Tác vụ: "Kiểm thử contract cho [endpoint] trong tests/contract/test_[tên].py"
Tác vụ: "Kiểm thử tích hợp cho [hành trình người dùng] trong tests/integration/test_[tên].py"

# Chạy tất cả models cho User Story 1 cùng nhau:
Tác vụ: "Tạo model [Entity1] trong src/models/[entity1].py"
Tác vụ: "Tạo model [Entity2] trong src/models/[entity2].py"
```

---

## Chiến lược Triển khai

### MVP Trước (Chỉ User Story 1)

1. Hoàn thành Phase 1: Thiết lập
2. Hoàn thành Phase 2: Nền tảng (NGHIÊM TRỌNG - chặn tất cả stories)
3. Hoàn thành Phase 3: User Story 1
4. **DỪNG và XÁC THỰC**: Kiểm thử User Story 1 độc lập
5. Triển khai/demo nếu sẵn sàng

### Phân phối Tăng dần

1. Hoàn thành Thiết lập + Nền tảng → Nền tảng sẵn sàng
2. Thêm User Story 1 → Kiểm thử độc lập → Triển khai/Demo (MVP!)
3. Thêm User Story 2 → Kiểm thử độc lập → Triển khai/Demo
4. Thêm User Story 3 → Kiểm thử độc lập → Triển khai/Demo
5. Mỗi story thêm giá trị không phá vỡ story trước

### Chiến lược Nhóm Song song

Với nhiều nhà phát triển:

1. Nhóm hoàn thành Thiết lập + Nền tảng cùng nhau
2. Khi Nền tảng xong:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Các story hoàn thành và tích hợp độc lập

---

## Ghi chú

- [P] tác vụ = file khác nhau, không phụ thuộc
- [Story] nhãn ánh xạ tác vụ đến user story cụ thể để truy xuất
- Mỗi user story phải có thể hoàn thành và kiểm thử độc lập
- Xác minh kiểm thử thất bại trước khi triển khai
- Commit sau mỗi tác vụ hoặc nhóm logic
- Dừng tại bất kỳ checkpoint nào để xác thực story độc lập
- Tránh: tác vụ mơ hồ, xung đột cùng file, phụ thuộc xuyên story phá vỡ tính độc lập
