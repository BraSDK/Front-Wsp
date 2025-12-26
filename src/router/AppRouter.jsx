import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Usuarios from "../pages/Usuarios";
import Empresas from "../pages/Empresas";
import Campanas from "../pages/Campanas";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas públicas */}
        {/*<Route path="/" element={<Home />} />*/}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas (con sidebar y header) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Usuarios />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/campanas"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Campanas />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/empresas"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Empresas />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
