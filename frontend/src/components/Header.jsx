<<<<<<< HEAD
function Header({ user, onLogin, onLogout }) {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <img src="/logo.png" className="logo-img" />
          DalatAgri
        </div>

        <nav className="nav">
          <a href="/">Trang chủ</a>
          <a href="/farms">Nông trại</a>
          <a href="/crops">Cây trồng</a>
          <a href="/logs">Nhật ký</a>
        </nav>

        <button className="login-btn" onClick={user ? onLogout : onLogin}>
          {user ? `${user.fullName} · Đăng xuất` : "Đăng nhập"}
        </button>
      </div>
    </header>
  );
}

export default Header;
=======
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="container header-container">
                <div className="logo">
                    <img src="/logo.png" className="logo-img" />
                    DalatAgri
                </div>

                <nav className="nav">
                    <Link to="/">Trang chủ</Link>
                    <Link to="/farms">Nông trại</Link>
                    <Link to="/crops">Cây trồng</Link>
                    <Link to="/logs">Nhật ký</Link>
                </nav>

                {token ? (
                    <div className="header-user">
                        <span className="user-greeting">
                            👋 {user?.fullName || user?.email || 'Người dùng'}
                        </span>
                        <button className="logout-btn" onClick={handleLogout}>
                            Đăng xuất
                        </button>
                    </div>
                ) : (
                    <div className="header-auth">
                        <Link to="/login" className="login-btn">Đăng nhập</Link>
                        <Link to="/register" className="register-btn">Đăng ký</Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
>>>>>>> origin/main
