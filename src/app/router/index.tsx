import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "../../pages/dashboard/dashboard-page";
import LoginPage from "../../pages/auth/login-page";
import TablePage from "../../pages/count/table";
import RegistryPage from "../../pages/registery/register";
import Globe from "../../pages/globe/Globe";
import Province from "../../pages/province/province";
import ProtectedRoute from "./protected-route";

import RegistryIdPage from "../../pages/registery/registerId";
import { useCurrentUser } from "../../shared/hooks/use-current-user";
import InspectionDetailPage from "../../pages/count/inspection-detail";


import CamerasPage from "../../pages/camera/cameras-page";
import CameraLivePage from "../../pages/camera/camera-live-page";

export default function AppRouter() {
  const { isAuthenticated } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/count"
          element={
            <ProtectedRoute>
              <TablePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inspection/:attendanceTimeId"
          element={
            <ProtectedRoute>
              <InspectionDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registry"
          element={
            <ProtectedRoute>
              <RegistryPage />
            </ProtectedRoute>
          }
        />

        <Route path="/camera/:cameraId" element={<CameraLivePage />} />
        <Route path="/camera" element={<CamerasPage />} />
        <Route
          path="/registry/:id"
          element={
            <ProtectedRoute>
              <RegistryIdPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/region/:regionId"
          element={
            <ProtectedRoute>
              <Globe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/region/:regionId/:provinceId"
          element={
            <ProtectedRoute>
              <Province />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}