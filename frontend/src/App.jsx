import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([]);

  // Gọi API đến Backend NestJS khi trang web vừa tải xong
  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
      })
      .catch(error => console.error("Lỗi khi gọi API:", error));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chào mừng đến với DalatAgri 🌿</h1>
      <p>Danh sách người dùng từ Database:</p>

      {users.length === 0 ? (
        <p><i>Chưa có người dùng nào.</i></p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.fullName} - {user.email}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
