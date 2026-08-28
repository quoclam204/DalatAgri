import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // TODO 1: Khi app load lần đầu, đọc token và user từ localStorage
  //         Gợi ý: dùng useEffect + JSON.parse(localStorage.getItem('user'))
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  const login = (newToken, userData) => {
    // TODO 2: Lưu newToken và userData vào state
    //         Đồng thời lưu vào localStorage để giữ đăng nhập khi refresh
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    // TODO 3: Xóa state và xóa localStorage
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
