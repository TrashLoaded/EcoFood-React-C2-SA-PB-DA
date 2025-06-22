import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedByRole from "./ProtectedByRole";
import AdminLayout from "../components/layouts/Admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductos from "../pages/admin/AdminProductos";
import AdminUsuarios from "../pages/admin/AdminUsuarios";
import AdminAdministradores from "../pages/admin/AdminAdministradores";
import AdminEmpresas from "../pages/admin/AdminEmpresas";
import AdminClientes from "../pages/admin/AdminClientes";
import { Navigate } from "react-router-dom";
import ResetPassword from "../pages/ResetPassword";
import NotFound from "../pages/NotFound";
import PerfilEmpresa from "../pages/empresa/PerfilEmpresa";
import ProductosEmpresa from "../pages/empresa/ProductosEmpresa";
import HomeCliente from "../pages/cliente/HomeCliente";
import VerProductos from "../pages/cliente/VerProductos";
import MisPedidos from "../pages/cliente/MisPedidos";
import EditarPerfil from "../pages/cliente/EditarPerfil";
import PedidosEmpresa from "../pages/empresa/PedidosEmpresa";

export default function AppRouter() {
  return (
    <Routes>
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
        path="/cliente/home"
        element={
          <ProtectedByRole allowed={["cliente"]}>
            <HomeCliente />
          </ProtectedByRole>
        }
      />
      <Route
        path="/cliente/productos"
        element={
          <ProtectedByRole allowed={["cliente"]}>
            <VerProductos />
          </ProtectedByRole>
        }
      />
      <Route
        path="/cliente/pedidos"
        element={
          <ProtectedByRole allowed={["cliente"]}>
            <MisPedidos />
          </ProtectedByRole>
        }
      />
      <Route
        path="/cliente/perfil"
        element={
          <ProtectedByRole allowed={["cliente"]}>
            <EditarPerfil />
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

      <Route
        path="/empresa/perfil"
        element={
          <ProtectedByRole allowed={["empresa"]}>
            <PerfilEmpresa />
          </ProtectedByRole>
        }
      />
      <Route
        path="/empresa/productos"
        element={
          <ProtectedByRole allowed={["empresa"]}>
            <ProductosEmpresa />
          </ProtectedByRole>
        }
      />
      <Route
        path="/empresa/pedidos"
        element={
          <ProtectedByRole allowed={["empresa"]}>
            <PedidosEmpresa />
          </ProtectedByRole>
        }
      />


      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
