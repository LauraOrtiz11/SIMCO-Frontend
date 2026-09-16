import { Routes, Route, Navigate } from 'react-router-dom';
import UsersPage from '@/features/users/pages/UsersPage';
import GreenhousesPage from '@/features/greenhouses/pages/GreenhousesPage';
import ClientsPage from '@/features/clients/pages/ClientsPage';
import PilesPage from '@/features/piles/pages/PilesPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/users" />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/greenhouses" element={<GreenhousesPage />} />
      <Route path="/clients" element={<ClientsPage />} />
      <Route path="/piles" element={<PilesPage />} />
    </Routes>
  );
}

export default App;
