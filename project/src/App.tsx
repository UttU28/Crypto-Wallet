import { Routes, Route } from 'react-router-dom';
import { AuthLayout } from './components/layouts/AuthLayout';
import { ProtectedLayout } from './components/layouts/ProtectedLayout';
import { SignupPage } from './pages/auth/SignupPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { WalletPage } from './pages/wallet/WalletPage';
import { HomePage } from './pages/HomePage';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wallet" element={<WalletPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
