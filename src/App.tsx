import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Eagerly loaded: lightweight pages that are needed immediately.
import Home from "./pages/home/Home";

// Lazily loaded: heavy pages that only load when the user navigates to them.
// BuildResume (3144 lines) and AnalyzeResume (1057 lines) were the two largest contributors
// to the 622 KB monolithic bundle. With code splitting they load on-demand only.
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const BuildResume = lazy(() => import("./pages/build-resume/BuildResume"));
const AnalyzeResume = lazy(() => import("./pages/analyze-resume/AnalyzeResume"));
const PublicResume = lazy(() => import("./pages/PublicResume"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Featuressection = lazy(() => import("./pages/featuressection/Featuressection"));

// Minimal inline spinner shown during lazy-chunk loading.
// Matches the same visual style as ProtectedRoute's loading state (slate-900 bg, indigo spinner).
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Featuressection />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/public/resume/:shareToken" element={<PublicResume />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/build-resume"
              element={
                <ProtectedRoute>
                  <BuildResume />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analyze-resume"
              element={
                <ProtectedRoute>
                  <AnalyzeResume />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
