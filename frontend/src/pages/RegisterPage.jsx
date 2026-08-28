import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRegister } from '../services/api';

function RegisterPage() {
    const [fullName, setFullName] = useState('');
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
            const res = await apiRegister({ fullName, email, password });
            login(res.access_token, res.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Đăng Ký</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Họ và tên"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu"
                />
                <button type="submit" disabled={loading}>Đăng ký</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
        </div>
    );
}

export default RegisterPage;
