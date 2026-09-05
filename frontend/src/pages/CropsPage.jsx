import React, { useState, useMemo } from 'react';
import {
  Sprout,
  TreePine,
  Layers,
  Search,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  MapPin,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  X,
  RotateCcw,
  Sparkles,
  Filter,
  Leaf,
  ChevronRight,
  Info,
  ArrowRight
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/CropsPage.css';

// Central Highlands Perennial Crop Presets
const PRESET_CROPS = [
  {
    id: 'coffee',
    name: 'Cà phê',
    varieties: ['Catimor', 'Robusta TR4', 'Robusta TR9', 'Arabica Bourbon'],
    defaultSpacing: '3m x 3m',
    defaultDensity: 1100,
    avatar: '☕'
  },
  {
    id: 'durian',
    name: 'Sầu riêng',
    varieties: ['Ri6', 'Monthong (Dona)', 'Musang King', 'Black Thorn'],
    defaultSpacing: '8m x 8m',
    defaultDensity: 156,
    avatar: '🍈'
  },
  {
    id: 'macadamia',
    name: 'Mắc ca',
    varieties: ['QN1', 'OC (246)', 'A16', 'Daddow'],
    defaultSpacing: '7m x 4m',
    defaultDensity: 350,
    avatar: '🌰'
  }
];

const AVAILABLE_PLOTS = [
  { id: 'plot-1', code: 'Lô 01', name: 'Đồi Cà phê Catimor', area: '2.0 ha' },
  { id: 'plot-2', code: 'Lô 02', name: 'Vườn Sầu riêng Suối Đá', area: '1.5 ha' },
  { id: 'plot-3', code: 'Lô 03', name: 'Khu Xen canh Cà phê & Sầu riêng', area: '1.2 ha' },
  { id: 'plot-4', code: 'Lô 04', name: 'Đồi Mắc ca Đắk Lắk', area: '0.7 ha' }
];

const INITIAL_CROPS = [
  {
    id: 'crop-1',
    category: 'coffee',
    name: 'Cà phê Catimor',
    variety: 'Catimor F6',
    plantingYear: 2018,
    stage: 'Kinh doanh', // 'Kiến thiết' | 'Kinh doanh'
    farmingType: 'Xen canh', // 'Thuần loài' | 'Xen canh'
    spacing: '3.0m x 3.0m',
    density: 1100,
    totalTrees: 1320,
    targetYield: '3.8 tấn nhân/ha',
    plots: ['plot-1', 'plot-3'],
    note: 'Cây sinh trưởng mạnh, kháng bệnh gỉ sắt tốt. Trồng xen sầu riêng Ri6 để che bóng tầng cao.',
    status: 'active'
  },
  {
    id: 'crop-2',
    category: 'durian',
    name: 'Sầu riêng Ri6',
    variety: 'Ri6 cơm vàng hạt lép',
    plantingYear: 2020,
    stage: 'Kinh doanh',
    farmingType: 'Xen canh',
    spacing: '8.0m x 8.0m',
    density: 156,
    totalTrees: 230,
    targetYield: '14.5 tấn trái/năm',
    plots: ['plot-2', 'plot-3'],
    note: 'Năm thứ 6 cho thu bói chính thức, chất lượng cơm ráo và ngọt đậm.',
    status: 'active'
  },
  {
    id: 'crop-3',
    category: 'macadamia',
    name: 'Mắc ca QN1',
    variety: 'QN1 Cao nguyên',
    plantingYear: 2023,
    stage: 'Kiến thiết',
    farmingType: 'Thuần loài',
    spacing: '7.0m x 4.0m',
    density: 350,
    totalTrees: 245,
    targetYield: 'Dự kiến 2.0 tấn/ha (năm 5)',
    plots: ['plot-4'],
    note: 'Giai đoạn kiến thiết cơ bản năm thứ 3. Đang tỉa cành tạo tán đa thân hình nấm.',
    status: 'active'
  }
];

export default function CropsPage() {
  const currentYear = new Date().getFullYear();

  // Master States
  const [crops, setCrops] = useState(INITIAL_CROPS);
  const [activeTab, setActiveTab] = useState('crops'); // 'crops' | 'plots' | 'seasons'
  const [toast, setToast] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlot, setFilterPlot] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [filterFarmingType, setFilterFarmingType] = useState('all');

  // Form States
  const [editingId, setEditingId] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(PRESET_CROPS[0].id);
  const [variety, setVariety] = useState(PRESET_CROPS[0].varieties[0]);
  const [plantingYear, setPlantingYear] = useState(2021);
  const [stage, setStage] = useState('Kinh doanh');
  const [farmingType, setFarmingType] = useState('Xen canh');
  const [spacing, setSpacing] = useState(PRESET_CROPS[0].defaultSpacing);
  const [density, setDensity] = useState(PRESET_CROPS[0].defaultDensity);
  const [totalTrees, setTotalTrees] = useState(350);
  const [targetYield, setTargetYield] = useState('3.5 tấn/ha');
  const [selectedPlots, setSelectedPlots] = useState(['plot-1']);
  const [note, setNote] = useState('');

  // Auto calculate tree age
  const calculatedAge = useMemo(() => {
    const age = currentYear - Number(plantingYear || currentYear);
    return age >= 0 ? age : 0;
  }, [plantingYear, currentYear]);

  // Handle Preset Change
  const handlePresetSelect = (presetId) => {
    setSelectedPreset(presetId);
    const preset = PRESET_CROPS.find((p) => p.id === presetId);
    if (preset) {
      setVariety(preset.varieties[0]);
      setSpacing(preset.defaultSpacing);
      setDensity(preset.defaultDensity);
    }
  };

  // Toggle Plot Selection in Form
  const togglePlotSelection = (plotId) => {
    setSelectedPlots((prev) =>
      prev.includes(plotId) ? prev.filter((p) => p !== plotId) : [...prev, plotId]
    );
  };

  // Trigger Notification Toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Reset Form
  const handleResetForm = () => {
    setEditingId(null);
    setSelectedPreset(PRESET_CROPS[0].id);
    setVariety(PRESET_CROPS[0].varieties[0]);
    setPlantingYear(2021);
    setStage('Kinh doanh');
    setFarmingType('Xen canh');
    setSpacing(PRESET_CROPS[0].defaultSpacing);
    setDensity(PRESET_CROPS[0].defaultDensity);
    setTotalTrees(350);
    setTargetYield('3.5 tấn/ha');
    setSelectedPlots(['plot-1']);
    setNote('');
  };

  // Load Crop to Edit
  const handleEdit = (crop) => {
    setEditingId(crop.id);
    setSelectedPreset(crop.category);
    setVariety(crop.variety);
    setPlantingYear(crop.plantingYear);
    setStage(crop.stage);
    setFarmingType(crop.farmingType);
    setSpacing(crop.spacing);
    setDensity(crop.density);
    setTotalTrees(crop.totalTrees);
    setTargetYield(crop.targetYield);
    setSelectedPlots(crop.plots);
    setNote(crop.note || '');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedPlots.length === 0) {
      showToast('Vui lòng chọn ít nhất một Lô/Vườn liên kết!', 'error');
      return;
    }

    const currentPreset = PRESET_CROPS.find((p) => p.id === selectedPreset);

    if (editingId) {
      // Update
      setCrops((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                category: selectedPreset,
                name: `${currentPreset?.name} ${variety}`,
                variety,
                plantingYear: Number(plantingYear),
                stage,
                farmingType,
                spacing,
                density: Number(density),
                totalTrees: Number(totalTrees),
                targetYield,
                plots: selectedPlots,
                note
              }
            : item
        )
      );
      showToast(`Đã cập nhật dữ liệu giống ${currentPreset?.name}!`);
      handleResetForm();
    } else {
      // Create new
      const newCrop = {
        id: `crop-${Date.now()}`,
        category: selectedPreset,
        name: `${currentPreset?.name} ${variety}`,
        variety,
        plantingYear: Number(plantingYear),
        stage,
        farmingType,
        spacing,
        density: Number(density),
        totalTrees: Number(totalTrees),
        targetYield,
        plots: selectedPlots,
        note,
        status: 'active'
      };
      setCrops([newCrop, ...crops]);
      showToast(`Đã thêm thành công ${newCrop.name} vào danh mục sản xuất!`);
      handleResetForm();
    }
  };

  // Delete Crop
  const handleDelete = (id, name) => {
    if (window.confirm(`Xác nhận xóa giống cây "${name}" khỏi cơ sở dữ liệu canh tác?`)) {
      setCrops((prev) => prev.filter((c) => c.id !== id));
      showToast(`Đã xóa giống cây "${name}".`, 'info');
      if (editingId === id) handleResetForm();
    }
  };

  // Filtered List
  const filteredCrops = useMemo(() => {
    return crops.filter((item) => {
      // Search
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.note.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter Plot
      const matchPlot =
        filterPlot === 'all' ? true : item.plots.includes(filterPlot);

      // Filter Stage
      const matchStage =
        filterStage === 'all' ? true : item.stage === filterStage;

      // Filter Farming Type
      const matchFarmingType =
        filterFarmingType === 'all' ? true : item.farmingType === filterFarmingType;

      return matchSearch && matchPlot && matchStage && matchFarmingType;
    });
  }, [crops, searchQuery, filterPlot, filterStage, filterFarmingType]);

  // Quick Stats
  const totalTreesSum = useMemo(() => crops.reduce((acc, c) => acc + c.totalTrees, 0), [crops]);
  const intercropCount = useMemo(() => crops.filter((c) => c.farmingType === 'Xen canh').length, [crops]);

  return (
    <div className="crops-page-wrapper">
      <Header />

      {/* Floating Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: toast.type === 'error' ? '#991b1b' : '#163d2a',
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
          fontSize: '14px'
        }}>
          {toast.type === 'error' ? (
            <AlertCircle size={18} color="#fca5a5" />
          ) : (
            <CheckCircle2 size={18} color="#4ade80" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{ background: 'transparent', border: 'none', color: '#cad5ca', cursor: 'pointer', marginLeft: '8px' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 1. HERO BANNER */}
      <section className="crops-hero">
        <div className="crops-hero-grain" />
        <div className="container crops-hero-inner">
          <div>
            <p className="crops-breadcrumb">
              <span className="dot" /> THIẾT LẬP SẢN XUẤT / CÂY TRỒNG & VƯỜN
            </p>
            <h1 className="crops-hero-title">
              Cây trồng & <em>Dữ liệu nền sản xuất.</em>
            </h1>
            <p className="crops-hero-lead">
              Quản lý giống cây dài ngày (Cà phê, Sầu riêng, Mắc ca), theo dõi năm xuống giống,
              chu kỳ khấu hao kiến thiết cơ bản và mô hình trồng xen canh Tây Nguyên.
            </p>
          </div>

          {/* Navigation Tabs with Counters */}
          <div className="crops-nav-tabs">
            <button
              className={`crops-tab-btn ${activeTab === 'crops' ? 'active' : ''}`}
              onClick={() => setActiveTab('crops')}
            >
              <Leaf size={15} />
              <span>Cây trồng</span>
              <span className="tab-counter-badge">{crops.length}</span>
            </button>
            <button
              className={`crops-tab-btn ${activeTab === 'plots' ? 'active' : ''}`}
              onClick={() => setActiveTab('plots')}
            >
              <MapPin size={15} />
              <span>Vườn & Lô đất</span>
              <span className="tab-counter-badge">{AVAILABLE_PLOTS.length}</span>
            </button>
            <button
              className={`crops-tab-btn ${activeTab === 'seasons' ? 'active' : ''}`}
              onClick={() => setActiveTab('seasons')}
            >
              <Calendar size={15} />
              <span>Mùa vụ & Chu kỳ</span>
              <span className="tab-counter-badge">2</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. KPI METRICS BAR */}
      <section className="crops-kpi-bar">
        <div className="container">
          <div className="crops-kpi-grid">
            
            {/* KPI 1 */}
            <div className="crop-kpi-card gold-border">
              <div className="crop-kpi-header">
                <span className="crop-kpi-label">Tổng diện tích canh tác</span>
                <span className="crop-kpi-icon gold"><MapPin size={16} /></span>
              </div>
              <div className="crop-kpi-val">5.4 ha</div>
              <div className="crop-kpi-sub">4 lô đất đã quy hoạch ranh giới rõ ràng</div>
            </div>

            {/* KPI 2 */}
            <div className="crop-kpi-card">
              <div className="crop-kpi-header">
                <span className="crop-kpi-label">Tổng số gốc cây</span>
                <span className="crop-kpi-icon leaf"><TreePine size={16} /></span>
              </div>
              <div className="crop-kpi-val">
                {new Intl.NumberFormat('vi-VN').format(totalTreesSum)} gốc
              </div>
              <div className="crop-kpi-sub">Đã định danh theo từng lô & chu kỳ sinh trưởng</div>
            </div>

            {/* KPI 3 */}
            <div className="crop-kpi-card">
              <div className="crop-kpi-header">
                <span className="crop-kpi-label">Mô hình xen canh</span>
                <span className="crop-kpi-icon clay"><Layers size={16} /></span>
              </div>
              <div className="crop-kpi-val">{intercropCount} giống xen</div>
              <div className="crop-kpi-sub">Cà phê xen Sầu riêng & Mắc ca che bóng</div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE (2 COLUMNS) */}
      <main className="crops-workspace">
        <div className="container">
          <div className="crops-columns">
            
            {/* LEFT COLUMN: FORM */}
            <aside>
              <div className="crop-form-card">
                
                <div className="crop-form-header">
                  <div>
                    <p className="crop-form-eyebrow">
                      {editingId ? 'CẬP NHẬT DỮ LIỆU' : '01 / THIẾT LẬP GIỐNG'}
                    </p>
                    <h2>{editingId ? 'Chỉnh sửa giống cây' : 'Thêm cây trồng / Quản lý giống'}</h2>
                    <p>Định danh giống, mật độ và phân bổ theo lô đất</p>
                  </div>
                  {editingId && (
                    <button className="btn-reset-editing" onClick={handleResetForm}>
                      <RotateCcw size={12} /> Hủy sửa
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit}>
                  
                  {/* Category Selection */}
                  <div className="form-field-item">
                    <label className="form-item-label">
                      Loại cây trồng chủ lực <span className="req">*</span>
                    </label>
                    <div className="preset-crops-grid">
                      {PRESET_CROPS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          className={`preset-crop-btn ${selectedPreset === preset.id ? 'active' : ''}`}
                          onClick={() => handlePresetSelect(preset.id)}
                        >
                          <span className="crop-emoji">{preset.avatar}</span>
                          <span className="crop-name">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cultivar / Variety */}
                  <div className="form-field-item">
                    <label className="form-item-label">
                      Giống cụ thể (Cultivar / Variety) <span className="req">*</span>
                    </label>
                    <div className="variety-tags-row">
                      {PRESET_CROPS.find((p) => p.id === selectedPreset)?.varieties.map((v) => (
                        <button
                          key={v}
                          type="button"
                          className={`variety-tag-pill ${variety === v ? 'active' : ''}`}
                          onClick={() => setVariety(v)}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      className="crop-text-input"
                      required
                      value={variety}
                      onChange={(e) => setVariety(e.target.value)}
                      placeholder="Hoặc nhập tên giống khác..."
                    />
                  </div>

                  {/* Planting Year & Tree Age */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }} className="form-field-item">
                    <div>
                      <label className="form-item-label">
                        Năm xuống giống <span className="req">*</span>
                      </label>
                      <input
                        type="number"
                        min="1980"
                        max={currentYear}
                        className="crop-text-input"
                        required
                        value={plantingYear}
                        onChange={(e) => setPlantingYear(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-item-label">Tuổi cây ước tính</label>
                      <div className="calculated-age-box">
                        <strong>{calculatedAge} năm tuổi</strong>
                        <small style={{ color: '#79877a' }}>Khấu hao</small>
                      </div>
                    </div>
                  </div>

                  {/* Growth Stage */}
                  <div className="form-field-item">
                    <label className="form-item-label">
                      Giai đoạn sinh trưởng <span className="req">*</span>
                    </label>
                    <div className="segmented-control-2">
                      <button
                        type="button"
                        className={`segment-btn ${stage === 'Kinh doanh' ? 'active-stage-commercial' : ''}`}
                        onClick={() => setStage('Kinh doanh')}
                      >
                        Thời kỳ kinh doanh (Thu hoạch)
                      </button>
                      <button
                        type="button"
                        className={`segment-btn ${stage === 'Kiến thiết' ? 'active-stage-basic' : ''}`}
                        onClick={() => setStage('Kiến thiết')}
                      >
                        Kiến thiết cơ bản (Chưa thu)
                      </button>
                    </div>
                  </div>

                  {/* Farming System */}
                  <div className="form-field-item">
                    <label className="form-item-label">Hình thức canh tác</label>
                    <div className="segmented-control-2">
                      <button
                        type="button"
                        className={`segment-btn ${farmingType === 'Thuần loài' ? 'active-farming' : ''}`}
                        onClick={() => setFarmingType('Thuần loài')}
                      >
                        🌱 Thuần loài
                      </button>
                      <button
                        type="button"
                        className={`segment-btn ${farmingType === 'Xen canh' ? 'active-farming' : ''}`}
                        onClick={() => setFarmingType('Xen canh')}
                      >
                        🌿 Trồng xen canh
                      </button>
                    </div>
                  </div>

                  {/* Specifications: Spacing, Density, Count */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }} className="form-field-item">
                    <div>
                      <label className="form-item-label" style={{ fontSize: '11px' }}>Khoảng cách</label>
                      <input
                        type="text"
                        className="crop-text-input"
                        value={spacing}
                        onChange={(e) => setSpacing(e.target.value)}
                        placeholder="3m x 3m"
                      />
                    </div>
                    <div>
                      <label className="form-item-label" style={{ fontSize: '11px' }}>Mật độ (gốc/ha)</label>
                      <input
                        type="number"
                        className="crop-text-input"
                        value={density}
                        onChange={(e) => setDensity(e.target.value)}
                        placeholder="1100"
                      />
                    </div>
                    <div>
                      <label className="form-item-label" style={{ fontSize: '11px' }}>Tổng số gốc</label>
                      <input
                        type="number"
                        className="crop-text-input"
                        style={{ fontWeight: 'bold' }}
                        value={totalTrees}
                        onChange={(e) => setTotalTrees(e.target.value)}
                        placeholder="350"
                      />
                    </div>
                  </div>

                  {/* Linked Plots */}
                  <div className="form-field-item">
                    <label className="form-item-label">
                      Gán vào Lô / Vườn canh tác <span className="req">*</span>
                    </label>
                    <div className="plots-select-container">
                      {AVAILABLE_PLOTS.map((plot) => {
                        const isChecked = selectedPlots.includes(plot.id);
                        return (
                          <div
                            key={plot.id}
                            className={`plot-select-item ${isChecked ? 'selected' : ''}`}
                            onClick={() => togglePlotSelection(plot.id)}
                          >
                            <div>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                              />
                              <span><strong>{plot.code}</strong> - {plot.name}</span>
                            </div>
                            <small style={{ color: '#79877a' }}>{plot.area}</small>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Target Yield */}
                  <div className="form-field-item">
                    <label className="form-item-label">Mục tiêu năng suất dự kiến</label>
                    <input
                      type="text"
                      className="crop-text-input"
                      value={targetYield}
                      onChange={(e) => setTargetYield(e.target.value)}
                      placeholder="VD: 3.8 tấn nhân/ha hoặc 15 tấn trái/năm"
                    />
                  </div>

                  {/* Notes */}
                  <div className="form-field-item">
                    <label className="form-item-label">Ghi chú canh tác & lịch sử giống</label>
                    <textarea
                      className="crop-textarea"
                      rows="2"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Nguồn gốc phôi giống, khả năng chịu hạn, tình trạng sâu bệnh..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn-submit-crop">
                    <span>{editingId ? 'Cập nhật giống cây' : 'Lưu thông tin cây trồng'}</span>
                    <ArrowRight size={16} />
                  </button>

                </form>
              </div>
            </aside>

            {/* RIGHT COLUMN: CATALOG & CARDS */}
            <div className="crops-catalog-area">
              
              {/* Filter Card */}
              <div className="crops-filter-card">
                <div className="crops-filter-top">
                  <div className="crops-search-box">
                    <Search size={14} className="crops-search-icon" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm theo tên giống, loại cây, lô đất..."
                    />
                  </div>

                  <select
                    className="crop-select-input"
                    style={{ width: 'auto', minWidth: '170px', padding: '9px 12px' }}
                    value={filterPlot}
                    onChange={(e) => setFilterPlot(e.target.value)}
                  >
                    <option value="all">Tất cả Lô đất</option>
                    {AVAILABLE_PLOTS.map((p) => (
                      <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Filter Chips */}
                <div className="crops-filter-chips">
                  <span style={{ fontSize: '11px', color: '#79877a', display: 'flex', alignItems: 'center', marginRight: '4px' }}>
                    Giai đoạn:
                  </span>
                  {['all', 'Kinh doanh', 'Kiến thiết'].map((stg) => (
                    <button
                      key={stg}
                      className={`filter-chip-btn ${filterStage === stg ? 'active' : ''}`}
                      onClick={() => setFilterStage(stg)}
                    >
                      {stg === 'all' ? 'Tất cả' : stg}
                    </button>
                  ))}

                  <span style={{ fontSize: '11px', color: '#79877a', display: 'flex', alignItems: 'center', margin: '0 4px 0 12px' }}>
                    Hình thức:
                  </span>
                  {['all', 'Thuần loài', 'Xen canh'].map((ft) => (
                    <button
                      key={ft}
                      className={`filter-chip-btn ${filterFarmingType === ft ? 'active' : ''}`}
                      onClick={() => setFilterFarmingType(ft)}
                    >
                      {ft === 'all' ? 'Tất cả' : ft}
                    </button>
                  ))}
                </div>
              </div>

              {/* Counter status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#79877a', marginBottom: '14px', padding: '0 4px' }}>
                <span>Đang hiển thị <b>{filteredCrops.length}</b> / {crops.length} giống cây trồng</span>
                <span>Chu kỳ niên vụ 2026</span>
              </div>

              {/* Crops Feed */}
              {filteredCrops.length === 0 ? (
                <div className="crop-empty-state">
                  <Leaf size={40} color="#a6b6a8" style={{ margin: '0 auto 10px' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px' }}>
                    Không tìm thấy giống cây phù hợp
                  </h3>
                  <p style={{ fontSize: '13px', color: '#68776e', maxWidth: '360px', margin: '0 auto 14px' }}>
                    Hãy thử xóa bộ lọc hoặc thêm giống cây mới bằng biểu mẫu bên trái.
                  </p>
                  <button
                    className="btn-reset-editing"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterPlot('all');
                      setFilterStage('all');
                      setFilterFarmingType('all');
                    }}
                  >
                    <RotateCcw size={12} /> Đặt lại bộ lọc
                  </button>
                </div>
              ) : (
                <div className="crops-cards-feed">
                  {filteredCrops.map((crop) => {
                    const preset = PRESET_CROPS.find((p) => p.id === crop.category);
                    const treeAge = currentYear - crop.plantingYear;
                    const isCommercial = crop.stage === 'Kinh doanh';

                    return (
                      <div key={crop.id} className="crop-card-entry">
                        
                        {/* Top Bar */}
                        <div className="crop-card-top">
                          <div className="crop-card-title-group">
                            <div className="crop-card-avatar">
                              {preset?.avatar || '🌱'}
                            </div>
                            <div>
                              <h3 className="crop-card-name">{crop.name}</h3>
                              <div className="crop-card-badges">
                                <span className={`crop-badge-pill ${isCommercial ? 'commercial' : 'basic'}`}>
                                  {crop.stage}
                                </span>
                                <span className="crop-badge-pill farming-system">
                                  {crop.farmingType}
                                </span>
                                <span style={{ fontSize: '11px', color: '#79877a', display: 'flex', alignItems: 'center' }}>
                                  Xuống giống {crop.plantingYear} ({treeAge} năm tuổi)
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="crop-card-actions">
                            <button
                              className="btn-card-action"
                              title="Chỉnh sửa thông tin"
                              onClick={() => handleEdit(crop)}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              className="btn-card-action delete"
                              title="Xóa giống này"
                              onClick={() => handleDelete(crop.id, crop.name)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Details grid */}
                        <div className="crop-card-details-grid">
                          <div className="card-detail-item">
                            <span className="label">Số lượng gốc</span>
                            <strong>{new Intl.NumberFormat('vi-VN').format(crop.totalTrees)} gốc</strong>
                          </div>
                          <div className="card-detail-item">
                            <span className="label">Quy cách & Mật độ</span>
                            <strong>{crop.spacing} · {crop.density} cây/ha</strong>
                          </div>
                          <div className="card-detail-item">
                            <span className="label">Mục tiêu năng suất</span>
                            <strong style={{ color: '#2f6949' }}>{crop.targetYield}</strong>
                          </div>
                        </div>

                        {/* Linked Plots */}
                        <div className="crop-linked-plots">
                          <span style={{ color: '#79877a' }}>Đang canh tác tại:</span>
                          {crop.plots.map((plotId) => {
                            const p = AVAILABLE_PLOTS.find((item) => item.id === plotId);
                            return (
                              <span key={plotId} className="linked-plot-tag">
                                <MapPin size={11} style={{ display: 'inline', marginRight: '3px' }} />
                                {p?.code} - {p?.name}
                              </span>
                            );
                          })}
                        </div>

                        {/* Note */}
                        {crop.note && (
                          <div style={{
                            background: '#ffffff',
                            borderLeft: '3px solid #2f6949',
                            padding: '8px 12px',
                            fontSize: '12px',
                            color: '#556758',
                            fontStyle: 'italic',
                            marginBottom: '10px'
                          }}>
                            "{crop.note}"
                          </div>
                        )}

                        {/* Footer */}
                        <div className="crop-card-footer">
                          <span style={{ color: '#79877a', fontSize: '11px' }}>
                            <Info size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                            Đã kích hoạt tính toán chi phí khấu hao theo tuổi cây
                          </span>
                          <a href="/activity-logs">
                            Xem nhật ký canh tác
                            <ChevronRight size={13} />
                          </a>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
