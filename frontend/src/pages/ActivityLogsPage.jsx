import React, { useState, useMemo } from 'react';
import { 
  Leaf, Droplets, Scissors, ShoppingBag, 
  Search, Calendar, Camera, Mic, 
  CheckCircle2, Clock, Trash2, 
  ChevronDown, RefreshCw, X, Sparkles,
  ArrowRight, ShieldCheck, UserCheck, AlertCircle
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ActivityLogs.css';

// Master data
const PLOTS = [
  { id: '1', name: 'Lô 01 - Cà phê Catimor (Đồi Gió)', cropType: 'coffee', cropName: 'Cà phê', area: '1.4 ha' },
  { id: '2', name: 'Lô 02 - Sầu riêng Ri6 (Vườn Mới)', cropType: 'durian', cropName: 'Sầu riêng', area: '0.8 ha' },
  { id: '3', name: 'Lô 03 - Mắc ca xen Cà phê', cropType: 'macadamia', cropName: 'Mắc ca', area: '1.2 ha' }
];

const SUPPLIES = [
  { id: 's1', name: 'NPK 16-16-8 Đầu Trâu', unit: 'kg', price: 18500 },
  { id: 's2', name: 'Phân hữu cơ vi sinh Quế Lâm', unit: 'bao (25kg)', price: 165000 },
  { id: 's3', name: 'Thuốc trừ bệnh sinh học Anvil 5SC', unit: 'chai (1L)', price: 210000 },
  { id: 's4', name: 'Vôi bột nông nghiệp khử chua đất', unit: 'bao (50kg)', price: 65000 },
  { id: 's5', name: 'Chế phẩm Trichoderma đối kháng nấm', unit: 'gói (1kg)', price: 85000 }
];

const ACTIVITIES = [
  { id: 'Bón phân', label: 'Bón phân', icon: ShoppingBag, color: '#cf9b43' },
  { id: 'Phun thuốc', label: 'Phun thuốc', icon: Droplets, color: '#2f6949' },
  { id: 'Tưới nước', label: 'Tưới nước', icon: Droplets, color: '#3d82a3' },
  { id: 'Tỉa cành', label: 'Tỉa cành', icon: Scissors, color: '#b35e3f' },
  { id: 'Thu hoạch', label: 'Thu hoạch', icon: Leaf, color: '#163d2a' }
];

const INITIAL_LOGS = [
  {
    id: 'log-1',
    date: '05/09/2026',
    plotId: '2',
    activity: 'Bón phân',
    performedBy: 'Nguyễn Văn Minh (Chủ vườn)',
    supply: { name: 'Phân hữu cơ vi sinh Quế Lâm', qty: 5, unit: 'bao (25kg)', unitPrice: 165000 },
    supplyCost: 825000,
    hasLabor: true,
    laborWorkers: 2,
    laborCost: 450000,
    totalCost: 1275000,
    note: 'Bón lót quanh tán rãnh sâu 15cm, cách gốc 1m. Mưa phùn chiều muộn giúp phân ngấm đều, rễ tơ hút dinh dưỡng tốt.',
    syncStatus: 'synced'
  },
  {
    id: 'log-2',
    date: '04/09/2026',
    plotId: '1',
    activity: 'Tỉa cành',
    performedBy: 'Tổ thợ chuyên tỉa Đắk Lắk',
    supply: null,
    supplyCost: 0,
    hasLabor: true,
    laborWorkers: 1,
    laborCost: 350000,
    totalCost: 350000,
    note: 'Tỉa sạch cành tăm, chồi vượt và cành khô sau đợt gió lớn. Tán cây thông thoáng đón ánh sáng để dưỡng mắt cua.',
    syncStatus: 'synced'
  },
  {
    id: 'log-3',
    date: '01/09/2026',
    plotId: '1',
    activity: 'Phun thuốc',
    performedBy: 'Nguyễn Văn Minh',
    supply: { name: 'Thuốc trừ bệnh sinh học Anvil 5SC', qty: 2, unit: 'chai (1L)', unitPrice: 210000 },
    supplyCost: 420000,
    hasLabor: false,
    laborWorkers: 0,
    laborCost: 0,
    totalCost: 420000,
    note: 'Phun phòng trừ rỉ sắt và nấm hồng đầu mùa mưa cao điểm. Áp dụng đúng liều lượng khuyến cáo, cách ly 14 ngày.',
    syncStatus: 'pending'
  }
];

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form states
  const [plotId, setPlotId] = useState('2');
  const [activity, setActivity] = useState('Bón phân');
  const [date, setDate] = useState('2026-09-05');
  const [performedBy, setPerformedBy] = useState('Nguyễn Văn Minh (Chủ vườn)');
  
  // Supplies state
  const [isSupplyOpen, setIsSupplyOpen] = useState(true);
  const [supplyId, setSupplyId] = useState('s1');
  const [supplyQty, setSupplyQty] = useState('50');

  // Labor state
  const [hasLabor, setHasLabor] = useState(true);
  const [laborWorkers, setLaborWorkers] = useState('2');
  const [laborCost, setLaborCost] = useState('400000');

  // Notes
  const [note, setNote] = useState('');

  // Filter and search
  const [searchQuery, setSearchQuery] = useState('');
  const [cropFilter, setCropFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');

  // Modals for OCR & Voice
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Currency Formatter
  const formatVND = (val) => new Intl.NumberFormat('vi-VN').format(val) + ' đ';

  // Calculate live costs
  const selectedSupply = SUPPLIES.find(s => s.id === supplyId);
  const calculatedSupplyCost = (selectedSupply && Number(supplyQty) > 0)
    ? selectedSupply.price * Number(supplyQty)
    : 0;
  const currentLaborCost = hasLabor ? Number(laborCost || 0) : 0;
  const estimatedTotalCost = calculatedSupplyCost + currentLaborCost;

  // KPI Calculations
  const totalCostAll = useMemo(() => logs.reduce((sum, l) => sum + (l.totalCost || 0), 0), [logs]);
  const totalLaborAll = useMemo(() => logs.reduce((sum, l) => sum + (l.laborCost || 0), 0), [logs]);
  const totalSupplyAll = useMemo(() => logs.reduce((sum, l) => sum + (l.supplyCost || 0), 0), [logs]);
  const pendingCount = logs.filter(l => l.syncStatus === 'pending').length;

  const materialPct = totalCostAll > 0 ? Math.round((totalSupplyAll / totalCostAll) * 100) : 0;
  const laborPct = totalCostAll > 0 ? 100 - materialPct : 0;

  // Toast trigger
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!plotId) {
      alert('Vui lòng chọn lô canh tác');
      return;
    }

    const formattedDate = new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const newEntry = {
      id: `log-${Date.now()}`,
      date: formattedDate,
      plotId,
      activity,
      performedBy: performedBy || 'Chủ vườn',
      supply: selectedSupply && Number(supplyQty) > 0 ? {
        name: selectedSupply.name,
        qty: Number(supplyQty),
        unit: selectedSupply.unit,
        unitPrice: selectedSupply.price
      } : null,
      supplyCost: calculatedSupplyCost,
      hasLabor,
      laborWorkers: hasLabor ? Number(laborWorkers || 0) : 0,
      laborCost: currentLaborCost,
      totalCost: estimatedTotalCost,
      note: note.trim() || 'Hoạt động đã hoàn tất theo quy trình kỹ thuật.',
      syncStatus: 'synced'
    };

    setLogs([newEntry, ...logs]);
    setNote('');
    showToast(`✓ Đã lưu nhật ký "${activity}" cho ${PLOTS.find(p => p.id === plotId)?.name.split(' (')[0]}!`);
  };

  // Delete Handler
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bản ghi nhật ký canh tác này?')) {
      setLogs(logs.filter(l => l.id !== id));
      showToast('Đã xóa bản ghi nhật ký.');
    }
  };

  // Offline Sync trigger
  const handleSyncAll = () => {
    if (pendingCount === 0) return;
    setIsSyncing(true);
    setTimeout(() => {
      setLogs(logs.map(l => ({ ...l, syncStatus: 'synced' })));
      setIsSyncing(false);
      showToast('✓ Đã đồng bộ toàn bộ dữ liệu lên máy chủ đám mây!');
    }, 900);
  };

  // OCR Apply handler
  const handleApplyOcr = () => {
    setPlotId('2');
    setActivity('Bón phân');
    setSupplyId('s1'); // NPK
    setSupplyQty('100');
    setHasLabor(true);
    setLaborWorkers('3');
    setLaborCost('600000');
    setNote('Hóa đơn vật tư Nông Lâm số #NL-8422. Đã kiểm tra bao bì đạt chuẩn quy cách.');
    setShowOcrModal(false);
    showToast('✓ Đã tự động điền dữ liệu từ hóa đơn vật tư!');
  };

  // Voice Apply handler
  const handleApplyVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setPlotId('1');
      setActivity('Phun thuốc');
      setSupplyId('s3');
      setSupplyQty('3');
      setNote('Ghi âm AI: Đã phun phòng nấm hồng và rỉ sắt cho toàn bộ diện tích cà phê Catimor đợt 2.');
      setShowVoiceModal(false);
      showToast('✓ Nhận diện giọng nói thành công! Đã cập nhật biểu mẫu.');
    }, 1200);
  };

  // Filtered Logs
  const filteredLogs = logs.filter(log => {
    const plot = PLOTS.find(p => p.id === log.plotId);
    
    // Crop filter
    if (cropFilter !== 'all' && plot?.cropType !== cropFilter) {
      return false;
    }
    // Activity filter
    if (activityFilter !== 'all' && log.activity !== activityFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPlot = plot?.name.toLowerCase().includes(q);
      const matchAct = log.activity.toLowerCase().includes(q);
      const matchSupply = log.supply?.name.toLowerCase().includes(q);
      const matchNote = log.note.toLowerCase().includes(q);
      if (!matchPlot && !matchAct && !matchSupply && !matchNote) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="farm-journal-page">
      <Header />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#163d2a',
          color: '#f7f3e8',
          padding: '14px 22px',
          borderRadius: '4px',
          boxShadow: '6px 8px 0 rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 700,
          fontSize: '14px',
          animation: 'modalIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={18} color="#4ade80" />
          {toastMessage}
        </div>
      )}

      {/* 1. HERO BANNER - HIGHLAND BAZAN STYLE */}
      <section className="journal-hero">
        <div className="journal-hero-grain" />
        <div className="container journal-hero-inner">
          <div>
            <p className="journal-eyebrow">
              <span className="dot" /> 01 / SỔ CANH TÁC & QUẢN LÝ VỤ MÙA
            </p>
            <h1 className="journal-hero-title">
              Nhật ký canh tác & <em>Chi phí chi tiết.</em>
            </h1>
            <p className="journal-hero-lead">
              Ghi lại từng đợt phân bón, thuốc bảo vệ thực vật, công thợ theo từng lô cây.
              Tự động tính chi phí, hoạt động trơn tru ngay cả khi mất sóng ngoài vườn.
            </p>
          </div>

          {/* Sync Box */}
          <div className="journal-sync-box">
            <div className={`sync-status-indicator ${pendingCount === 0 ? 'synced' : 'pending'}`}>
              <span className={`sync-dot ${pendingCount === 0 ? 'green' : 'amber'}`} />
              {pendingCount === 0 ? (
                <span>Dữ liệu đã đồng bộ</span>
              ) : (
                <span>{pendingCount} bản ghi chờ gửi</span>
              )}
            </div>

            {pendingCount > 0 && (
              <button 
                className="btn-sync-trigger" 
                onClick={handleSyncAll}
                disabled={isSyncing}
              >
                <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                {isSyncing ? 'Đang gửi...' : 'Đồng bộ ngay'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. KPI METRICS CARDS */}
      <section className="journal-kpi-bar">
        <div className="container">
          <div className="kpi-cards-grid">
            
            {/* Card 1: Tổng chi phí */}
            <div className="kpi-card highlight">
              <div className="kpi-header">
                <span className="kpi-label">Tổng chi phí vụ mùa</span>
                <span className="kpi-icon-pill gold">₫</span>
              </div>
              <div className="kpi-number">{formatVND(totalCostAll)}</div>
              <div className="kpi-footer">
                <span>Vật tư {materialPct}%</span>
                <span>·</span>
                <span>Nhân công {laborPct}%</span>
              </div>
              <div className="kpi-meter">
                <div className="kpi-meter-segment material" style={{ width: `${materialPct}%` }} title={`Vật tư: ${formatVND(totalSupplyAll)}`} />
                <div className="kpi-meter-segment labor" style={{ width: `${laborPct}%` }} title={`Nhân công: ${formatVND(totalLaborAll)}`} />
              </div>
            </div>

            {/* Card 2: Tiền công thợ */}
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">Công thợ đã thuê</span>
                <span className="kpi-icon-pill clay"><Scissors size={15} /></span>
              </div>
              <div className="kpi-number clay">{formatVND(totalLaborAll)}</div>
              <div className="kpi-footer">
                <span>{logs.filter(l => l.hasLabor).length} đợt thuê thợ</span>
                <span>·</span>
                <span>Tỉa cành, bón phân</span>
              </div>
            </div>

            {/* Card 3: Lượt canh tác */}
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">Lượt chăm sóc đã ghi</span>
                <span className="kpi-icon-pill leaf"><Leaf size={15} /></span>
              </div>
              <div className="kpi-number">{logs.length} đợt</div>
              <div className="kpi-footer">
                <span>3 lô canh tác đang theo dõi</span>
                <span>·</span>
                <span>Đúng tiến độ kỹ thuật</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE */}
      <main className="journal-workspace">
        <div className="container">
          <div className="workspace-columns">
            
            {/* LEFT COLUMN: GHI NHẬT KÝ MỚI */}
            <aside>
              <div className="journal-form-card">
                
                <div className="form-card-header">
                  <p className="form-eyebrow">01 / BIỂU MẪU CANH TÁC</p>
                  <h2>Ghi hoạt động mới</h2>
                  <p>Lưu nhanh việc ngoài vườn — tự động tính chi phí</p>
                </div>

                {/* Smart Helpers */}
                <div className="smart-helpers-bar">
                  <button 
                    type="button" 
                    className="btn-smart-action"
                    onClick={() => setShowOcrModal(true)}
                  >
                    <Camera size={15} color="#2f6949" />
                    <span>Quét hóa đơn</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn-smart-action"
                    onClick={() => setShowVoiceModal(true)}
                  >
                    <Mic size={15} color="#b35e3f" />
                    <span>Ghi âm AI</span>
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  
                  {/* Field: Vườn / Lô */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Vườn / Lô canh tác <span className="req">*</span>
                    </label>
                    <select 
                      className="form-select"
                      value={plotId} 
                      onChange={(e) => setPlotId(e.target.value)}
                      required
                    >
                      {PLOTS.map(plot => (
                        <option key={plot.id} value={plot.id}>
                          {plot.name} ({plot.area})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Field: Loại hoạt động (Segmented grid) */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Loại hoạt động <span className="req">*</span>
                    </label>
                    <div className="activity-picker-grid">
                      {ACTIVITIES.map(act => {
                        const isSelected = activity === act.id;
                        const Icon = act.icon;
                        return (
                          <button
                            key={act.id}
                            type="button"
                            className={`btn-activity-option ${isSelected ? 'selected' : ''}`}
                            onClick={() => setActivity(act.id)}
                          >
                            <span className="icon"><Icon size={16} /></span>
                            <span>{act.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date & Performed By */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-field-group">
                      <label className="form-label">Ngày thực hiện</label>
                      <input 
                        type="date" 
                        className="form-input"
                        value={date} 
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Người thực hiện</label>
                      <input 
                        type="text" 
                        className="form-input"
                        value={performedBy} 
                        onChange={(e) => setPerformedBy(e.target.value)}
                        placeholder="Chủ vườn / Công nhân"
                      />
                    </div>
                  </div>

                  {/* Accordion: Vật tư sử dụng */}
                  <div className="form-accordion">
                    <button 
                      type="button" 
                      className="accordion-header"
                      onClick={() => setIsSupplyOpen(!isSupplyOpen)}
                    >
                      <span>Vật tư nông nghiệp (Phân, thuốc, vôi...)</span>
                      <ChevronDown size={16} style={{ transform: isSupplyOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                    
                    {isSupplyOpen && (
                      <div className="accordion-body">
                        <div className="form-field-group">
                          <label className="form-label" style={{ fontSize: '12px' }}>Tên vật tư</label>
                          <select 
                            className="form-select"
                            value={supplyId}
                            onChange={(e) => setSupplyId(e.target.value)}
                          >
                            <option value="">-- Không dùng vật tư --</option>
                            {SUPPLIES.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({formatVND(s.price)}/{s.unit})
                              </option>
                            ))}
                          </select>
                        </div>

                        {supplyId && (
                          <div className="form-field-group">
                            <label className="form-label" style={{ fontSize: '12px' }}>
                              Số lượng ({selectedSupply?.unit})
                            </label>
                            <input 
                              type="number"
                              min="0"
                              step="0.5"
                              className="form-input"
                              value={supplyQty}
                              onChange={(e) => setSupplyQty(e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        )}

                        {calculatedSupplyCost > 0 && (
                          <div className="calculated-cost-box">
                            <span>Tạm tính tiền vật tư:</span>
                            <strong>{formatVND(calculatedSupplyCost)}</strong>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Section: Nhân công lao động */}
                  <div className="form-accordion" style={{ padding: '12px 14px' }}>
                    <label className="labor-toggle-label">
                      <input 
                        type="checkbox" 
                        checked={hasLabor}
                        onChange={(e) => setHasLabor(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: '#2f6949' }}
                      />
                      <span>Có thuê thợ / nhân công ngoài?</span>
                    </label>

                    {hasLabor && (
                      <div className="labor-fields-grid">
                        <div>
                          <label className="form-label" style={{ fontSize: '11px', color: '#68776e' }}>Số công</label>
                          <input 
                            type="number" 
                            className="form-input"
                            value={laborWorkers}
                            onChange={(e) => setLaborWorkers(e.target.value)}
                            placeholder="VD: 2"
                          />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: '11px', color: '#68776e' }}>Tổng tiền công (đ)</label>
                          <input 
                            type="number" 
                            className="form-input"
                            value={laborCost}
                            onChange={(e) => setLaborCost(e.target.value)}
                            placeholder="400000"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section: Ghi chú hiện trường */}
                  <div className="form-field-group">
                    <label className="form-label">Ghi chú & Tình trạng thời tiết</label>
                    <textarea 
                      className="form-textarea"
                      rows="3"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Tình trạng đất, thời tiết khi bón, chồi non, dịch bệnh cần theo dõi..."
                    />
                    <div className="quick-tags">
                      <button 
                        type="button" 
                        className="quick-tag-chip"
                        onClick={() => setNote((prev) => prev ? `${prev} Trời mưa nhẹ sau khi làm.` : 'Trời mưa nhẹ sau khi làm.')}
                      >
                        + Mưa nhẹ
                      </button>
                      <button 
                        type="button" 
                        className="quick-tag-chip"
                        onClick={() => setNote((prev) => prev ? `${prev} Cây phát triển ngọn khỏe.` : 'Cây phát triển ngọn khỏe.')}
                      >
                        + Ngọn ra khỏe
                      </button>
                      <button 
                        type="button" 
                        className="quick-tag-chip"
                        onClick={() => setNote((prev) => prev ? `${prev} Không phát hiện nấm bệnh.` : 'Không phát hiện nấm bệnh.')}
                      >
                        + Không có rầy rệp
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn-submit-journal">
                    <span>Lưu vào sổ nhật ký vườn</span>
                    <ArrowRight size={18} />
                  </button>

                  <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '12px', color: '#7a897b' }}>
                    Tạm tính đợt này: <b>{formatVND(estimatedTotalCost)}</b>
                  </div>

                </form>
              </div>
            </aside>

            {/* RIGHT COLUMN: TIMELINE & ACTIVITY STREAM */}
            <div className="journal-feed-area">
              
              {/* Filter and Search Bar */}
              <div className="feed-filter-bar">
                <div className="filter-row-top">
                  <div className="search-input-wrap">
                    <Search size={15} className="search-icon-pos" />
                    <input 
                      type="text" 
                      placeholder="Tìm theo lô đất, hoạt động, vật tư..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Activity Filter Dropdown */}
                  <div style={{ minWidth: '160px' }}>
                    <select 
                      className="form-select"
                      style={{ padding: '9px 12px', fontSize: '13px' }}
                      value={activityFilter}
                      onChange={(e) => setActivityFilter(e.target.value)}
                    >
                      <option value="all">Tất cả công việc</option>
                      {ACTIVITIES.map(a => (
                        <option key={a.id} value={a.id}>{a.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Crop Filter Chips */}
                <div className="crop-filter-chips">
                  <button 
                    type="button" 
                    className={`crop-chip ${cropFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setCropFilter('all')}
                  >
                    Tất cả cây trồng ({logs.length})
                  </button>
                  <button 
                    type="button" 
                    className={`crop-chip ${cropFilter === 'coffee' ? 'active' : ''}`}
                    onClick={() => setCropFilter('coffee')}
                  >
                    <span className="crop-dot coffee" /> Cà phê
                  </button>
                  <button 
                    type="button" 
                    className={`crop-chip ${cropFilter === 'durian' ? 'active' : ''}`}
                    onClick={() => setCropFilter('durian')}
                  >
                    <span className="crop-dot durian" /> Sầu riêng
                  </button>
                  <button 
                    type="button" 
                    className={`crop-chip ${cropFilter === 'macadamia' ? 'active' : ''}`}
                    onClick={() => setCropFilter('macadamia')}
                  >
                    <span className="crop-dot macadamia" /> Mắc ca
                  </button>
                </div>
              </div>

              {/* Timeline Feed */}
              <div className="timeline-stream">
                <div className="timeline-tree-line" />

                {filteredLogs.length === 0 ? (
                  <div className="empty-feed-card">
                    <Leaf size={42} color="#a6b6a8" style={{ margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px' }}>
                      Chưa có ghi chép nào phù hợp
                    </h3>
                    <p>
                      Hãy chọn bộ lọc khác hoặc dùng biểu mẫu bên trái để ghi lại hoạt động chăm sóc vườn đầu tiên.
                    </p>
                  </div>
                ) : (
                  filteredLogs.map(log => {
                    const plot = PLOTS.find(p => p.id === log.plotId);
                    const isCoffee = plot?.cropType === 'coffee';
                    const isDurian = plot?.cropType === 'durian';
                    const isMacadamia = plot?.cropType === 'macadamia';

                    return (
                      <div key={log.id} className="timeline-entry">
                        {/* Node pin */}
                        <div className={`timeline-node-pin ${isDurian ? 'durian' : isMacadamia ? 'macadamia' : ''}`} />

                        {/* Card Content */}
                        <div className="journal-entry-card">
                          
                          {/* Top Bar */}
                          <div className="entry-top-bar">
                            <div className="entry-activity-meta">
                              <h3 className="entry-activity-title">{log.activity}</h3>
                              <span className={`plot-crop-badge ${plot?.cropType}`}>
                                {plot?.name}
                              </span>
                            </div>

                            {/* Sync tag */}
                            <span className={`entry-sync-tag ${log.syncStatus}`}>
                              {log.syncStatus === 'synced' ? (
                                <>
                                  <CheckCircle2 size={12} />
                                  Đã lưu mây
                                </>
                              ) : (
                                <>
                                  <Clock size={12} />
                                  Chờ đồng bộ
                                </>
                              )}
                            </span>
                          </div>

                          {/* Date and Author */}
                          <div className="entry-date-author">
                            <span><Calendar size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> {log.date}</span>
                            <span>·</span>
                            <span><UserCheck size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> {log.performedBy}</span>
                          </div>

                          {/* Details Breakdown */}
                          {(log.supply || log.hasLabor) && (
                            <div className="entry-breakdown-box">
                              {log.supply && (
                                <div className="breakdown-row">
                                  <span className="label">
                                    <ShoppingBag size={14} color="#cf9b43" />
                                    Vật tư: {log.supply.name} ({log.supply.qty} {log.supply.unit})
                                  </span>
                                  <span className="val">{formatVND(log.supplyCost)}</span>
                                </div>
                              )}

                              {log.hasLabor && (
                                <div className="breakdown-row">
                                  <span className="label">
                                    <Scissors size={14} color="#b35e3f" />
                                    Nhân công: {log.laborWorkers} thợ
                                  </span>
                                  <span className="val">{formatVND(log.laborCost)}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Field Note */}
                          {log.note && (
                            <div className="entry-field-note">
                              "{log.note}"
                            </div>
                          )}

                          {/* Footer */}
                          <div className="entry-card-footer">
                            <div className="entry-total-cost-chip">
                              <span className="label">Chi phí:</span>
                              <strong>{formatVND(log.totalCost)}</strong>
                            </div>

                            <div className="entry-action-buttons">
                              <button 
                                className="btn-entry-action delete"
                                title="Xóa bản ghi này"
                                onClick={() => handleDelete(log.id)}
                              >
                                <Trash2 size={13} />
                                Xóa
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })
                )}

              </div>
            </div>

          </div>
        </div>
      </main>

      {/* MODAL: QUÉT HÓA ĐƠN (OCR) */}
      {showOcrModal && (
        <div className="journal-modal-overlay" onClick={() => setShowOcrModal(false)}>
          <div className="journal-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18} color="#d2b879" />
                <h3>Số hóa hóa đơn vật tư nông nghiệp (OCR)</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setShowOcrModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-dialog-body">
              <div className="modal-ocr-preview">
                <Camera size={44} color="#2f6949" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ margin: '0 0 6px', color: '#163d2a', fontWeight: 800 }}>
                  Chụp hoặc tải ảnh hóa đơn mua phân, thuốc
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#68776e' }}>
                  Hệ thống AI sẽ tự động đọc tên phân bón, số lượng, đơn giá và điền vào biểu mẫu.
                </p>
              </div>

              <div className="ocr-result-table">
                <div style={{ fontWeight: 700, marginBottom: '8px', color: '#163d2a' }}>
                  Hóa đơn mẫu phát hiện:
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee' }}>
                  <span>Vật tư:</span>
                  <b>NPK 16-16-8 Đầu Trâu</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee' }}>
                  <span>Số lượng:</span>
                  <b>100 kg (2 bao)</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee' }}>
                  <span>Tổng tiền thanh toán:</span>
                  <b style={{ color: '#b35e3f' }}>1.850.000 đ</b>
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button 
                  className="btn-submit-journal"
                  style={{ margin: 0, flex: 1 }}
                  onClick={handleApplyOcr}
                >
                  <Sparkles size={16} />
                  Áp dụng dữ liệu vào biểu mẫu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GHI ÂM AI */}
      {showVoiceModal && (
        <div className="journal-modal-overlay" onClick={() => setShowVoiceModal(false)}>
          <div className="journal-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mic size={18} color="#d2b879" />
                <h3>Ghi âm giọng nói hiện trường (AI)</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setShowVoiceModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-dialog-body" style={{ textAlign: 'center' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: isRecording ? '#fee2e2' : '#e7eee2',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 16px',
                border: isRecording ? '3px solid #ef4444' : '3px solid #2f6949'
              }}>
                <Mic size={32} color={isRecording ? '#ef4444' : '#2f6949'} />
              </div>

              <h4 style={{ margin: '0 0 8px', fontSize: '17px', color: '#163d2a' }}>
                {isRecording ? 'Đang lắng nghe ngoài vườn...' : 'Bấm để bắt đầu ghi âm'}
              </h4>
              <p style={{ fontSize: '13px', color: '#68776e', maxWidth: '380px', margin: '0 auto 20px' }}>
                Ví dụ nói: <i>"Hôm nay phun 3 chai thuốc Anvil cho lô Cà phê Catimor, tình trạng cây ổn định."</i>
              </p>

              <button 
                className="btn-submit-journal"
                style={{ margin: '0 auto', maxWidth: '280px' }}
                onClick={handleApplyVoice}
                disabled={isRecording}
              >
                {isRecording ? 'Đang xử lý AI...' : 'Bắt đầu nói & Áp dụng'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
