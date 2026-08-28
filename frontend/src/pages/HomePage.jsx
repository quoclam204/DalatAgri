import '../styles/HomePage.css'

const features = [
  {
    icon: '📋',
    title: 'Nhật ký canh tác',
    desc: 'Ghi chép chi tiết mọi hoạt động canh tác theo từng vụ mùa. Theo dõi tiến độ cây trồng từ khi gieo hạt đến thu hoạch.',
    color: '#1e804d',
    bg: 'rgba(30, 128, 77, 0.08)',
  },
  {
    icon: '🌿',
    title: 'Quản lý vật tư',
    desc: 'Kiểm soát tồn kho phân bón, thuốc bảo vệ thực vật và giống cây. Cảnh báo khi vật tư sắp cạn.',
    color: '#0ea5e9',
    bg: 'rgba(14, 165, 233, 0.08)',
  },
  {
    icon: '💰',
    title: 'Chi phí & Lợi nhuận',
    desc: 'Tính toán chi phí đầu tư và lợi nhuận theo từng vụ. Biết ngay hiệu quả kinh tế của từng loại cây trồng.',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.08)',
  },
  {
    icon: '📊',
    title: 'Báo cáo & Thống kê',
    desc: 'Biểu đồ trực quan theo tháng, quý, năm. Phân tích xu hướng để đưa ra quyết định canh tác tốt hơn.',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.08)',
  },
  {
    icon: '📡',
    title: 'Offline-First',
    desc: 'Hoạt động ngay cả khi mất kết nối internet. Dữ liệu tự động đồng bộ khi có mạng trở lại.',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.08)',
  },
  {
    icon: '🔒',
    title: 'Bảo mật dữ liệu',
    desc: 'Dữ liệu được mã hóa và bảo vệ an toàn. Chỉ bạn mới có quyền truy cập thông tin nông trại của mình.',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.08)',
  },
]

const steps = [
  {
    step: '01',
    title: 'Tạo tài khoản',
    desc: 'Đăng ký miễn phí trong vòng 1 phút. Không cần kỹ năng công nghệ.',
  },
  {
    step: '02',
    title: 'Thêm nông trại',
    desc: 'Nhập thông tin vườn, loại cây trồng và diện tích canh tác của bạn.',
  },
  {
    step: '03',
    title: 'Ghi nhật ký',
    desc: 'Ghi chép hàng ngày về hoạt động, vật tư sử dụng và chi phí phát sinh.',
  },
  {
    step: '04',
    title: 'Xem báo cáo',
    desc: 'Phân tích dữ liệu, theo dõi lợi nhuận và tối ưu hóa quy trình canh tác.',
  },
]

const stats = [
  { value: '500+', label: 'Nông hộ sử dụng' },
  { value: '10,000+', label: 'Nhật ký được ghi' },
  { value: '98%', label: 'Hài lòng với dịch vụ' },
  { value: '24/7', label: 'Hỗ trợ người dùng' },
]

function HomePage() {
  return (
    <div className="home-page">
      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>

        <div className="container hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Nền tảng nông nghiệp số cho Đà Lạt
          </div>

          <h1 className="hero-title">
            Quản lý nông trại
            <br />
            <span className="hero-title-highlight">thông minh & hiệu quả</span>
          </h1>

          <p className="hero-desc">
            DalatAgri giúp nông hộ số hóa toàn bộ nhật ký canh tác, vật tư và
            chi phí. Từ vườn rau đến vườn cây ăn trái — tất cả trong một ứng
            dụng duy nhất.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" id="hero-cta-start">
              Bắt đầu miễn phí
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className="btn-secondary" id="hero-cta-demo">
              Xem demo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
              </svg>
            </button>
          </div>

          <div className="hero-trust">
            <div className="trust-avatars">
              {['👨‍🌾', '👩‍🌾', '🧑‍🌾', '👨‍🌾'].map((e, i) => (
                <span key={i} className="trust-avatar">{e}</span>
              ))}
            </div>
            <p className="trust-text">
              <strong>500+ nông hộ</strong> tại Đà Lạt đang dùng DalatAgri
            </p>
          </div>
        </div>

        <div className="container hero-dashboard-preview">
          <div className="dashboard-mockup">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span /><span /><span />
              </div>
              <span className="mockup-title">DalatAgri Dashboard</span>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                {['🏠 Tổng quan', '🌿 Nông trại', '📋 Nhật ký', '💊 Vật tư', '💰 Chi phí', '📊 Báo cáo'].map((item, i) => (
                  <div key={i} className={`sidebar-item ${i === 0 ? 'active' : ''}`}>{item}</div>
                ))}
              </div>
              <div className="mockup-main">
                <div className="mockup-stats">
                  {[
                    { label: 'Vườn đang canh tác', val: '3', icon: '🌱', color: '#1e804d' },
                    { label: 'Nhật ký tháng này', val: '24', icon: '📝', color: '#0ea5e9' },
                    { label: 'Chi phí tháng', val: '4.2M', icon: '💸', color: '#f59e0b' },
                  ].map((s, i) => (
                    <div key={i} className="stat-card" style={{ '--card-color': s.color }}>
                      <span className="stat-icon">{s.icon}</span>
                      <div>
                        <div className="stat-val">{s.val}</div>
                        <div className="stat-lbl">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mockup-chart">
                  <div className="chart-title">📈 Chi phí theo tháng</div>
                  <div className="chart-bars">
                    {[55, 70, 45, 80, 65, 90, 75].map((h, i) => (
                      <div key={i} className="chart-bar-wrap">
                        <div className="chart-bar" style={{ height: `${h}%` }} />
                        <span className="chart-label">{['T2','T3','T4','T5','T6','T7','T8'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section">
        <div className="container stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stats-item" id={`stat-${i}`}>
              <div className="stats-value">{s.value}</div>
              <div className="stats-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Tính năng</span>
            <h2 className="section-title">Mọi thứ bạn cần để<br />quản lý nông trại hiệu quả</h2>
            <p className="section-desc">
              Từ ghi chép nhật ký đến phân tích báo cáo — DalatAgri cung cấp
              đầy đủ công cụ để giúp bạn canh tác thông minh hơn.
            </p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card" id={`feature-${i}`}
                style={{ '--feature-color': f.color, '--feature-bg': f.bg }}>
                <div className="feature-icon-wrap">
                  <span className="feature-icon">{f.icon}</span>
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
                <div className="feature-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Hướng dẫn</span>
            <h2 className="section-title">Bắt đầu chỉ trong<br />4 bước đơn giản</h2>
            <p className="section-desc">
              Không cần kiến thức công nghệ. Giao diện đơn giản, dễ dùng cho
              mọi nông dân.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={i} className="step-card" id={`step-${i}`}>
                <div className="step-number">{s.step}</div>
                {i < steps.length - 1 && <div className="step-connector" />}
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="testimonial-section">
        <div className="container">
          <div className="testimonial-card">
            <div className="testimonial-quote">"</div>
            <p className="testimonial-text">
              Trước đây tôi phải ghi chép bằng sổ tay, rất dễ mất và khó tra
              cứu. Từ khi dùng DalatAgri, tôi theo dõi được toàn bộ chi phí
              và lợi nhuận của vườn cà phê một cách rõ ràng. Năm ngoái tôi đã
              tiết kiệm được gần 20% chi phí vật tư!
            </p>
            <div className="testimonial-author">
              <span className="author-avatar">👨‍🌾</span>
              <div>
                <div className="author-name">Nguyễn Văn Minh</div>
                <div className="author-role">Nông dân tại Lâm Đồng • Vườn cà phê 5ha</div>
              </div>
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-bg-shapes">
          <div className="cta-shape-1" />
          <div className="cta-shape-2" />
        </div>
        <div className="container cta-content">
          <h2 className="cta-title">Sẵn sàng số hóa<br />nông trại của bạn?</h2>
          <p className="cta-desc">
            Tham gia cùng hàng trăm nông hộ Đà Lạt đang quản lý nông trại
            thông minh hơn với DalatAgri.
          </p>
          <div className="cta-actions">
            <button className="btn-white" id="cta-register">
              Đăng ký miễn phí ngay
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className="btn-outline-white" id="cta-login">
              Đã có tài khoản? Đăng nhập
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
