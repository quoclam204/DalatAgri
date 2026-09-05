import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const features = [
  ['01', 'Nhật ký ngoài vùng phủ sóng', 'Ghi việc ngay tại luống, tự đồng bộ khi có mạng. Không còn giấy rời hay ký ức đứt đoạn.', 'journal'],
  ['02', 'Chi phí theo từng lô', 'Biết tiền đang đi đâu: vật tư, nhân công, đầu tư và chi phí phát sinh.', 'finance'],
  ['03', 'Lãi thật của từng vụ', 'Kết nối chi phí với sản lượng và giá bán để quyết định mùa sau bằng dữ liệu.', 'revenue'],
];

function HomePage() {
  return <main className="landing">
    <section className="landing-hero container">
      <div className="landing-copy">
        <p className="eyebrow">FARM-FARMER / NHẬT KÝ SỐ CHO NÔNG HỘ</p>
        <h1>Để mỗi mùa vụ kể được câu chuyện của mình.</h1>
        <p className="lede">Farm-Farmer giúp bạn ghi đúng việc, hiểu đúng chi phí và nhìn thấy lợi nhuận thật — ngay cả khi điện thoại đang ở ngoài vùng phủ sóng.</p>
        <div className="actions"><Link className="button" to="/register">Bắt đầu với nông trại</Link><a className="button secondary" href="#features">Xem cách hoạt động</a></div>
        <p className="landing-note">Dành cho vườn cà phê, rau màu, cây ăn trái và những người đang làm nông bằng cả kinh nghiệm lẫn dữ liệu.</p>
      </div>
      <div className="landing-art" aria-label="Bảng điều khiển Farm-Farmer minh họa">
        <div className="art-top"><span>FARM-FARmer / TỔNG QUAN</span><span className="badge">Đã đồng bộ</span></div>
        <div className="art-number"><small>Lợi nhuận vụ này</small><strong>128.450.000 đ</strong><span>+18,4% so với vụ trước</span></div>
        <div className="art-lines"><i style={{height:'42%'}}/><i style={{height:'65%'}}/><i style={{height:'52%'}}/><i style={{height:'82%'}}/><i style={{height:'72%'}}/><i style={{height:'96%'}}/></div>
        <div className="art-bottom"><span>Chi phí</span><b>76.220.000 đ</b><span>Doanh thu</span><b>204.670.000 đ</b></div>
      </div>
    </section>
    <section className="landing-proof"><div className="container proof-row"><span>2 ha cà phê xen sầu riêng</span><span>24 nhật ký trong tháng này</span><span>1 nơi để biết nông trại đang khỏe hay mệt</span></div></section>
    <section className="container landing-section" id="features"><p className="eyebrow">TỪ VIỆC NHỎ ĐẾN QUYẾT ĐỊNH LỚN</p><h2>Không biến người làm nông thành kế toán.<br/>Chỉ làm dữ liệu dễ dùng hơn.</h2><div className="feature-list">{features.map(([num,title,desc,link]) => <article key={num}><span className="feature-number">{num}</span><h3>{title}</h3><p>{desc}</p><Link to={link === 'journal' ? '/journal' : `/${link}`}>Khám phá →</Link></article>)}</div></section>
    <section className="container case-study"><div><p className="eyebrow">MỘT CÂU CHUYỆN THẬT</p><h2>“Trước đây tôi chỉ biết lời hay lỗ sau khi bán xong.”</h2><p className="lede">Với Farm-Farmer, anh Minh theo dõi được từng lần bón phân cho 2 ha cà phê xen sầu riêng, đối chiếu với sản lượng và điều chỉnh vụ sau.</p><Link className="button secondary" to="/register">Tạo nhật ký đầu tiên</Link></div><div className="case-stat"><strong>18,4%</strong><span>tăng lợi nhuận sau 2 vụ</span><hr/><strong>42 giờ</strong><span>tiết kiệm mỗi mùa vụ</span></div></section>
  </main>;
}
export default HomePage;
