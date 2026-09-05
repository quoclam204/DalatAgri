# BỘ PROMPT THIẾT KẾ UI — DỰ ÁN "FARM-FARMER"

> Dùng các prompt này để giao cho AI (Claude Code, v0, Cursor...) thiết kế/dựng giao diện. Nên dán **Prompt UI-0** trước tiên trong mỗi phiên làm việc mới về UI, để AI thiết lập bộ token thiết kế nhất quán trước khi vẽ từng màn hình — tránh tình trạng mỗi màn hình một phong cách rời rạc.

---

## PROMPT UI-0 — Thiết lập bản sắc thiết kế (Design Brief) — làm TRƯỚC TIÊN

```
Bạn là design lead cho ứng dụng "Farm-Farmer" — phần mềm quản lý canh tác cây
dài ngày (cà phê, sầu riêng, mắc ca) dành cho chủ vườn và nông dân Việt Nam,
dùng chủ yếu trên điện thoại, nhiều khi ngoài đồng ruộng, ánh sáng mạnh, mạng
yếu, người dùng có nhiều độ tuổi (kể cả lớn tuổi, không rành công nghệ).

Trước khi dựng bất kỳ màn hình nào, hãy lập một bản token hệ thống thiết kế
(design system) riêng cho sản phẩm này — KHÔNG dùng mặc định SaaS-card chung
chung (card bo góc giống nhau, shadow xám nhạt, nền be ấm + serif tương phản
cao kiểu mặc định AI hay tạo). Hãy lấy cảm hứng thật từ chất liệu nông nghiệp:
đất đỏ bazan Tây Nguyên, màu lá cà phê, vỏ sầu riêng, ánh nắng cao nguyên —
nhưng đừng sa vào sáo rỗng kiểu "xanh lá + icon lá cây" nếu không phục vụ đúng
nội dung.

Yêu cầu đầu ra (viết ra trước khi code):
1. Bảng màu: 4-6 mã hex có tên gọi cụ thể, có ít nhất 1 màu nền, 1 màu chữ
   chính, 1-2 màu nhấn dùng cho hành động quan trọng (nút Lưu, cảnh báo tồn
   kho thấp, số liệu lợi nhuận âm/dương).
2. Typography: chọn 1-2 font (có vai trò rõ ràng: hiển thị số liệu lớn dễ đọc
   ngoài nắng vs. văn bản mô tả), cỡ chữ tối thiểu đủ lớn cho người lớn tuổi
   dùng trên điện thoại.
3. Layout nguyên tắc: mobile-first, vùng chạm (tap target) tối thiểu 44px,
   ưu tiên 1 tay thao tác được (thumb zone) cho các hành động ghi nhật ký
   nhanh.
4. Nguyên tắc riêng: cách hiển thị số tiền (định dạng VNĐ), cách hiển thị
   trạng thái offline/đang đồng bộ, cách phân biệt trực quan giữa các loại
   cây (cà phê/sầu riêng/mắc ca) mà không chỉ dựa vào chữ.
5. Trạng thái rỗng & lỗi: viết giọng điệu (tone) cho các thông báo trống dữ
   liệu / lỗi nhập liệu — ngắn gọn, rõ ràng, không đổ lỗi người dùng.

Sau khi có bản token này, xác nhận lại với tôi trước khi bắt đầu dựng UI cho
từng màn hình cụ thể (tôi sẽ giao tiếp theo prompt UI-1 → UI-9).
```

---

## PROMPT UI-1 — Trang chủ / Landing page (toàn bộ website giới thiệu)

```
Dựng trang landing page giới thiệu sản phẩm "Farm-Farmer" cho website công
khai (không phải app quản lý bên trong), dùng bộ token đã thiết lập ở UI-0.

Đối tượng xem trang: chủ vườn cà phê/sầu riêng/mắc ca đang cân nhắc dùng thử,
có thể xem trên điện thoại lẫn desktop.

Cấu trúc nội dung (viết copy thật, không dùng lorem ipsum):
1. Hero: thông điệp chính giải quyết đúng nỗi đau — "sổ tay canh tác thất lạc,
   không biết vườn nào đang lời/lỗ" — không dùng công thức "số to + label nhỏ"
   trừ khi thực sự là lựa chọn tốt nhất cho nội dung này.
2. Vấn đề thực tế: 3-4 điểm đau cụ thể (ghi sổ tay dễ mất, không tính được lời
   lỗ theo từng vườn/loại cây, khó thuê kế toán riêng, hóa đơn cũ không tra
   được).
3. Giải pháp theo tính năng chính: Nhật ký canh tác, Quản lý vật tư & chi phí,
   Báo cáo lợi nhuận, Số hóa hóa đơn bằng camera — mỗi mục có hình minh hoạ màn
   hình thực tế (dùng khung điện thoại), không chỉ icon trừu tượng.
4. Minh chứng cụ thể: ví dụ số liệu mẫu thực tế kiểu "1 vườn 2ha cà phê xen
   sầu riêng, theo dõi lợi nhuận theo từng loại cây" thay vì testimonial chung
   chung.
5. CTA rõ ràng: "Dùng thử miễn phí" / "Xem demo" — nút nói đúng hành động sẽ
   xảy ra.
6. Footer: liên hệ hỗ trợ, chính sách dữ liệu (quan trọng vì có dữ liệu tài
   chính người dùng).

Yêu cầu kỹ thuật: responsive hoàn chỉnh mobile→desktop, một khoảnh khắc
chuyển động có chủ đích duy nhất (ví dụ hero load-in), còn lại giữ tĩnh và kỷ
luật. Đảm bảo tương phản đủ đọc ngoài trời nắng.
```

---

## PROMPT UI-2 — Dashboard tổng quan (trang chính sau đăng nhập)

```
Dựng màn hình Dashboard chính cho Farm Owner/Manager sau khi đăng nhập, dùng
token ở UI-0.

Nội dung cần thể hiện (dữ liệu mẫu thực tế, không placeholder chung chung):
- Tổng quan nhanh: tổng chi phí / tổng doanh thu / lợi nhuận kỳ hiện tại
  (tháng này hoặc vụ hiện tại), so sánh với kỳ trước (tăng/giảm bao nhiêu %).
- Danh sách các vườn (garden card) với: tên vườn, loại cây đang trồng (có thể
  nhiều loại/vườn), lợi nhuận tạm tính, cảnh báo (tồn kho vật tư thấp, chưa
  ghi nhật ký lâu ngày).
- Biểu đồ xu hướng chi phí/doanh thu theo thời gian, lọc theo vườn/loại cây.
- Nút hành động nổi bật nhất: "Ghi nhật ký hôm nay" — vì đây là hành động
  người dùng làm hàng ngày, nên đặt ở vị trí dễ chạm nhất trên mobile.
- Trạng thái đồng bộ dữ liệu (online/offline/đang đồng bộ) hiển thị rõ ràng
  nhưng không gây rối mắt.

Thiết kế phải phân biệt rõ ràng bằng thị giác các con số tốt (lợi nhuận dương)
và xấu (lỗ, cảnh báo) mà không chỉ dựa vào màu đỏ/xanh đơn thuần (cân nhắc
người dùng có thể mù màu). Responsive: trên mobile ưu tiên card vườn + nút
ghi nhật ký lên trên, biểu đồ chi tiết có thể cuộn xuống dưới.
```

---

## PROMPT UI-3 — Ghi nhật ký canh tác (luồng nhập liệu nhanh)

```
Dựng luồng "Ghi nhật ký canh tác" tối ưu tốc độ nhập trên mobile (mục tiêu
≤ 30 giây/lần ghi), dùng token ở UI-0.

Luồng đề xuất (tối đa 3 bước, có thể gộp bớt nếu hợp lý hơn):
Bước 1: Chọn vườn + lô cây (nếu chỉ có 1 vườn/1 lô thì tự động chọn sẵn, bỏ
qua bước này).
Bước 2: Chọn loại công việc (bón phân/phun thuốc/tưới/cắt tỉa/thu hoạch/khác)
bằng các nút lớn có icon minh hoạ rõ ràng — đây là bước dùng nhiều nhất nên
cần to, dễ chạm, không cần cuộn.
Bước 3: Nhập chi tiết theo loại công việc đã chọn (ví dụ bón phân → chọn vật
tư từ kho + số lượng; thu hoạch → nhập sản lượng), chụp/chọn ảnh đính kèm,
lưu.

Sau khi lưu: hiển thị xác nhận rõ ràng, quay lại được để sửa trong khoảng
thời gian ngắn nếu nhập nhầm. Nếu offline: hiển thị rõ "Đã lưu, sẽ đồng bộ khi
có mạng" — không được để người dùng nghi ngờ dữ liệu có bị mất hay không.

Thiết kế bàn phím số cho các trường số lượng/số tiền, không dùng bàn phím chữ
mặc định. Chữ và nút đủ lớn để dùng khi đứng ngoài vườn, có thể một tay cầm
điện thoại.
```

---

## PROMPT UI-4 — Quản lý vật tư & kho

```
Dựng màn hình Quản lý vật tư (danh mục + tồn kho), dùng token ở UI-0.

Nội dung:
- Danh sách vật tư theo nhóm (Phân bón / Thuốc BVTV / Giống / Dụng cụ), mỗi
  mục hiển thị tồn kho hiện tại, đơn vị tính, cảnh báo rõ ràng nếu dưới ngưỡng
  tối thiểu (không chỉ đổi màu chữ — dùng cả icon/nhãn "Sắp hết").
- Form nhập kho nhanh (nhập vật tư mới về) và form ghi nhận sử dụng (liên kết
  với màn hình ghi nhật ký ở UI-3, không trùng lặp thiết kế).
- Lịch sử xuất/nhập kho có thể tra cứu theo vật tư/theo thời gian.

Ưu tiên hiển thị rõ số tồn kho bằng số lớn, dễ đọc nhanh khi kiểm tra trước
khi ra vườn mua thêm vật tư. Trên mobile, danh sách vật tư nên hỗ trợ tìm
kiếm nhanh (gõ vài ký tự là lọc được ngay).
```

---

## PROMPT UI-5 — Chi phí, Đầu tư, Nhân công

```
Dựng màn hình quản lý Chi phí khác / Đầu tư / Nhân công, dùng token ở UI-0.

Nội dung:
- Form ghi nhân công: chọn loại (thuê ngoài / nhà làm không lương / nhà làm
  có tính chi phí cơ hội), số công, đơn giá — tự tính tổng, hiển thị ngay để
  người dùng kiểm tra trước khi lưu.
- Form ghi đầu tư: loại đầu tư, số tiền, nguồn vốn (vốn tự có/vay) — vì đây
  là quyết định lớn, nên có bước xác nhận trước khi lưu (không lưu tức thì
  như ghi nhật ký thường ngày).
- Bảng tổng hợp chi phí theo vườn × loại cây × kỳ — có thể xem dạng bảng
  hoặc biểu đồ, cho phép đổi kỳ (tháng/quý/năm/theo vụ) bằng bộ lọc rõ ràng.

Vì đây là màn hình liên quan tài chính nhạy cảm, thiết kế cần rõ ràng, ít rủi
ro nhập nhầm: số tiền nhập vào hiển thị lại dạng có dấu phân cách hàng nghìn
ngay khi gõ, tránh nhầm 1.000.000 với 100.000.
```

---

## PROMPT UI-6 — Doanh thu & Báo cáo lợi nhuận

```
Dựng màn hình Doanh thu và Báo cáo lợi nhuận, dùng token ở UI-0.

Nội dung:
- Form ghi doanh thu: sản lượng, đơn giá, khách mua, ngày bán — theo vườn/lô
  cây cụ thể.
- Báo cáo lợi nhuận: hiển thị theo tổ hợp vườn × loại cây × kỳ, có so sánh
  giữa các vụ/các vườn (bar chart), xu hướng theo thời gian (line chart).
  Phải làm rõ ràng công thức cho người dùng không rành tài chính — ví dụ một
  dòng chú thích ngắn "Lợi nhuận = Doanh thu − (Vật tư + Nhân công + Chi phí
  khác + Khấu hao đầu tư)" ngay cạnh số liệu, không giấu trong trang trợ giúp
  riêng.
- Nút xuất báo cáo PDF/Excel đặt ở vị trí dễ thấy, ghi rõ khoảng thời gian
  báo cáo sẽ xuất.
- Phân quyền hiển thị: nếu người dùng hiện tại không có quyền xem tài chính
  đầy đủ, thiết kế trạng thái "giới hạn xem" rõ ràng, không phải màn hình lỗi
  khó hiểu.

Ưu tiên desktop cho màn hình này (chủ vườn/kế toán thường xem báo cáo trên
máy tính) nhưng vẫn phải dùng được trên mobile khi cần xem nhanh.
```

---

## PROMPT UI-7 — Số hóa hóa đơn (chụp ảnh + OCR)

```
Dựng luồng "Số hóa hóa đơn" bằng camera điện thoại, dùng token ở UI-0.

Luồng:
1. Nút chụp ảnh/hoặc chọn ảnh có sẵn, hướng dẫn ngắn gọn cách chụp rõ (đủ
   sáng, không nghiêng) ngay trên màn hình chụp.
2. Màn hình xử lý: hiển thị trạng thái đang nhận diện (không để màn hình
   trắng im lặng).
3. Màn hình xác nhận kết quả OCR: hiển thị ảnh gốc song song với các trường
   được nhận diện (ngày, số tiền, tên vật tư/số lượng) ở dạng CÓ THỂ SỬA trực
   tiếp — làm rõ bằng thị giác đây là dữ liệu AI đọc, cần người dùng xác nhận,
   không phải dữ liệu đã chắc chắn đúng.
4. Sau khi xác nhận: liên kết vào đúng bản ghi chi phí/doanh thu tương ứng,
   lưu cả ảnh gốc để tra cứu sau.

Thiết kế trạng thái lỗi khi OCR không đọc được rõ: hướng dẫn cụ thể (chụp lại
gần hơn, đủ sáng hơn) thay vì thông báo lỗi chung chung.
```

---

## PROMPT UI-8 — Tài khoản & Trợ giúp/Chatbot

```
Dựng màn hình Tài khoản người dùng và Trung tâm trợ giúp, dùng token ở UI-0.

Tài khoản: thông tin cá nhân, đổi mật khẩu, danh sách vườn được gán + vai
trò, quản lý người dùng khác được mời vào vườn (nếu là Owner/Manager).

Trợ giúp: danh sách FAQ có tìm kiếm nhanh, mỗi mục trả lời kèm ảnh minh hoạ
thao tác thực tế trên chính giao diện app (không dùng ảnh chụp màn hình app
khác). Widget chatbot: đặt ở vị trí không che khuất nội dung chính, có trạng
thái "đang gõ", câu trả lời hiển thị rõ nguồn gốc (trích từ hướng dẫn) và có
nút "Liên hệ hỗ trợ trực tiếp" nổi bật khi chatbot không trả lời được.
```

---

## PROMPT UI-9 — Rà soát tổng thể trước khi hoàn tất (Design QA)

```
Rà soát toàn bộ các màn hình đã dựng (UI-1 đến UI-8) so với bộ token ở UI-0:

1. Kiểm tra tính nhất quán: màu sắc, khoảng cách, kiểu nút, cách hiển thị số
   tiền có đồng nhất giữa các màn hình không.
2. Kiểm tra khả năng tiếp cận (a11y): độ tương phản đủ, focus bàn phím nhìn
   thấy rõ, không chỉ dùng màu để truyền đạt thông tin quan trọng (cảnh báo,
   lời/lỗ).
3. Kiểm tra responsive thật sự trên các breakpoint chính (điện thoại phổ
   thông ~360-414px, tablet, desktop).
4. Tự phê bình: chỉ ra 1-2 điểm nếu thiết kế đang rơi vào công thức mặc định
   chung chung (card bo góc giống nhau, shadow xám nhạt lặp lại khắp nơi,
   nhãn viết hoa toàn bộ không cần thiết) và đề xuất cách sửa cụ thể cho
   sản phẩm nông nghiệp này.
5. Chụp/liệt kê danh sách các màn hình đã hoàn thành kèm trạng thái (Xong /
   Cần sửa) để bàn giao.
```

---

### Cách dùng

1. Luôn dán **UI-0** trước, xác nhận bộ token thiết kế trước khi giao màn hình cụ thể.
2. Giao từng màn hình theo UI-1 → UI-8 tùy thứ tự ưu tiên thực tế (khuyên nên làm UI-2 và UI-3 trước vì là màn hình dùng hàng ngày).
3. Dùng **UI-9** ở cuối mỗi đợt để rà soát tính nhất quán trước khi bàn giao.
