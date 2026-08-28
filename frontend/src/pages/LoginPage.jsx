import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiLogin } from '../services/api';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // TODO: Gọi apiLogin, lấy access_token và user từ response
            // Gọi login() từ AuthContext
            // navigate về '/'
            const res = await apiLogin({ email, password });
            login(res.access_token, res.user);
            navigate('/');
        } catch (err) {
            // TODO: Lấy message lỗi từ err.response?.data?.message
            // Gán vào setError
            setError(err.response?.data?.message || 'Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Đăng Nhập</h1>
            <form onSubmit={handleSubmit}>
                {/* TODO: Input email, password, nút submit */}
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit" disabled={loading}>Đăng nhập</button>
                {/* Hiển thị error nếu có */}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <Link to="/register">Chưa có tài khoản? Đăng ký</Link>
        </div>
    );
}

export default LoginPage;
