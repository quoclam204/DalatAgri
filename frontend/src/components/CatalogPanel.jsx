import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(", ")
      : data?.message || "Không thể kết nối máy chủ";
    throw new Error(message);
  }
  return data;
}

function CatalogPanel({ user }) {
  const [tab, setTab] = useState("crops");
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [plots, setPlots] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cropForm, setCropForm] = useState({ name: "", type: "" });
  const [farmForm, setFarmForm] = useState({
    name: "",
    location: "",
    totalArea: "",
  });
  const [plotForm, setPlotForm] = useState({ farmId: "", name: "", area: "" });
  const [seasonForm, setSeasonForm] = useState({
    plotId: "",
    cropId: "",
    name: "",
    startDate: "",
    expectedEndDate: "",
  });

  const loadData = async () => {
    try {
      setError("");
      const [cropData, farmData, plotData, seasonData] = await Promise.all([
        request("/catalog/crops"),
        request("/catalog/farms"),
        request("/catalog/plots"),
        request("/catalog/seasons"),
      ]);
      setCrops(cropData);
      setFarms(farmData);
      setPlots(plotData);
      setSeasons(seasonData);
      setPlotForm((current) => ({
        ...current,
        farmId: current.farmId || farmData[0]?.id || "",
      }));
      setSeasonForm((current) => ({
        ...current,
        plotId: current.plotId || plotData[0]?.id || "",
        cropId: current.cropId || cropData[0]?.id || "",
      }));
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (event, path, body, reset) => {
    event.preventDefault();
    try {
      setError("");
      await request(path, { method: "POST", body: JSON.stringify(body) });
      reset();
      setMessage("Đã lưu dữ liệu vào PostgreSQL");
      await loadData();
    } catch (submitError) {
      setMessage("");
      setError(submitError.message);
    }
  };

  const deleteCrop = async (id) => {
    if (!window.confirm("Xóa cây trồng này?")) return;
    try {
      await request(`/catalog/crops/${id}`, { method: "DELETE" });
      setMessage("Đã ngừng sử dụng cây trồng");
      await loadData();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <section className="panel catalog-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">04 / DANH MỤC</p>
          <h2>Dữ liệu nền sản xuất</h2>
        </div>
        <button className="sync-button" type="button" onClick={loadData}>
          Làm mới
        </button>
      </div>
      <div className="catalog-tabs">
        {[
          ["crops", "Cây trồng"],
          ["farms", "Vườn"],
          ["plots", "Lô trồng"],
          ["seasons", "Mùa vụ"],
        ].map(([value, label]) => (
          <button
            className={tab === value ? "active" : ""}
            key={value}
            type="button"
            onClick={() => setTab(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {error && <p className="catalog-message error">{error}</p>}
      {message && <p className="catalog-message success">{message}</p>}

      {tab === "crops" && (
        <div className="catalog-layout">
          <form
            className="catalog-form"
            onSubmit={(event) =>
              submit(event, "/catalog/crops", cropForm, () =>
                setCropForm({ name: "", type: "" }),
              )
            }
          >
            <h3>Thêm cây trồng</h3>
            <label>
              Tên cây
              <input
                required
                value={cropForm.name}
                onChange={(event) =>
                  setCropForm({ ...cropForm, name: event.target.value })
                }
                placeholder="Cà phê"
              />
            </label>
            <label>
              Nhóm cây
              <input
                required
                value={cropForm.type}
                onChange={(event) =>
                  setCropForm({ ...cropForm, type: event.target.value })
                }
                placeholder="Cây công nghiệp"
              />
            </label>
            <button className="primary-button" type="submit">
              Lưu cây trồng
            </button>
          </form>
          <div className="catalog-list">
            <h3>{crops.length} cây trồng trong hệ thống</h3>
            {crops.length === 0 ? (
              <p className="empty-state">Chưa có cây trồng.</p>
            ) : (
              crops.map((crop) => (
                <div className="catalog-row" key={crop.id}>
                  <div>
                    <strong>{crop.name}</strong>
                    <small>{crop.type}</small>
                  </div>
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => deleteCrop(crop.id)}
                  >
                    Xóa
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "farms" && (
        <div className="catalog-layout">
          <form
            className="catalog-form"
            onSubmit={(event) =>
              submit(
                event,
                "/catalog/farms",
                { ...farmForm, userId: user?.id },
                () => setFarmForm({ name: "", location: "", totalArea: "" }),
              )
            }
          >
            <h3>Thêm vườn</h3>
            {!user && (
              <p className="catalog-message error">
                Đăng nhập trước khi tạo vườn.
              </p>
            )}
            <label>
              Tên vườn
              <input
                required
                value={farmForm.name}
                onChange={(event) =>
                  setFarmForm({ ...farmForm, name: event.target.value })
                }
              />
            </label>
            <label>
              Địa điểm
              <input
                required
                value={farmForm.location}
                onChange={(event) =>
                  setFarmForm({ ...farmForm, location: event.target.value })
                }
              />
            </label>
            <label>
              Diện tích (ha)
              <input
                required
                min="0.01"
                step="0.01"
                type="number"
                value={farmForm.totalArea}
                onChange={(event) =>
                  setFarmForm({ ...farmForm, totalArea: event.target.value })
                }
              />
            </label>
            <button className="primary-button" disabled={!user} type="submit">
              Lưu vườn
            </button>
          </form>
          <div className="catalog-list">
            <h3>{farms.length} vườn</h3>
            {farms.map((farm) => (
              <div className="catalog-row" key={farm.id}>
                <div>
                  <strong>{farm.name}</strong>
                  <small>
                    {farm.location} · {farm.totalArea} ha
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "plots" && (
        <div className="catalog-layout">
          <form
            className="catalog-form"
            onSubmit={(event) =>
              submit(event, "/catalog/plots", plotForm, () =>
                setPlotForm({ ...plotForm, name: "", area: "" }),
              )
            }
          >
            <h3>Thêm lô trồng</h3>
            <label>
              Vườn
              <select
                required
                value={plotForm.farmId}
                onChange={(event) =>
                  setPlotForm({ ...plotForm, farmId: event.target.value })
                }
              >
                {farms.map((farm) => (
                  <option key={farm.id} value={farm.id}>
                    {farm.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tên lô
              <input
                required
                value={plotForm.name}
                onChange={(event) =>
                  setPlotForm({ ...plotForm, name: event.target.value })
                }
              />
            </label>
            <label>
              Diện tích (ha)
              <input
                required
                min="0.01"
                step="0.01"
                type="number"
                value={plotForm.area}
                onChange={(event) =>
                  setPlotForm({ ...plotForm, area: event.target.value })
                }
              />
            </label>
            <button
              className="primary-button"
              disabled={!farms.length}
              type="submit"
            >
              Lưu lô
            </button>
          </form>
          <div className="catalog-list">
            <h3>{plots.length} lô trồng</h3>
            {plots.map((plot) => (
              <div className="catalog-row" key={plot.id}>
                <div>
                  <strong>{plot.name}</strong>
                  <small>
                    {plot.farm?.name} · {plot.area} ha
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "seasons" && (
        <div className="catalog-layout">
          <form
            className="catalog-form"
            onSubmit={(event) =>
              submit(event, "/catalog/seasons", seasonForm, () =>
                setSeasonForm({
                  ...seasonForm,
                  name: "",
                  startDate: "",
                  expectedEndDate: "",
                }),
              )
            }
          >
            <h3>Thêm mùa vụ</h3>
            <label>
              Lô trồng
              <select
                required
                value={seasonForm.plotId}
                onChange={(event) =>
                  setSeasonForm({ ...seasonForm, plotId: event.target.value })
                }
              >
                {plots.map((plot) => (
                  <option key={plot.id} value={plot.id}>
                    {plot.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Cây trồng
              <select
                required
                value={seasonForm.cropId}
                onChange={(event) =>
                  setSeasonForm({ ...seasonForm, cropId: event.target.value })
                }
              >
                {crops.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tên mùa vụ
              <input
                required
                value={seasonForm.name}
                onChange={(event) =>
                  setSeasonForm({ ...seasonForm, name: event.target.value })
                }
                placeholder="Mùa cà phê 2026"
              />
            </label>
            <div className="date-grid">
              <label>
                Bắt đầu
                <input
                  required
                  type="date"
                  value={seasonForm.startDate}
                  onChange={(event) =>
                    setSeasonForm({
                      ...seasonForm,
                      startDate: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                Kết thúc
                <input
                  required
                  type="date"
                  value={seasonForm.expectedEndDate}
                  onChange={(event) =>
                    setSeasonForm({
                      ...seasonForm,
                      expectedEndDate: event.target.value,
                    })
                  }
                />
              </label>
            </div>
            <button
              className="primary-button"
              disabled={!plots.length || !crops.length}
              type="submit"
            >
              Lưu mùa vụ
            </button>
          </form>
          <div className="catalog-list">
            <h3>{seasons.length} mùa vụ</h3>
            {seasons.map((season) => (
              <div className="catalog-row" key={season.id}>
                <div>
                  <strong>{season.name}</strong>
                  <small>
                    {season.crop?.name} · {season.plot?.name} · {season.status}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default CatalogPanel;
