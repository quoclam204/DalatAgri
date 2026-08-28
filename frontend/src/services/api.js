import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// gọi API đăng ký tài khoản
export const apiRegister = async (data) => {
    const response = await axios.post(`${BASE_URL}/auth/register`, data);
    return response.data;
};

// gọi API đăng nhập tài khoản
export const apiLogin = async (data) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, data);
    return response.data;
};
