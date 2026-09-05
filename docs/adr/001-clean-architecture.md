# 001. Sử dụng Clean Architecture & Modular Monolith

Date: 2026-09-05

## Trạng thái
Được chấp nhận (Accepted)

## Bối cảnh
Dự án "Farm-Farmer" là một hệ thống quản lý nông trại tích hợp nhiều module (auth, users, farms, activity-logs, inventory). Việc giữ tất cả mã nguồn trong một cấu trúc MVC cơ bản của NestJS sẽ dễ dẫn đến tình trạng "Spaghetti code", khó bảo trì và mở rộng khi dự án lớn lên. Đồng thời, việc tách ra Microservices ngay từ đầu là không cần thiết (Over-engineering), gây tốn kém chi phí hạ tầng và phức tạp hóa quá trình CI/CD.

## Quyết định
Chúng ta sẽ sử dụng kiến trúc **Modular Monolith** kết hợp với tư tưởng của **Clean Architecture** ở mức độ module.
Bên trong mỗi Module (ví dụ: `src/auth`), mã nguồn sẽ được chia thành 3 lớp (Layers) chính:
1. **Domain**: Chứa các Entity, Interfaces, Types cốt lõi, không phụ thuộc vào Framework bên ngoài.
2. **Application**: Chứa các Use Cases (Services) và DTOs. Lớp này chứa logic nghiệp vụ và điều phối Domain.
3. **Infrastructure**: Chứa Controllers (HTTP), Guards, Strategies, và các Adapter giao tiếp với CSDL hoặc bên thứ 3. Lớp này phụ thuộc vào Application và Domain.

## Hậu quả (Consequences)
- **Tích cực:** Code dễ test (TDD) hơn rất nhiều nhờ việc Dependency Injection được chia lớp rõ ràng. Module có tính độc lập cao, sau này dễ dàng bóc tách thành Microservices nếu cần.
- **Tiêu cực:** Số lượng file và thư mục tăng lên, đòi hỏi developer phải nắm vững nguyên lý thiết kế và tuân thủ chặt chẽ. Cần quy ước rõ ràng về việc không import ngược từ Infrastructure vào Application.
