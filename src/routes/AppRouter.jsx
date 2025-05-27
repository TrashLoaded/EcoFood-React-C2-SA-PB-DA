import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/home";
import ProtectedRoute from "./ProtectedRoute";
<<<<<<< HEAD
import ProtectedByRole from "./ProtectedByRole";
import ClienteDashboard from "../pages/cliente/ClienteDashboard";
import AdminLayout from "../components/layouts/Admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductos from "../pages/admin/AdminProductos";
import AdminUsuarios from "../pages/admin/AdminUsuarios";
import AdminAdministradores from "../pages/admin/AdminAdministradores";
import AdminEmpresas from "../pages/admin/AdminEmpresas";
import AdminClientes from "../pages/admin/AdminClientes";
=======
import RecuperarContraseña from "../pages/RecuperarContraseña";
import ProtectedByRole from "./ProtectedByRole";

//CLiente
import ClienteDashboard from '../pages/cliente/ClienteDashboard';
//Admin
import AdminLayout from '../components/admin/layout/AdminLayout';
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductos from '../pages/admin/AdminProductos';
import AdminUsuarios from '../pages/admin/AdminUsuarios';
>>>>>>> 710f25fde4e17dbdb3b7e18c7e2a86b38a7797e2

export default function AppRouter() {
  return (
    <Routes>
<<<<<<< HEAD
      <Route path="/" element={<Navigate to="/registro" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar" element={<ResetPassword />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cliente/dashboard"
        element={
          <ProtectedByRole allowed={["cliente"]}>
            <ClienteDashboard />
          </ProtectedByRole>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedByRole allowed={["admin"]}>
            <AdminLayout />
          </ProtectedByRole>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="empresas" element={<AdminEmpresas />} />
        <Route path="administradores" element={<AdminAdministradores />} />
        <Route path="clientes" element={<AdminClientes />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
=======
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Login />} />
    <Route path="/recuperar" element={<RecuperarContraseña />} />
    <Route path="/registro" element={<Register />} />
    <Route path="/home" element={
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    } />
    
    <Route path="/cliente/dashboard" element={
      <ProtectedByRole allowed={["cliente"]}>
        <ClienteDashboard />
      </ProtectedByRole>
    } />
    
    <Route path="/admin" element={
      <ProtectedByRole allowed={["admin"]}>
        <AdminLayout />
      </ProtectedByRole>
    }>
      <Route path="productos" element={<AdminProductos />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="usuarios" element={<AdminUsuarios />} />
    </Route>
  </Routes>
 );
>>>>>>> 710f25fde4e17dbdb3b7e18c7e2a86b38a7797e2
}
