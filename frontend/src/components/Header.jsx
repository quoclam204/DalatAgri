import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <img src="/logo.png" className="logo-img" alt="Farm-Farmer logo" />
          Farm-Farmer
        </Link>

        <nav className="nav">
          <Link to="/">Trang chủ</Link>
          <Link to="/crops">Cây trồng</Link>
          <Link to="/activity-logs">Nhật ký</Link>
        </nav>

        <div className="header-auth">
          {user ? (
            <>
              <Link
                to="/account"
                className="user-menu-btn"
                title="Tài khoản của tôi"
              >
                <span className="user-avatar-hdr">
                  {user.fullName?.charAt(0)?.toUpperCase()}
                </span>
                <span className="user-name-hdr">{user.fullName}</span>
              </Link>
              <button className="logout-btn-hdr" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link className="login-btn" to="/login">
                Đăng nhập
              </Link>
              <Link className="register-btn" to="/register">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
