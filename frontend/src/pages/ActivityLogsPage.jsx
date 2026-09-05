import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  apiCreateActivityLog,
  apiDeleteActivityLog,
  apiGetActivityLogs,
  apiGetSeasons,
} from "../services/api";
import "./ActivityLogsPage.css";

const activityTypes = [
  ["LAND_PREPARATION", "Làm đất", "🚜"],
  ["WATERING", "Tưới nước", "💧"],
  ["FERTILIZING", "Bón phân", "🌱"],
  ["PESTICIDE", "Phun thuốc", "🧪"],
  ["PRUNING", "Tỉa cành", "✂️"],
  ["HARVEST", "Thu hoạch", "🧺"],
  ["OTHER", "Khác", "📋"],
];

const formatDate = (value) =>
  new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(
    new Date(value),
  );

const formatMoney = (value) =>
  value == null
    ? "Không phát sinh"
    : `${new Intl.NumberFormat("vi-VN").format(value)} đ`;

function ActivityLogsPage() {
  const { user } = useAuth();
  const [seasons, setSeasons] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    activityType: "",
    from: "",
    to: "",
  });
  const [form, setForm] = useState({
    cropCycleId: "",
    activityType: "FERTILIZING",
    activityDate: new Date().toISOString().slice(0, 10),
    cost: "",
    harvestQuantity: "",
    revenue: "",
    notes: "",
    photos: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const seasonData = await apiGetSeasons();
      setSeasons(seasonData);
      if (!form.cropCycleId && seasonData[0]) {
        setForm((current) => ({ ...current, cropCycleId: seasonData[0].id }));
      }
      setLogs(await apiGetActivityLogs(filters));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Không thể tải dữ liệu nhật ký",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedSeason = useMemo(
    () => seasons.find((season) => season.id === form.cropCycleId),
    [seasons, form.cropCycleId],
  );

  const updateFilter = (name, value) => {
    const nextFilters = { ...filters, [name]: value };
    setFilters(nextFilters);
    apiGetActivityLogs(nextFilters)
      .then(setLogs)
      .catch((requestError) =>
        setError(
          requestError.response?.data?.message || "Không thể lọc nhật ký",
        ),
      );
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          photos: [...prev.photos, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.cropCycleId) {
      setError("Hãy tạo mùa vụ trước khi ghi nhật ký.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const created = await apiCreateActivityLog({
        ...form,
        cost: form.cost === "" ? undefined : Number(form.cost),
        harvestQuantity:
          form.activityType === "HARVEST" && form.harvestQuantity !== ""
            ? Number(form.harvestQuantity)
            : undefined,
        revenue:
          form.activityType === "HARVEST" && form.revenue !== ""
            ? Number(form.revenue)
            : undefined,
      });
      setLogs((current) => [created, ...current]);
      setForm((current) => ({
        ...current,
        cost: "",
        harvestQuantity: "",
        revenue: "",
        notes: "",
        photos: [],
      }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể lưu nhật ký");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa nhật ký này?")) return;
    try {
      await apiDeleteActivityLog(id);
      setLogs((current) => current.filter((log) => log.id !== id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể xóa nhật ký");
    }
  };

  const getActivityDetails = (type) =>
    activityTypes.find(([value]) => value === type) || [type, type, "📝"];

  return (
    <div className="app">
      <Header />
      <main className="main container activity-logs-page">
        <section className="page-intro premium-intro">
          <div className="intro-content">
            <p className="eyebrow emerald">NHẬT KÝ CANH TÁC</p>
            <h1 className="premium-title">Ghi lại từng việc đã làm.</h1>
            <p className="intro-copy">
              Theo dõi hoạt động, quản lý vật tư và chi phí trực quan, mọi lúc mọi nơi.
            </p>
          </div>
          <div className="user-badge">
            <div className="avatar-circle">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <span className="activity-user">{user?.fullName}</span>
          </div>
        </section>

        {error && <div className="premium-alert error-alert">{error}</div>}

        <section className="activity-layout">
          <form className="glass-panel activity-form" onSubmit={handleSubmit}>
            <div className="panel-heading">
              <div className="heading-content">
                <span className="step-badge">01</span>
                <h2>Hoạt động mới</h2>
              </div>
              <p className="subtitle">Ghi nhận thông tin công việc hàng ngày</p>
            </div>
            
            <div className="form-group-card">
              <label>
                Khu vực & Mùa vụ
                <select
                  className="premium-select"
                  value={form.cropCycleId}
                  onChange={(event) =>
                    setForm({ ...form, cropCycleId: event.target.value })
                  }
                  required
                >
                  <option value="">Chọn mùa vụ...</option>
                  {seasons.map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.plot?.name} · {season.crop?.name} ({season.name})
                    </option>
                  ))}
                </select>
              </label>
              {selectedSeason && (
                <div className="context-chip">
                  <span className="chip-icon">📍</span>
                  {selectedSeason.plot?.farm?.name || "Nông hộ"} ·{" "}
                  {selectedSeason.plot?.name} · {selectedSeason.crop?.name}
                </div>
              )}
            </div>

            <div className="activity-form-grid">
              <div className="form-group-card">
                <label>
                  Loại hoạt động
                  <select
                    className="premium-select icon-select"
                    value={form.activityType}
                    onChange={(event) =>
                      setForm({ ...form, activityType: event.target.value })
                    }
                  >
                    {activityTypes.map(([value, label, icon]) => (
                      <option key={value} value={value}>
                        {icon} {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="form-group-card">
                <label>
                  Ngày thực hiện
                  <input
                    className="premium-input"
                    type="date"
                    value={form.activityDate}
                    onChange={(event) =>
                      setForm({ ...form, activityDate: event.target.value })
                    }
                    required
                  />
                </label>
              </div>
            </div>

            <div className="financial-grid">
              <div className="form-group-card">
                <label>
                  Chi phí (VNĐ)
                  <div className="input-with-currency">
                    <input
                      className="premium-input"
                      type="number"
                      min="0"
                      step="1000"
                      value={form.cost}
                      onChange={(event) =>
                        setForm({ ...form, cost: event.target.value })
                      }
                      placeholder="Nhập số tiền..."
                    />
                    <span className="currency-suffix">đ</span>
                  </div>
                </label>
              </div>
              
              {form.activityType === "HARVEST" && (
                <>
                  <div className="form-group-card highlight-card">
                    <label>
                      Sản lượng thu hoạch
                      <div className="input-with-currency">
                        <input
                          className="premium-input"
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.harvestQuantity}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              harvestQuantity: event.target.value,
                            })
                          }
                          placeholder="Ví dụ: 500"
                        />
                        <span className="currency-suffix">kg</span>
                      </div>
                    </label>
                  </div>
                  <div className="form-group-card highlight-card">
                    <label>
                      Doanh thu dự kiến (VNĐ)
                      <div className="input-with-currency">
                        <input
                          className="premium-input"
                          type="number"
                          min="0"
                          step="1000"
                          value={form.revenue}
                          onChange={(event) =>
                            setForm({ ...form, revenue: event.target.value })
                          }
                          placeholder="Nhập số tiền..."
                        />
                        <span className="currency-suffix">đ</span>
                      </div>
                    </label>
                  </div>
                </>
              )}
            </div>

            <div className="form-group-card full-width">
              <label>
                Hình ảnh đính kèm (Tùy chọn)
                <div className="photo-upload-zone">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    id="photo-upload"
                    className="hidden-file-input"
                  />
                  <label htmlFor="photo-upload" className="upload-button">
                    <span className="upload-icon">📸</span>
                    Thêm hình ảnh
                  </label>
                </div>
                {form.photos.length > 0 && (
                  <div className="photo-preview-grid">
                    {form.photos.map((photo, idx) => (
                      <div key={idx} className="photo-thumbnail">
                        <img src={photo} alt={`Upload ${idx}`} />
                        <button type="button" onClick={() => removePhoto(idx)} className="remove-photo-btn">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </label>
            </div>

            <div className="form-group-card full-width">
              <label>
                Ghi chú thêm
                <textarea
                  className="premium-textarea"
                  rows="3"
                  maxLength="2000"
                  value={form.notes}
                  onChange={(event) =>
                    setForm({ ...form, notes: event.target.value })
                  }
                  placeholder="Ghi chú về thời tiết, tình trạng cây, người làm..."
                />
              </label>
            </div>
            
            <div className="form-actions">
              <button
                className="premium-submit-btn"
                type="submit"
                disabled={saving || !seasons.length}
              >
                {saving ? "Đang lưu trữ..." : "Lưu Nhật Ký"}
                {!saving && <span className="btn-icon">→</span>}
              </button>
            </div>
            {!seasons.length && !loading && (
              <p className="premium-alert warning-alert">
                Chưa có mùa vụ. Hãy tạo mùa vụ trong Danh mục trước.
              </p>
            )}
          </form>

          <section className="glass-panel activity-history">
            <div className="panel-heading sticky-heading">
              <div className="heading-content">
                <span className="step-badge">02</span>
                <h2>Lịch sử hoạt động</h2>
              </div>
              <div className="log-counter">{logs.length} Bản ghi</div>
            </div>
            
            <div className="premium-filters">
              <select
                className="filter-select"
                value={filters.activityType}
                onChange={(event) =>
                  updateFilter("activityType", event.target.value)
                }
              >
                <option value="">Tất cả hoạt động</option>
                {activityTypes.map(([value, label, icon]) => (
                  <option key={value} value={value}>
                    {icon} {label}
                  </option>
                ))}
              </select>
              <div className="date-filters">
                <input
                  className="filter-date"
                  type="date"
                  value={filters.from}
                  onChange={(event) => updateFilter("from", event.target.value)}
                  aria-label="Từ ngày"
                />
                <span className="date-separator">-</span>
                <input
                  className="filter-date"
                  type="date"
                  value={filters.to}
                  onChange={(event) => updateFilter("to", event.target.value)}
                  aria-label="Đến ngày"
                />
              </div>
            </div>
            
            <div className="journal-scroll-area">
              {loading ? (
                <div className="empty-state skeleton-state">
                  <div className="skeleton-line" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line short" />
                </div>
              ) : logs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🍃</div>
                  <p>Chưa có nhật ký phù hợp.</p>
                </div>
              ) : (
                <div className="premium-journal-list">
                  {logs.map((log) => {
                    const [_, label, icon] = getActivityDetails(log.activityType);
                    return (
                      <article className="premium-journal-card" key={log.id}>
                        <div className="card-header">
                          <div className="activity-title-group">
                            <span className="activity-icon-large">{icon}</span>
                            <div>
                              <h3 className="activity-label">{label}</h3>
                              <time className="activity-time">{formatDate(log.activityDate)}</time>
                            </div>
                          </div>
                          <button
                            className="premium-icon-delete"
                            type="button"
                            onClick={() => handleDelete(log.id)}
                            aria-label="Xóa nhật ký"
                            title="Xóa nhật ký"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                        </div>
                        
                        <div className="card-body">
                          <div className="context-chip small-chip">
                            <span className="chip-icon">📍</span>
                            {log.cropCycle?.plot?.farm?.name} · {log.cropCycle?.plot?.name} · {log.cropCycle?.crop?.name}
                          </div>
                          
                          {log.notes && <p className="activity-notes">{log.notes}</p>}
                          
                          {log.photos && log.photos.length > 0 && (
                            <div className="log-photos-grid">
                              {log.photos.map((photo, idx) => (
                                <img key={idx} src={photo} alt={`Log ${idx}`} className="log-photo-img" loading="lazy" />
                              ))}
                            </div>
                          )}
                          
                          <div className="premium-journal-meta">
                            {log.cost != null && (
                              <div className="meta-pill cost-pill">
                                <span>Chi phí</span>
                                <strong>{formatMoney(log.cost)}</strong>
                              </div>
                            )}
                            {log.harvestQuantity != null && (
                              <div className="meta-pill yield-pill">
                                <span>Sản lượng</span>
                                <strong>{log.harvestQuantity} kg</strong>
                              </div>
                            )}
                            {log.revenue != null && (
                              <div className="meta-pill revenue-pill">
                                <span>Doanh thu</span>
                                <strong>{formatMoney(log.revenue)}</strong>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ActivityLogsPage;
