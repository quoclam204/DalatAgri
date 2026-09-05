import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AccountPage from "./pages/AccountPage";
import FarmsPage from "./pages/FarmsPage";
import FarmDetailPage from "./pages/FarmDetailPage";
import WorkspacePage from "./pages/WorkspacePage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/crops" element={<FarmsPage />} />
            <Route path="/farms/:id" element={<FarmDetailPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<WorkspacePage view="dashboard" />} />
              <Route path="/journal" element={<WorkspacePage view="journal" />} />
              <Route path="/inventory" element={<WorkspacePage view="inventory" />} />
              <Route path="/finance" element={<WorkspacePage view="finance" />} />
              <Route path="/revenue" element={<WorkspacePage view="revenue" />} />
              <Route path="/ocr" element={<WorkspacePage view="ocr" />} />
              <Route path="/help" element={<WorkspacePage view="help" />} />
              <Route path="/account" element={<AccountPage />} />
            </Route>
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
