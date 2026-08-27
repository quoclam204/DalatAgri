function Header() {
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

                <button className="login-btn">
                    Đăng nhập
                </button>
            </div>
        </header>
    )
}

export default Header