# KẾ HOẠCH TRIỂN KHAI HỆ THỐNG QUẢN LÝ NÔNG TRẠI

## "Farm ⇄ Farmer" — Quản lý canh tác cây dài ngày (Cà phê, Sầu riêng, Mắc ca)

> Tài liệu này là bản đặc tả + kế hoạch triển khai (implementation plan) + checklist theo từng giai đoạn, kèm bộ prompt mẫu để giao việc cho AI (Claude Code hoặc công cụ tương tự) ở từng chức năng.

---

## MỤC LỤC

1. [Tổng quan sản phẩm](#1-tổng-quan-sản-phẩm)
2. [Đối tượng người dùng & vai trò](#2-đối-tượng-người-dùng--vai-trò)
3. [Kiến trúc hệ thống & công nghệ đề xuất](#3-kiến-trúc-hệ-thống--công-nghệ-đề-xuất)
4. [Thiết kế dữ liệu (Data Model)](#4-thiết-kế-dữ-liệu-data-model)
5. [Bảo mật — OWASP Checklist](#5-bảo-mật--owasp-checklist)
6. [Quy trình phát triển (TDD, CI/CD, tài liệu)](#6-quy-trình-phát-triển-tdd-cicd-tài-liệu)
7. [Lộ trình theo giai đoạn (Phases)](#7-lộ-trình-theo-giai-đoạn-phases)
8. [Checklist tổng hợp toàn dự án](#8-checklist-tổng-hợp-toàn-dự-án)
9. [Thư viện Prompt cho AI theo từng chức năng](#9-thư-viện-prompt-cho-ai-theo-từng-chức-năng)

---

## 1. TỔNG QUAN SẢN PHẨM

**Tên gọi tạm thời:** Farm-Farmer (có thể đổi sau)

**Bài toán:** Người quản lý nông trại (farm owner/manager) và nông dân/công nhân (farmer/worker) cần một công cụ để:

- Ghi **nhật ký canh tác** chi tiết theo từng loại cây dài ngày (cà phê, sầu riêng, mắc ca...) và theo từng vườn/lô cụ thể.
- Theo dõi **vật tư nông nghiệp**: phân bón, thuốc bảo vệ thực vật (BVTV), giống, và các chi phí khác.
- Quản lý **tài chính**: vốn đầu tư, chi phí nhân công (thuê hay không thuê), doanh thu, lợi nhuận theo vườn/theo vụ/theo cây.
- Có **tài khoản người dùng**, **báo cáo**, **thống kê** trực quan.
- **Số hóa** dữ liệu giấy tờ cũ (sổ tay, hóa đơn, hợp đồng) bằng **OCR**.
- Có **UI/UX** thân thiện, dễ dùng cho nông dân (có thể không rành công nghệ), hỗ trợ dùng trên điện thoại ngoài đồng.
- Có **hệ thống hỗ trợ người dùng** (trợ giúp, hướng dẫn, chatbot).

**Phạm vi MVP (Giai đoạn 1-2):**

- Quản lý vườn, cây trồng, nhật ký canh tác cơ bản, vật tư, chi phí.
- Chưa cần OCR, chưa cần AI chatbot nâng cao.

**Phạm vi mở rộng (Giai đoạn sau):** OCR, báo cáo nâng cao, đa người dùng/phân quyền chi tiết, ứng dụng di động offline-first.

---

## 2. ĐỐI TƯỢNG NGƯỜI DÙNG & VAI TRÒ

| Vai trò                                  | Mô tả                                            | Quyền hạn chính                                                      |
| ---------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| **Chủ vườn / Farm Owner**                | Sở hữu 1 hoặc nhiều vườn, nhiều loại cây         | Toàn quyền: xem báo cáo, tài chính, quản lý nhân công, cấu hình vườn |
| **Quản lý vườn / Farm Manager**          | Được chủ vườn ủy quyền quản lý 1 hoặc nhiều vườn | Ghi nhật ký, quản lý vật tư, xem báo cáo (có thể giới hạn tài chính) |
| **Nông dân / Công nhân (Farmer/Worker)** | Người trực tiếp canh tác                         | Ghi nhật ký công việc hàng ngày, chấm công                           |
| **Kế toán (tuỳ chọn)**                   | Theo dõi tài chính                               | Nhập chi phí, doanh thu, xuất báo cáo                                |
| **Admin hệ thống**                       | Vận hành nền tảng                                | Quản lý tài khoản, cấu hình hệ thống, hỗ trợ                         |

> Ghi chú thiết kế: mô hình phân quyền nên dùng **RBAC (Role-Based Access Control)**, mở rộng được sang **multi-tenant** (nhiều nông trại độc lập dùng chung hệ thống).

---

## 3. KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ ĐỀ XUẤT

### 3.1 Kiến trúc tổng thể

Đề xuất kiến trúc **modular monolith** cho giai đoạn đầu (dễ triển khai, dễ bảo trì), thiết kế sao cho có thể tách thành **microservices** sau này nếu cần scale (theo domain: Auth, Farm, Journal, Inventory, Finance, Report, OCR).

```
┌─────────────────────────────────────────────┐
│               Client Layer                   │
│  Web App (React/Next.js) + Mobile (React     │
│  Native / PWA offline-first)                 │
└───────────────────┬───────────────────────────┘
                    │ REST/GraphQL (HTTPS + JWT)
┌───────────────────▼───────────────────────────┐
│              API Gateway / BFF                │
└───────────────────┬───────────────────────────┘
                    │
┌───────────────────▼───────────────────────────┐
│           Application Layer (modules)         │
│  Auth | Farm&Tree | Journal | Inventory        │
│  Finance | Reporting | OCR/Document | Notif.   │
└───────────────────┬───────────────────────────┘
                    │
┌───────────────────▼───────────────────────────┐
│         Data Layer: PostgreSQL (chính)         │
│  + Object Storage (ảnh, file) + Redis (cache)  │
│  + Search (Elasticsearch/Meilisearch, tuỳ chọn)│
└─────────────────────────────────────────────┘
```

### 3.2 Công nghệ đề xuất (có thể điều chỉnh theo năng lực đội ngũ)

| Thành phần         | Lựa chọn đề xuất                                                             | Lý do                                                                          |
| ------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Backend            | Node.js (NestJS) hoặc Python (FastAPI)                                       | Hệ sinh thái mạnh, dễ tuyển dụng, TDD tốt                                      |
| Frontend Web       | Next.js (React) + TailwindCSS                                                | SEO tốt, SSR, UI nhanh                                                         |
| Mobile             | React Native hoặc PWA offline-first                                          | Nông dân dùng ngoài đồng, cần offline                                          |
| CSDL chính         | PostgreSQL                                                                   | Quan hệ rõ ràng (vườn-cây-nhật ký-chi phí), hỗ trợ JSONB cho dữ liệu linh hoạt |
| Cache              | Redis                                                                        | Tăng tốc truy vấn báo cáo, session                                             |
| Lưu trữ file       | S3-compatible (AWS S3/MinIO)                                                 | Ảnh vườn, hóa đơn scan                                                         |
| OCR                | Google Vision API / AWS Textract / Tesseract (self-host)                     | Nhận diện hóa đơn, sổ tay viết tay khó hơn — có thể cần Textract/Vision        |
| Auth               | JWT + Refresh Token, OAuth2 (Google login)                                   | Chuẩn công nghiệp                                                              |
| Realtime/Thông báo | WebSocket hoặc Firebase Cloud Messaging                                      | Nhắc lịch bón phân, phun thuốc                                                 |
| Hạ tầng            | Docker + CI/CD (GitHub Actions) + triển khai trên VPS/Cloud (AWS/GCP/Render) | Dễ scale, tái lập môi trường                                                   |
| Giám sát           | Sentry (lỗi), Prometheus+Grafana (metrics)                                   | Theo dõi vận hành                                                              |

### 3.3 Tổ chức mã nguồn (gợi ý theo Clean/Hexagonal Architecture)

```
/apps
  /web            # Next.js frontend
  /mobile         # React Native / PWA
  /api            # NestJS backend
/libs
  /domain         # Entities, business rules (thuần, không phụ thuộc framework)
  /application    # Use-cases / services
  /infrastructure # DB repository, OCR client, storage client
  /shared         # DTO, types dùng chung frontend-backend
/tests
  /unit
  /integration
  /e2e
/docs
  /adr            # Architecture Decision Records
  /api-spec       # OpenAPI/Swagger
```

---

## 4. THIẾT KẾ DỮ LIỆU (DATA MODEL)

Các thực thể cốt lõi (rút gọn, sẽ chi tiết hóa ở giai đoạn thiết kế):

- **User** (id, tên, sđt, email, role, farm_id liên kết)
- **Farm** (id, tên nông trại, chủ sở hữu, địa chỉ, diện tích tổng)
- **Garden/Plot — Vườn/Lô** (id, farm_id, tên vườn, diện tích, tọa độ GPS, loại đất)
- **Crop/TreeType — Loại cây** (id, tên: Cà phê/Sầu riêng/Mắc ca, chu kỳ sinh trưởng, đặc tính)
- **TreeBatch — Lô cây trồng** (id, garden_id, crop_id, năm trồng, số lượng cây, giống)
- **JournalEntry — Nhật ký canh tác** (id, garden_id, tree_batch_id, ngày, loại công việc: bón phân/phun thuốc/tưới/thu hoạch/cắt tỉa..., mô tả, người thực hiện, ảnh đính kèm)
- **Material — Vật tư** (id, tên, loại: phân bón/thuốc BVTV/giống/dụng cụ, đơn vị tính, nhà cung cấp)
- **MaterialUsage — Sử dụng vật tư** (id, journal_entry_id, material_id, số lượng, đơn giá, thành tiền)
- **Labor — Nhân công** (id, garden_id, ngày, loại: thuê ngoài/nhà làm, số công, đơn giá/công, tổng tiền)
- **Expense — Chi phí khác** (id, garden_id, loại chi phí, số tiền, ngày, ghi chú, hóa đơn đính kèm)
- **Investment — Đầu tư** (id, farm_id/garden_id, loại đầu tư: giống/máy móc/cải tạo đất, số tiền, ngày, nguồn vốn)
- **Revenue — Doanh thu** (id, garden_id, crop_id, ngày bán, sản lượng, đơn giá, thành tiền, khách mua)
- **Report/Statistic — Báo cáo** (tổng hợp theo vườn/cây/kỳ: chi phí, doanh thu, lợi nhuận, ROI)
- **Document — Tài liệu số hóa** (id, loại tài liệu, file gốc, kết quả OCR dạng text/JSON, liên kết tới Expense/Revenue/JournalEntry)

**Quan hệ chính:** Farm 1—n Garden; Garden 1—n TreeBatch; TreeBatch 1—n JournalEntry; JournalEntry 1—n MaterialUsage; Garden 1—n Labor/Expense/Investment/Revenue.

> Lưu ý thiết kế quan trọng: vì có **nhiều loại cây trong cùng 1 vườn** hoặc **1 loại cây ở nhiều vườn**, nên chi phí/doanh thu/lợi nhuận cần được tính **theo tổ hợp (vườn × loại cây × kỳ)**, không chỉ theo vườn.

---

## 5. BẢO MẬT — OWASP CHECKLIST

Áp dụng theo OWASP Top 10 (2021) xuyên suốt các giai đoạn, không để dồn về cuối:

- [ ] **A01 Broken Access Control**: kiểm tra quyền ở mọi endpoint (không chỉ ẩn UI); test bằng các role khác nhau; kiểm thử IDOR (truy cập dữ liệu vườn của người khác qua sửa ID).
- [ ] **A02 Cryptographic Failures**: mã hoá dữ liệu nhạy cảm khi lưu trữ (mật khẩu bằng bcrypt/argon2), HTTPS bắt buộc, không log dữ liệu nhạy cảm.
- [ ] **A03 Injection**: dùng ORM/prepared statements, validate input (Zod/class-validator), sanitize dữ liệu OCR trước khi lưu.
- [ ] **A04 Insecure Design**: threat modeling trước khi code từng module tài chính; review thiết kế phân quyền.
- [ ] **A05 Security Misconfiguration**: rà soát cấu hình CORS, headers bảo mật (Helmet.js), tắt debug mode ở production.
- [ ] **A06 Vulnerable Components**: quét dependency (npm audit, Snyk/Dependabot) định kỳ.
- [ ] **A07 Identification & Authentication Failures**: rate limit đăng nhập, khoá tài khoản sau nhiều lần sai, MFA cho chủ vườn (tuỳ chọn).
- [ ] **A08 Software & Data Integrity Failures**: ký số/verify checksum cho file upload, kiểm soát CI/CD pipeline.
- [ ] **A09 Security Logging & Monitoring**: log truy cập dữ liệu tài chính, cảnh báo hành vi bất thường (xoá hàng loạt, export dữ liệu lớn).
- [ ] **A10 Server-Side Request Forgery (SSRF)**: kiểm soát chặt các request tới OCR API/webhook bên ngoài.

**Bổ sung riêng cho ứng dụng nông nghiệp có dữ liệu tài chính:**

- [ ] Audit trail đầy đủ cho mọi thay đổi tài chính (ai sửa, khi nào, giá trị cũ/mới).
- [ ] Phân quyền xem dữ liệu tài chính riêng biệt với dữ liệu nhật ký canh tác.
- [ ] Sao lưu (backup) dữ liệu định kỳ + kiểm thử khôi phục (restore drill).

---

## 6. QUY TRÌNH PHÁT TRIỂN (TDD, CI/CD, TÀI LIỆU)

**Nguyên tắc:**

- **Test-Driven Development (TDD)** cho các module nghiệp vụ cốt lõi (tính chi phí, lợi nhuận, phân quyền) — viết test trước, code sau.
- Mỗi Pull Request bắt buộc có: unit test, mô tả thay đổi, cập nhật tài liệu liên quan (nếu có).
- **CI pipeline**: lint → unit test → integration test → build → security scan (SAST) → deploy staging.
- **Tài liệu bắt buộc mỗi giai đoạn**: đặc tả chức năng (spec), API doc (OpenAPI), sơ đồ ERD/luồng nếu có thay đổi dữ liệu, hướng dẫn sử dụng (user guide) cho tính năng mới.
- **Định nghĩa hoàn thành (Definition of Done - DoD)** cho mỗi task:
  1. Code đã review & merge.
  2. Test pass (coverage tối thiểu theo module, ví dụ ≥ 80% cho module tài chính).
  3. Không có lỗi bảo mật mức cao từ scan.
  4. Tài liệu cập nhật.
  5. Demo được cho stakeholder (nếu là tính năng người dùng thấy được).

---

## 7. LỘ TRÌNH THEO GIAI ĐOẠN (PHASES)

> Mỗi giai đoạn gồm: **Mục tiêu → Đặc tả chức năng → Sản phẩm bàn giao → Test cần có → Tài liệu → Checklist hoàn thành**.

### GIAI ĐOẠN 0 — Khởi tạo dự án & Kiến trúc nền tảng

**Mục tiêu:** Có bộ khung dự án chạy được, CI/CD, CSDL cơ bản, xác thực người dùng.

**Đặc tả:**

- Khởi tạo repo, cấu trúc thư mục theo mục 3.3.
- Thiết lập PostgreSQL, migration tool (Prisma/TypeORM/Knex).
- Đăng ký/đăng nhập (email+mật khẩu, JWT), phân quyền cơ bản (Owner/Manager/Farmer/Admin).
- Thiết lập CI (lint, test, build).

**Sản phẩm bàn giao:** Ứng dụng chạy local + staging; API đăng ký/đăng nhập hoạt động; tài liệu README + hướng dẫn setup.

**Test:** Unit test cho auth (đăng ký, đăng nhập, refresh token, phân quyền sai bị chặn); integration test API auth.

**Tài liệu:** README, ADR về lựa chọn công nghệ, sơ đồ kiến trúc.

**Checklist:**

- [ ] Repo + CI hoạt động
- [ ] CSDL kết nối được, migration chạy được
- [ ] Đăng ký/đăng nhập/phân quyền cơ bản pass test
- [ ] OWASP A01, A02, A07 áp dụng ngay từ đầu

---

### GIAI ĐOẠN 1 — Quản lý Nông trại, Vườn, Loại cây

**Mục tiêu:** Cho phép tạo và quản lý nông trại, vườn/lô, loại cây, lô cây trồng.

**Đặc tả chức năng:**

- CRUD Farm (chủ vườn tạo nông trại của mình).
- CRUD Garden/Plot (thuộc 1 farm; diện tích, tọa độ, loại đất).
- CRUD Crop Type (Cà phê, Sầu riêng, Mắc ca — mở rộng được loại cây mới).
- CRUD Tree Batch (lô cây trong 1 vườn: loại cây, năm trồng, số lượng, giống).
- Mời/gán người dùng (Manager, Farmer) vào Farm/Garden cụ thể.

**Sản phẩm bàn giao:** API + UI quản lý farm/vườn/cây; màn hình "Nông trại của tôi" liệt kê các vườn.

**Test:** Test tạo/sửa/xoá vườn; test 1 vườn có nhiều loại cây; test phân quyền truy cập vườn (Farmer chỉ thấy vườn được gán).

**Tài liệu:** API spec (OpenAPI) cho module Farm; user guide "Cách tạo vườn mới".

**Checklist:**

- [ ] Tạo được nông trại, nhiều vườn, nhiều loại cây trong 1 vườn
- [ ] Gán người dùng vào vườn hoạt động đúng phân quyền
- [ ] Test coverage đạt yêu cầu

---

### GIAI ĐOẠN 2 — Nhật ký canh tác (Journal)

**Mục tiêu:** Ghi nhận công việc canh tác hàng ngày theo từng loại cây, từng vườn.

**Đặc tả chức năng:**

- Ghi nhật ký: ngày, vườn, lô cây, loại công việc (bón phân, phun thuốc, tưới nước, cắt tỉa, thu hoạch, khác), mô tả, người thực hiện, đính kèm ảnh.
- Liên kết nhật ký với vật tư sử dụng (xem Giai đoạn 3) và nhân công (Giai đoạn 4).
- Xem lịch sử nhật ký theo vườn/theo cây/theo khoảng thời gian.
- Nhắc lịch (tuỳ chọn): nhắc bón phân định kỳ, phun thuốc theo chu kỳ.

**Sản phẩm bàn giao:** Màn hình nhập nhật ký nhanh (tối ưu cho mobile), màn hình xem lịch sử/lọc.

**Test:** Test tạo nhật ký gắn đúng vườn+lô cây; test lọc theo cây/thời gian; test ảnh đính kèm upload đúng.

**Tài liệu:** API spec module Journal; user guide "Ghi nhật ký canh tác hàng ngày".

**Checklist:**

- [ ] Nhật ký ghi được cho từng loại cây, từng vườn riêng biệt
- [ ] Lọc/tìm kiếm nhật ký hoạt động
- [ ] Upload ảnh hoạt động, giới hạn dung lượng hợp lý

---

### GIAI ĐOẠN 3 — Quản lý Vật tư (Phân, Thuốc BVTV, Chi phí khác)

**Mục tiêu:** Quản lý kho vật tư và ghi nhận sử dụng vật tư gắn với nhật ký.

**Đặc tả chức năng:**

- Danh mục vật tư: phân bón, thuốc BVTV, giống, dụng cụ (tên, đơn vị, nhà cung cấp, giá tham khảo).
- Nhập kho / xuất kho vật tư (tồn kho theo vườn hoặc theo farm).
- Ghi nhận sử dụng vật tư trong 1 nhật ký (số lượng, đơn giá tại thời điểm dùng → tự tính thành tiền).
- Cảnh báo tồn kho thấp (tuỳ chọn).
- Ghi "chi phí khác" không thuộc vật tư (thuê máy, vận chuyển, sửa chữa...).

**Sản phẩm bàn giao:** Màn hình quản lý kho vật tư; form chọn vật tư khi ghi nhật ký; báo cáo tồn kho.

**Test:** Test trừ tồn kho khi ghi nhận sử dụng; test tính đúng thành tiền; test cảnh báo tồn kho âm không được phép.

**Tài liệu:** API spec Inventory; user guide "Quản lý vật tư và kho".

**Checklist:**

- [ ] Nhập/xuất kho chính xác, không cho tồn kho âm
- [ ] Sử dụng vật tư tự động tính chi phí
- [ ] Chi phí khác ghi nhận được, phân loại rõ ràng

---

### GIAI ĐOẠN 4 — Đầu tư, Nhân công, Chi phí tổng hợp

**Mục tiêu:** Theo dõi dòng tiền chi ra: đầu tư ban đầu, nhân công (thuê/nhà làm), tổng chi phí.

**Đặc tả chức năng:**

- Ghi nhận khoản đầu tư (giống, máy móc, cải tạo đất, hạ tầng tưới tiêu...) theo farm/vườn, có nguồn vốn (vốn tự có/vay).
- Ghi nhận công lao động: chọn loại (thuê ngoài theo ngày công / lao động nhà không tính lương / lao động nhà có tính chi phí cơ hội), số công, đơn giá.
- Tổng hợp chi phí theo vườn × loại cây × kỳ (tháng/quý/năm/theo vụ).

**Sản phẩm bàn giao:** Màn hình nhập đầu tư & nhân công; báo cáo tổng chi phí theo nhiều chiều lọc.

**Test:** Test tính tổng chi phí = vật tư + nhân công + chi phí khác + khấu hao đầu tư (nếu áp dụng); test lọc theo tổ hợp vườn+cây+kỳ.

**Tài liệu:** API spec Finance-Cost; user guide "Theo dõi chi phí đầu tư & nhân công".

**Checklist:**

- [ ] Đầu tư ghi nhận và phân loại được nguồn vốn
- [ ] Nhân công thuê/nhà làm phân biệt rõ, tính đúng chi phí
- [ ] Báo cáo chi phí tổng hợp đúng theo tổ hợp vườn/cây/kỳ

---

### GIAI ĐOẠN 5 — Doanh thu, Lợi nhuận, Tài khoản & Báo cáo/Thống kê

**Mục tiêu:** Ghi nhận doanh thu và tự động tính lợi nhuận; xây dựng dashboard báo cáo/thống kê.

**Đặc tả chức năng:**

- Ghi nhận doanh thu: sản lượng thu hoạch, đơn giá bán, khách mua, ngày bán — theo vườn/loại cây/lô cây.
- Tính lợi nhuận = Doanh thu − Tổng chi phí (theo tổ hợp vườn×cây×kỳ); tính ROI trên vốn đầu tư.
- Dashboard tổng quan: biểu đồ chi phí/doanh thu/lợi nhuận theo thời gian, theo vườn, theo loại cây; so sánh giữa các vụ.
- Trang "Tài khoản" người dùng: thông tin cá nhân, đổi mật khẩu, quản lý người được gán vào vườn.
- Xuất báo cáo (PDF/Excel) theo kỳ.

**Sản phẩm bàn giao:** Dashboard thống kê; trang tài khoản; chức năng xuất báo cáo.

**Test:** Test công thức lợi nhuận đúng trong nhiều kịch bản (nhiều vườn, nhiều cây, có/không đầu tư); test xuất báo cáo đúng số liệu; test phân quyền xem báo cáo tài chính.

**Tài liệu:** API spec Reporting; user guide "Đọc hiểu báo cáo lợi nhuận"; giải thích công thức tính cho người dùng không rành tài chính.

**Checklist:**

- [ ] Lợi nhuận tính đúng, có thể kiểm chứng thủ công đối chiếu
- [ ] Dashboard trực quan, load nhanh (có cache/Redis nếu cần)
- [ ] Xuất báo cáo PDF/Excel chính xác
- [ ] Phân quyền xem tài chính đúng theo vai trò

---

### GIAI ĐOẠN 6 — UI/UX hoàn thiện & Tối ưu trải nghiệm

**Mục tiêu:** Đảm bảo giao diện dễ dùng cho nông dân, tối ưu cho mobile/ngoài đồng, hỗ trợ điều kiện mạng yếu.

**Đặc tả chức năng:**

- Rà soát toàn bộ luồng người dùng (onboarding, ghi nhật ký nhanh trong <30s, nhập liệu tối thiểu).
- Thiết kế responsive, ưu tiên mobile-first; hỗ trợ nhập liệu bằng giọng nói (tuỳ chọn) cho nông dân lớn tuổi.
- Chế độ **offline-first**: cho phép ghi nhật ký khi không có mạng, đồng bộ khi có mạng lại.
- Đa ngôn ngữ (nếu cần mở rộng vùng miền/dân tộc).
- Kiểm thử usability với người dùng thật (nông dân mẫu).

**Sản phẩm bàn giao:** Bộ UI kit/design system; ứng dụng mobile/PWA hỗ trợ offline; báo cáo usability testing.

**Test:** Test đồng bộ dữ liệu offline→online không mất/trùng dữ liệu; test trên thiết bị Android phổ thông, mạng 3G/yếu.

**Tài liệu:** Design system doc; hướng dẫn sử dụng minh hoạ bằng hình ảnh/video ngắn.

**Checklist:**

- [ ] Luồng ghi nhật ký tối giản, đo được thời gian hoàn thành
- [ ] Offline hoạt động và đồng bộ chính xác
- [ ] Test usability với ít nhất 3-5 người dùng thật

---

### GIAI ĐOẠN 7 — Số hóa tài liệu & OCR

**Mục tiêu:** Cho phép chụp ảnh/scan hóa đơn, sổ tay cũ và trích xuất dữ liệu tự động.

**Đặc tả chức năng:**

- Upload ảnh/scan tài liệu (hóa đơn mua vật tư, sổ ghi chép tay, hợp đồng bán hàng).
- Gọi OCR (Google Vision/AWS Textract) trích xuất text; với hóa đơn, cố gắng nhận diện các trường: ngày, số tiền, tên vật tư/số lượng, nhà cung cấp.
- Cho người dùng xác nhận/sửa lại kết quả OCR trước khi lưu chính thức vào hệ thống (OCR không tự động ghi thẳng vào sổ tài chính — luôn cần xác nhận của người dùng để tránh sai số liệu).
- Liên kết tài liệu gốc với bản ghi Expense/Revenue/JournalEntry tương ứng để tra cứu sau này.

**Sản phẩm bàn giao:** Chức năng chụp ảnh → OCR → form xác nhận → lưu bản ghi; kho lưu trữ tài liệu gốc.

**Test:** Test độ chính xác OCR trên tập mẫu hóa đơn thật; test luồng xác nhận/sửa không bị mất dữ liệu gốc; test bảo mật file upload (kiểm tra loại file, quét virus nếu cần).

**Tài liệu:** API spec Document/OCR; user guide "Số hóa hóa đơn bằng camera điện thoại".

**Checklist:**

- [ ] OCR trích xuất được các trường cơ bản với độ chính xác chấp nhận được
- [ ] Người dùng luôn xác nhận trước khi ghi vào sổ tài chính
- [ ] Tài liệu gốc lưu trữ an toàn, tra cứu lại được

---

### GIAI ĐOẠN 8 — Hỗ trợ người dùng

**Mục tiêu:** Người dùng (đặc biệt nông dân không rành công nghệ) được hỗ trợ hiệu quả.

**Đặc tả chức năng:**

- Trung tâm trợ giúp (FAQ, hướng dẫn từng bước có hình ảnh).
- Chatbot hỗ trợ cơ bản (trả lời câu hỏi thường gặp, hướng dẫn thao tác) — có thể dùng AI (ví dụ Claude API) để trả lời dựa trên tài liệu hướng dẫn nội bộ.
- Kênh liên hệ hỗ trợ trực tiếp (hotline/Zalo/gửi yêu cầu trong app).
- Video hướng dẫn ngắn cho các thao tác chính (ghi nhật ký, xem báo cáo, số hóa hóa đơn).

**Sản phẩm bàn giao:** Trang trợ giúp; chatbot tích hợp; kênh gửi yêu cầu hỗ trợ.

**Test:** Test chatbot trả lời đúng phạm vi cho phép, từ chối lịch sự ngoài phạm vi; test luồng gửi yêu cầu hỗ trợ đến đúng đội ngũ.

**Tài liệu:** Kịch bản hội thoại chatbot; tài liệu vận hành đội hỗ trợ.

**Checklist:**

- [ ] FAQ/hướng dẫn bao phủ các thao tác chính
- [ ] Chatbot hoạt động ổn định, không trả lời sai lệch thông tin tài chính
- [ ] Kênh hỗ trợ trực tiếp hoạt động thông suốt

---

### GIAI ĐOẠN 9 — Kiểm thử toàn diện, Bảo mật & Triển khai chính thức

**Mục tiêu:** Đảm bảo hệ thống ổn định, an toàn trước khi ra mắt rộng rãi.

**Đặc tả:**

- Kiểm thử end-to-end toàn bộ luồng nghiệp vụ chính.
- Kiểm thử tải (load testing) cho các báo cáo/dashboard.
- Đánh giá bảo mật độc lập (penetration test hoặc ít nhất chạy OWASP ZAP).
- Chuẩn bị vận hành: backup, giám sát, kế hoạch xử lý sự cố (incident response).
- Đào tạo người dùng thí điểm, thu thập phản hồi trước khi mở rộng.

**Sản phẩm bàn giao:** Báo cáo kiểm thử; báo cáo bảo mật; hệ thống chạy production ổn định.

**Checklist:**

- [ ] Toàn bộ checklist OWASP ở mục 5 được rà soát lại lần cuối
- [ ] Load test đạt yêu cầu (xác định trước số người dùng đồng thời mục tiêu)
- [ ] Backup/restore đã kiểm thử thành công
- [ ] Người dùng thí điểm xác nhận hài lòng với luồng chính

---

## 8. CHECKLIST TỔNG HỢP TOÀN DỰ ÁN

- [ ] GĐ0: Nền tảng, Auth, CI/CD
- [ ] GĐ1: Farm / Vườn / Loại cây
- [ ] GĐ2: Nhật ký canh tác
- [ ] GĐ3: Vật tư (phân, thuốc BVTV, chi phí khác)
- [ ] GĐ4: Đầu tư & Nhân công
- [ ] GĐ5: Doanh thu, Lợi nhuận, Báo cáo/Thống kê/Tài khoản
- [ ] GĐ6: UI/UX & Offline
- [ ] GĐ7: Số hóa tài liệu & OCR
- [ ] GĐ8: Hỗ trợ người dùng
- [ ] GĐ9: Kiểm thử toàn diện & Triển khai chính thức

---

## 9. THƯ VIỆN PROMPT CHO AI THEO TỪNG CHỨC NĂNG

> Dùng các prompt này để giao việc cho AI coding assistant (Claude Code, v.v.). Mỗi prompt nên đi kèm ngữ cảnh dự án (đường dẫn repo, stack đã chọn) khi thực thi.

### 9.1 Prompt khởi tạo dự án (Giai đoạn 0)

```
Bạn là kỹ sư phần mềm senior. Hãy khởi tạo một dự án modular monolith cho hệ thống
quản lý nông trại "Farm-Farmer" với stack: [NestJS/FastAPI] cho backend,
[Next.js] cho frontend, PostgreSQL cho CSDL.

Yêu cầu:
1. Tạo cấu trúc thư mục theo Clean Architecture (domain/application/infrastructure).
2. Thiết lập kết nối PostgreSQL + migration tool.
3. Cài đặt CI cơ bản (lint, test, build) bằng GitHub Actions.
4. Viết README hướng dẫn setup local.
5. Áp dụng TDD: viết test trước cho module Auth (đăng ký, đăng nhập, JWT, refresh
   token) trước khi implement.
6. Đảm bảo checklist OWASP A01 (access control), A02 (crypto), A07 (auth) được
   áp dụng ngay từ đầu — dùng bcrypt/argon2 cho mật khẩu, rate limit đăng nhập.

Đầu ra: source code, test pass, README, và một đoạn giải thích các quyết định
kiến trúc (ADR ngắn gọn).
```

### 9.2 Prompt module Farm/Garden/Crop (Giai đoạn 1)

```
Xây dựng module quản lý Nông trại - Vườn - Loại cây - Lô cây trồng.

Data model:
- Farm(id, name, owner_id, address)
- Garden(id, farm_id, name, area, gps_lat, gps_lng, soil_type)
- CropType(id, name, growth_cycle_info)
- TreeBatch(id, garden_id, crop_type_id, planted_year, tree_count, variety)
- UserGardenAssignment(user_id, garden_id, role)

Yêu cầu:
1. Viết test trước (TDD): CRUD cho từng entity, ràng buộc 1 vườn có thể chứa
   nhiều TreeBatch với nhiều CropType khác nhau.
2. Kiểm tra phân quyền: chỉ Owner/Manager được sửa Garden; Farmer chỉ xem được
   vườn mình được gán (UserGardenAssignment).
3. API REST theo chuẩn OpenAPI, sinh file swagger.json.
4. Viết test cho tình huống: 1 vườn trồng cả cà phê và sầu riêng cùng lúc,
   đảm bảo dữ liệu không bị lẫn giữa hai loại cây.

Đầu ra: code + test pass + OpenAPI spec + user guide ngắn "Cách tạo vườn mới".
```

### 9.3 Prompt module Nhật ký canh tác (Giai đoạn 2)

```
Xây dựng module Nhật ký canh tác (JournalEntry).

Data model:
- JournalEntry(id, garden_id, tree_batch_id, date, work_type, description,
  performed_by_user_id, photos[])
work_type: FERTILIZE | PESTICIDE | WATER | PRUNE | HARVEST | OTHER

Yêu cầu:
1. TDD: test tạo nhật ký, validate work_type hợp lệ, validate garden_id +
   tree_batch_id phải khớp nhau (tree_batch phải thuộc garden đó).
2. API lọc nhật ký theo: khoảng thời gian, loại cây, loại công việc, vườn.
3. Hỗ trợ đính kèm nhiều ảnh (upload lên object storage, lưu URL).
4. Thiết kế API tối ưu cho mobile: 1 request tạo nhật ký kèm ảnh, tối thiểu
   round-trip.
5. (Tuỳ chọn) API nhắc lịch: sinh ra nhắc nhở dựa trên chu kỳ bón phân/phun
   thuốc trung bình của loại cây.

Đầu ra: code + test + API spec + ví dụ request/response mẫu.
```

### 9.4 Prompt module Vật tư & Kho (Giai đoạn 3)

```
Xây dựng module Vật tư (Inventory) gồm danh mục vật tư, tồn kho, và sử dụng
vật tư gắn với nhật ký canh tác.

Data model:
- Material(id, name, category[FERTILIZER|PESTICIDE|SEED|TOOL|OTHER], unit,
  supplier, reference_price)
- MaterialStock(material_id, garden_id, quantity_on_hand)
- MaterialUsage(id, journal_entry_id, material_id, quantity, unit_price, total_cost)
- OtherExpense(id, garden_id, category, amount, date, note, receipt_document_id)

Yêu cầu:
1. TDD trước: test nhập kho tăng tồn, xuất kho (qua MaterialUsage) giảm tồn,
   KHÔNG cho phép tồn kho âm — trả lỗi rõ ràng khi vượt tồn kho.
2. Tự động tính total_cost = quantity * unit_price khi ghi MaterialUsage.
3. API báo cáo tồn kho theo vườn, theo loại vật tư, cảnh báo tồn kho dưới
   ngưỡng (ngưỡng cấu hình được).
4. API ghi OtherExpense độc lập với vật tư (chi phí thuê máy, vận chuyển...).

Đầu ra: code + test coverage ≥ 80% cho logic tính tiền + API spec.
```

### 9.5 Prompt module Đầu tư & Nhân công (Giai đoạn 4)

```
Xây dựng module Đầu tư (Investment) và Nhân công (Labor).

Data model:
- Investment(id, farm_id, garden_id, category[SEEDLING|MACHINERY|LAND_IMPROVEMENT|
  IRRIGATION|OTHER], amount, date, funding_source[OWN_CAPITAL|LOAN])
- Labor(id, garden_id, date, labor_type[HIRED|FAMILY_UNPAID|FAMILY_OPPORTUNITY_COST],
  work_days, rate_per_day, total_cost)

Yêu cầu:
1. TDD: test tính total_cost cho Labor; test phân loại funding_source cho
   Investment; test không cho phép rate_per_day âm.
2. API tổng hợp chi phí theo tổ hợp (garden_id, crop_type_id, kỳ báo cáo:
   tháng/quý/năm/theo vụ) = tổng(MaterialUsage.total_cost) +
   tổng(Labor.total_cost) + tổng(OtherExpense.amount) [+ phân bổ khấu hao
   Investment nếu áp dụng].
3. Viết rõ tài liệu giải thích công thức phân bổ chi phí đầu tư (ví dụ: khấu
   hao theo số năm sử dụng dự kiến) để người dùng không rành tài chính vẫn
   hiểu được.

Đầu ra: code + test + tài liệu công thức tính chi phí tổng hợp.
```

### 9.6 Prompt module Doanh thu, Lợi nhuận, Báo cáo (Giai đoạn 5)

```
Xây dựng module Doanh thu (Revenue) và Báo cáo Lợi nhuận (Profit Report).

Data model:
- Revenue(id, garden_id, tree_batch_id, sale_date, quantity, unit_price,
  total_amount, buyer)

Yêu cầu:
1. TDD: test tính total_amount = quantity * unit_price.
2. API tính lợi nhuận theo tổ hợp (garden × crop_type × kỳ):
   profit = sum(Revenue.total_amount) - total_cost (lấy từ module 9.5).
   Viết test với ít nhất 3 kịch bản: (a) 1 vườn 1 loại cây, (b) 1 vườn nhiều
   loại cây phải tách riêng chi phí/doanh thu theo cây, (c) nhiều vườn cùng
   1 farm cộng dồn báo cáo cấp farm.
3. API tính ROI = profit / tổng Investment liên quan.
4. Xây dashboard: biểu đồ theo thời gian (line chart), so sánh vườn/loại cây
   (bar chart), có thể lọc theo kỳ.
5. Chức năng xuất báo cáo PDF/Excel với đúng số liệu như trên dashboard.
6. Áp dụng phân quyền: chỉ Owner và Kế toán được xem chi tiết tài chính đầy
   đủ; Manager/Farmer thấy dữ liệu giới hạn theo cấu hình.

Đầu ra: code + test + tài liệu giải thích công thức cho người dùng cuối +
mẫu báo cáo PDF/Excel.
```

### 9.7 Prompt UI/UX & Offline-first (Giai đoạn 6)

```
Thiết kế và xây dựng UI/UX cho ứng dụng mobile-first "Farm-Farmer", ưu tiên
người dùng là nông dân, thao tác ngoài đồng, mạng yếu.

Yêu cầu:
1. Thiết kế luồng "Ghi nhật ký nhanh" tối đa 3 bước, không quá 30 giây thao
   tác trung bình.
2. Áp dụng chế độ offline-first: dữ liệu nhật ký được lưu local (IndexedDB/
   SQLite) khi mất mạng, đồng bộ tự động khi có mạng lại, xử lý xung đột
   (conflict resolution) khi 2 thiết bị sửa cùng bản ghi.
3. Responsive, chữ to, icon rõ ràng, hạn chế thuật ngữ kỹ thuật.
4. Viết test đồng bộ offline→online: tạo nhật ký offline trên 2 thiết bị,
   đảm bảo cả 2 đều được đồng bộ không mất dữ liệu khi có mạng.
5. Thực hiện usability test với ít nhất 3 người dùng mẫu, ghi lại phản hồi
   và các điểm cần cải thiện.

Đầu ra: design system doc, code UI, kịch bản test đồng bộ offline, báo cáo
usability testing.
```

### 9.8 Prompt Số hóa tài liệu & OCR (Giai đoạn 7)

```
Xây dựng module Số hóa tài liệu (Document + OCR) cho phép chụp ảnh hóa đơn/
sổ tay và trích xuất dữ liệu.

Yêu cầu:
1. API upload ảnh/scan → lưu vào object storage → gọi OCR API (Google Vision/
   AWS Textract) → trả về text thô + các trường được nhận diện (ngày, số
   tiền, tên vật tư nếu có).
2. Thiết kế form xác nhận: người dùng XEM và SỬA kết quả OCR trước khi hệ
   thống ghi vào MaterialUsage/OtherExpense/Revenue tương ứng — không bao
   giờ tự động ghi thẳng vào sổ tài chính mà không qua xác nhận.
3. Lưu liên kết giữa Document gốc và bản ghi tài chính được tạo ra, để tra
   cứu lại chứng từ gốc sau này.
4. Viết test: giả lập kết quả OCR (mock), test luồng xác nhận/sửa/lưu; test
   an toàn upload (giới hạn loại file ảnh/pdf, giới hạn dung lượng).
5. Đánh giá độ chính xác OCR trên tập mẫu hóa đơn thật (ít nhất 20 mẫu),
   ghi nhận tỷ lệ chính xác theo từng trường dữ liệu.

Đầu ra: code + test + báo cáo độ chính xác OCR + user guide có hình minh họa.
```

### 9.9 Prompt Hỗ trợ người dùng / Chatbot (Giai đoạn 8)

```
Xây dựng hệ thống hỗ trợ người dùng gồm trung tâm trợ giúp và chatbot.

Yêu cầu:
1. Viết bộ FAQ/hướng dẫn từng bước (kèm ảnh chụp màn hình) cho các thao tác:
   tạo vườn, ghi nhật ký, ghi vật tư, xem báo cáo, số hóa hóa đơn.
2. Xây dựng chatbot dùng Claude API, với system prompt giới hạn phạm vi trả
   lời trong tài liệu hướng dẫn nội bộ của ứng dụng; chatbot PHẢI từ chối trả
   lời và hướng người dùng liên hệ hỗ trợ trực tiếp nếu câu hỏi liên quan đến
   số liệu tài chính cụ thể của người dùng đó (không tự suy đoán số liệu).
3. Thiết kế kênh gửi yêu cầu hỗ trợ trong app, định tuyến đến đúng đội ngũ
   (kỹ thuật/nghiệp vụ).
4. Viết test cho chatbot: test các câu hỏi trong phạm vi (trả lời đúng), test
   câu hỏi ngoài phạm vi (từ chối đúng cách, không bịa thông tin).

Đầu ra: nội dung FAQ, cấu hình chatbot + system prompt, code tích hợp, test
kịch bản hội thoại.
```

### 9.10 Prompt Kiểm thử toàn diện & Bảo mật (Giai đoạn 9)

```
Thực hiện kiểm thử toàn diện và rà soát bảo mật trước khi triển khai chính thức.

Yêu cầu:
1. Viết bộ test end-to-end cho các luồng chính: tạo vườn → ghi nhật ký →
   ghi vật tư/chi phí → ghi doanh thu → xem báo cáo lợi nhuận → xuất báo cáo.
2. Chạy load test cho API dashboard/báo cáo với [X] người dùng đồng thời
   (xác định con số mục tiêu cụ thể trước khi test).
3. Chạy OWASP ZAP (hoặc công cụ tương đương) quét toàn bộ API, liệt kê các
   lỗ hổng theo mức độ nghiêm trọng và đề xuất khắc phục.
4. Rà soát lại toàn bộ checklist OWASP Top 10 đã áp dụng ở các giai đoạn
   trước, xác nhận không có mục nào bị bỏ sót.
5. Kiểm thử backup/restore: backup CSDL, xoá dữ liệu thử nghiệm, restore lại,
   xác nhận dữ liệu khôi phục đúng 100%.

Đầu ra: báo cáo test coverage, báo cáo load test, báo cáo bảo mật kèm mức độ
rủi ro và khuyến nghị, biên bản kiểm thử backup/restore thành công.
```

---

## GHI CHÚ CUỐI

- Tài liệu này nên được cập nhật liên tục khi có thay đổi phạm vi hoặc phát hiện vấn đề mới trong quá trình triển khai.
- Nên lập một file `docs/adr/` riêng để ghi lại các quyết định kiến trúc quan trọng (ví dụ: chọn PostgreSQL thay vì MongoDB, chọn NestJS thay vì Express thuần...).
- Có thể chia đội theo giai đoạn hoặc theo module (Farm, Journal, Finance, OCR) tùy quy mô đội ngũ.
