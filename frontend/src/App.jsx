import './App.css'

import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'

function App() {
  return (
    <div className="app">
      <Header />

      <main className="main">
        <HomePage />
      </main>

      <Footer />
    </div>
  )
}

export default App