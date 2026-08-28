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

        {onLogin || onLogout ? (
          <button className="login-btn" onClick={user ? onLogout : onLogin}>
            {user ? `${user.fullName} · Đăng xuất` : "Đăng nhập"}
          </button>
        ) : (
          <div className="header-auth">
            <a className="login-btn" href="/login">Đăng nhập</a>
            <a className="register-btn" href="/register">Đăng ký</a>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
