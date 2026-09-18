import { Routes, Route, Navigate } from 'react-router-dom';
import UsersPage from '@/features/users/pages/UsersPage';
import GreenhousesPage from '@/features/greenhouses/pages/GreenhousesPage';
import { LoginForm } from './features/auth/components/LoginForm';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={<Navigate to="/users" />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/greenhouses" element={<GreenhousesPage />} />
    </Routes>
  );
}

export default App;
