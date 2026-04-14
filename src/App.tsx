import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import LandingPage from "@/pages/LandingPage";
import LanguageSelect from "@/pages/LanguageSelect";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import ProfilePage from "@/pages/ProfilePage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

/* ── Fade-in / fade-out page transition ── */
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [content, setContent] = useState(children);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => {
      setContent(children);
      setVisible(true);
    }, 200);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 200ms ease, transform 200ms ease',
      minHeight: '100vh',
    }}>
      {content}
    </div>
  );
}

function AppRoutes() {
  const { user, isAdmin } = useAuth();

  return (
    <PageTransition>
      <Routes>
       
        <Route path="/" element={<LandingPage />} />

       
        <Route path="/language" element={<LanguageSelect />} />

        
        <Route path="/login" element={user ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />

       
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />

       
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
