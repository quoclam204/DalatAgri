import './App.css'

import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app">
      <Header />

      <main className="main container">
        <h1>Chào mừng đến với DalatAgri 🌿</h1>
        <p>Quản lý nông trại và nhật ký canh tác.</p>
      </main>

      <Footer />
    </div>
  )
}

export default App