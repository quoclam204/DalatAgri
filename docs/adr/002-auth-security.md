# 002. Áp dụng Chuẩn Bảo Mật OWASP Top 10 cho Auth

Date: 2026-09-05

## Trạng thái
Được chấp nhận (Accepted)

## Bối cảnh
Dự án "Farm-Farmer" cần một cơ chế xác thực và phân quyền mạnh mẽ. Tuy nhiên, các hệ thống xác thực rất dễ bị tấn công nếu không tuân thủ các chuẩn mực an toàn thông tin (như Brute force, Credential stuffing, Broken Access Control). Chúng ta cần đảm bảo đáp ứng các tiêu chuẩn OWASP cơ bản ngay từ đầu.

## Quyết định
Chúng ta áp dụng 3 tiêu chuẩn OWASP sau vào hệ thống Auth:
1. **Băm mật khẩu an toàn (OWASP A02:2021 - Cryptographic Failures):** Sử dụng `bcrypt` với cost factor phù hợp để băm mật khẩu. Tuyệt đối không lưu plain text.
2. **Kiểm soát truy cập (OWASP A01:2021 - Broken Access Control):** 
   - Sử dụng `passport-jwt` kết hợp với Access Token (sống ngắn) và Refresh Token (sống dài).
   - Thiết lập các Decorator `@Roles` kết hợp `RolesGuard` để chặn quyền truy cập trái phép ở cấp độ Controller và Endpoint.
3. **Giới hạn số lần thử (OWASP A07:2021 - Identification and Authentication Failures):**
   - Sử dụng package `@nestjs/throttler` (Rate Limiting) và khai báo `ThrottlerGuard` ở mức toàn cục (Global Guard).
   - Giới hạn login tối đa 100 requests / 60 giây để chặn Brute force.

## Hậu quả (Consequences)
- Đảm bảo an toàn bảo mật cho dữ liệu người dùng.
- Throttler có thể ảnh hưởng đến quá trình Test tự động (End-to-End) do test runner gọi API quá nhanh. Giải pháp là tắt Throttler trong môi trường `NODE_ENV=test` hoặc mock nó.
