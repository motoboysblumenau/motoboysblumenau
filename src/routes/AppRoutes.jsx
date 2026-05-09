import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import AdminDashboard from '../pages/AdminDashboard';
import AdminLogin from '../pages/AdminLogin';
import Home from '../pages/Home';
import MotoboySignup from '../pages/MotoboySignup';
import NotFound from '../pages/NotFound';
import Quote from '../pages/Quote';
import Terms from '../pages/Terms';
import Tracking from '../pages/Tracking';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/orcamento" element={<Quote />} />
        <Route path="/rastreio" element={<Tracking />} />
        <Route path="/cadastro-motoboy" element={<MotoboySignup />} />
        <Route path="/termos" element={<Terms />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
