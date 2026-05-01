import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import PageLoader from "../components/layout/PageLoader";

const Dashboard = lazy(() => import("../pages/Dashboard"));

function AppRoutes({ theme, onToggleTheme }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/"
          element={<Dashboard theme={theme} onToggleTheme={onToggleTheme} />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard theme={theme} onToggleTheme={onToggleTheme} />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
