# Hướng dẫn tạo Vườn và Lô cây mới (Garden & TreeBatch)

Chào bạn, đây là tài liệu hướng dẫn cách tạo và quản lý Vườn trong hệ thống **Farm-Farmer**.

> [!NOTE]
> Hệ thống được thiết kế theo cấu trúc phân cấp: **Nông hộ (Farm) > Vườn (Garden) > Lô cây (TreeBatch) > Loại cây (CropType)**. Điều này cho phép một vườn trồng xen canh nhiều loại cây khác nhau một cách dễ dàng.

## 1. Cách tạo Vườn mới (Garden)
Vườn là đơn vị đất đai trực thuộc một Nông hộ (Farm).
- **Quyền yêu cầu:** Chỉ `OWNER` hoặc `MANAGER` của Nông hộ mới có quyền tạo vườn.
- **Cách thực hiện:**
  1. Gửi request `POST /api/farms/:farmId/gardens`
  2. Gửi kèm Body JSON gồm tên vườn và diện tích.
  ```json
  {
    "name": "Vườn số 1 - Khu A",
    "area": 2.5
  }
  ```

## 2. Cách tạo Lô cây (Trồng xen canh)
Mỗi vườn có thể chứa nhiều lô cây khác nhau. Ví dụ: Vườn số 1 trồng cả Cà phê và Sầu riêng.
- **Quyền yêu cầu:** `OWNER`, `MANAGER`.
- **Cách thực hiện:**
  1. Gửi request `POST /api/farms/:farmId/gardens/:gardenId/tree-batches`
  2. Truyền `cropTypeId` tương ứng với loại cây muốn trồng.
  ```json
  {
    "cropTypeId": "uuid-cua-ca-phe",
    "name": "Lô Cà phê 2026",
    "startDate": "2026-09-01",
    "expectedEndDate": "2026-12-31",
    "status": "PLANTED"
  }
  ```
  3. Lặp lại bước trên với `cropTypeId` của Sầu riêng. Hệ thống tự động theo dõi hai lô cây này tách biệt, không bị lẫn lộn nhật ký hay chi phí.

## 3. Phân công Nông dân (Farmer/Worker)
> [!IMPORTANT]
> Nông dân (Worker) mặc định sẽ **KHÔNG THỂ** xem hoặc sửa thông tin vườn, trừ khi được chủ vườn phân công trực tiếp.

- Khi phân công, hệ thống sẽ tạo một record trong bảng `UserGardenAssignment`.
- Sau khi được gán, Nông dân có thể gọi `GET /api/farms/:farmId/gardens` và hệ thống sẽ chỉ trả về danh sách các Vườn mà họ được quyền tham gia làm việc.
- Nông dân chỉ có quyền xem (Read-only) thông tin tổng quan của Vườn.
