import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ── Axios instance với interceptor tự động gắn token ──────────
export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ── Auth APIs ──────────────────────────────────────────────────

/** Đăng ký tài khoản mới */
export const apiRegister = async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
};

/** Đăng nhập */
export const apiLogin = async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};

// ── Users APIs ─────────────────────────────────────────────────

/** Lấy thông tin cá nhân (đang đăng nhập) */
export const apiGetMe = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

/** Cập nhật thông tin cá nhân */
export const apiUpdateMe = async (data) => {
    const response = await api.patch('/users/me', data);
    return response.data;
};

/** Lấy danh sách tất cả users (ADMIN) */
export const apiGetAllUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

/** Thay đổi vai trò người dùng (ADMIN) */
export const apiUpdateUserRole = async (userId, role) => {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
};

/** Kích hoạt / vô hiệu hóa tài khoản (ADMIN) */
export const apiToggleUserActive = async (userId) => {
    const response = await api.patch(`/users/${userId}/toggle-active`);
    return response.data;
};

/** Xóa mềm người dùng (ADMIN) */
export const apiDeleteUser = async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
};

// ── Farms APIs ─────────────────────────────────────────────────

/** Lấy danh sách nông hộ của tôi */
export const apiGetMyFarms = async () => {
    const response = await api.get('/farms');
    return response.data;
};

/** Tạo nông hộ mới */
export const apiCreateFarm = async (data) => {
    const response = await api.post('/farms', data);
    return response.data;
};

/** Xem chi tiết 1 nông hộ */
export const apiGetFarm = async (id) => {
    const response = await api.get(`/farms/${id}`);
    return response.data;
};

/** Cập nhật nông hộ */
export const apiUpdateFarm = async (id, data) => {
    const response = await api.patch(`/farms/${id}`, data);
    return response.data;
};

/** Xóa nông hộ */
export const apiDeleteFarm = async (id) => {
    const response = await api.delete(`/farms/${id}`);
    return response.data;
};

/** Lấy tất cả nông hộ (ADMIN) */
export const apiGetAllFarms = async () => {
    const response = await api.get('/farms/all');
    return response.data;
};
