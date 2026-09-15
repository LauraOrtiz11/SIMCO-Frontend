import { Routes, Route, Navigate } from 'react-router-dom';
import UsersPage from '@/features/users/pages/UsersPage';
import GreenhousesPage from '@/features/greenhouses/pages/GreenhousesPage';
import ClientsPage from '@/features/clients/pages/ClientsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/users" />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/greenhouses" element={<GreenhousesPage />} />
      <Route path="/clients" element={<ClientsPage />} />
    </Routes>
  );
}

export default App;
