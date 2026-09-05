# Nhật ký canh tác

## Phạm vi MVP

Chức năng nhật ký hiện gắn mỗi hoạt động với một `CropCycle` (mùa vụ). Từ mùa vụ, hệ thống suy ra lô trồng, nông hộ và loại cây; người dùng không thể ghi nhật ký bằng tên lô tự do hoặc ghi vào nông hộ khác.

## API

Các endpoint nhật ký hiện không yêu cầu đăng nhập để phù hợp với luồng ghi nhanh ngoài đồng. Khi request có JWT, hệ thống vẫn lọc và kiểm tra quyền theo nông hộ của người dùng.

- `GET /activity-logs`: lấy lịch sử của người dùng hiện tại.
- `GET /activity-logs/:id`: xem một nhật ký.
- `POST /activity-logs`: tạo nhật ký.
- `PATCH /activity-logs/:id`: cập nhật nhật ký.
- `DELETE /activity-logs/:id`: xóa mềm nhật ký.

> Lưu ý: chế độ công khai cho phép người chưa đăng nhập xem, tạo và xóa nhật ký. Không dùng chế độ này cho dữ liệu tài chính production nếu chưa bổ sung tài khoản khách, mã PIN hoặc cơ chế phân quyền khác.

Bộ lọc của `GET /activity-logs`:

- `cropCycleId`
- `activityType`
- `from` và `to` theo ISO date

Loại hoạt động: `LAND_PREPARATION`, `WATERING`, `FERTILIZING`, `PESTICIDE`, `PRUNING`, `HARVEST`, `OTHER`.

## Ví dụ tạo nhật ký

```json
{
  "cropCycleId": "uuid-cua-mua-vu",
  "activityType": "FERTILIZING",
  "activityDate": "2026-09-05",
  "cost": 350000,
  "notes": "Bón phân hữu cơ sau khi tưới"
}
```

Với `HARVEST`, có thể gửi thêm `harvestQuantity` và `revenue`. Hai trường này bị từ chối với các loại hoạt động khác để tránh số liệu sai.

## Giao diện

Mở `http://localhost:5173/activity-logs` sau khi đăng nhập. Cần tạo nông hộ, lô trồng, cây trồng và mùa vụ trước. Giao diện hỗ trợ:

- Ghi hoạt động theo mùa vụ.
- Lọc lịch sử theo loại việc và khoảng ngày.
- Xem chi phí, sản lượng, doanh thu.
- Xóa mềm nhật ký.

Phần vật tư chi tiết và ảnh đính kèm sẽ nối vào `ActivityMaterial` và object storage ở giai đoạn tiếp theo; MVP hiện lưu chi phí và ghi chú trực tiếp trên nhật ký.
