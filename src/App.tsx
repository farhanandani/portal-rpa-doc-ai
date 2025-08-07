import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import Classification from "./components/LandingPage/module/Classification";
import Extraction from "./components/LandingPage/module/Extraction";
import Verification from "./components/LandingPage/module/Verification";
import AuditTrail from "./components/LandingPage/module/AuditTrail";
import ApiIntegration from "./components/LandingPage/module/ApiIntegration";
import DetailAuditTrail from "./components/LandingPage/module/AuditTrail/DetailAuditTrail";

function App() {
  return (
    <AuthProvider>
      <div className="h-full w-full">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/landing-page"
            element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<Classification />} />
            <Route path="classification" element={<Classification />} />
            <Route path="extraction" element={<Extraction />} />
            <Route path="verification" element={<Verification />} />
            <Route path="audit-trail" element={<AuditTrail />} />
            <Route path="audit-trail/:id" element={<DetailAuditTrail />} />
            <Route path="api-integration" element={<ApiIntegration />} />
          </Route>
          {/* Catch all route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
