import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { PizzaBuilderProvider } from './context/PizzaBuilderContext';

import Navbar from "./components/Navbar";
import Footer from './components/layout/Footer';
import PrivateRoute from './components/navigation/PrivateRoute';
import AdminRoute from './components/navigation/AdminRoute';

// Customer Pages
import Dashboard from './pages/Dashboard';
import PizzaBuilder from './pages/PizzaBuilder';
import PizzaDetail from './pages/PizzaDetail';
import ReviewOrder from './pages/ReviewOrder';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInventory from './pages/admin/AdminInventory';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMenuManager from './pages/admin/AdminMenuManager';

const Placeholder = ({ title }) => (
  <div className="container" style={{ padding: 'var(--space-64) 0', textAlign: 'center' }}>
    <h1 className="text-h2 text-muted">{title}</h1>
    <p>This interface will be built in an upcoming category.</p>
  </div>
);

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <PizzaBuilderProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flexGrow: 1 }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/pizza/:id" element={<PizzaDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />
                  
                  {/* Protected Customer Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/builder" element={<PizzaBuilder />} />
                    <Route path="/review" element={<ReviewOrder />} />
                    <Route path="/order/success/:orderId" element={<OrderSuccess />} />
                    <Route path="/track/:orderId" element={<TrackOrder />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />
                    <Route path="/account" element={<Account />} />
                  </Route>

                  {/* Admin Authentication & Protected Console */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route element={<AdminRoute />}>
                    <Route path="/admin/dashboard" element={<AdminMenuManager />} />
                    <Route path="/admin/inventory" element={<AdminInventory />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                  </Route>

                  {/* 404 */}
                  <Route path="*" element={<Placeholder title="404 - Page Not Found" />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </PizzaBuilderProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;