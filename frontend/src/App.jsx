import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import KanbanBoard from "./components/board/KanbanBoard";
import LandingPage from "./components/landing/LandingPage";
import SplashScreen from "./components/loading/SplashScreen";

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [authReady, setAuthReady] = useState(false); // auth check done?
  const [splashDone, setSplashDone] = useState(false); // splash animation done?

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("kanban_token");
      if (token) {
        try {
          const baseUrl = import.meta.env.VITE_API_URL || '';
          const res = await fetch(`${baseUrl}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            localStorage.removeItem("kanban_token");
          }
        } catch (err) {
          console.error("Auth check failed", err);
        }
      }
      setAuthReady(true); // auth is done, but splash may still be animating
    };
    checkAuth();
  }, []);

  const signIn = (token, userData) => {
    localStorage.setItem("kanban_token", token);
    setUser(userData);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("kanban_token");
  };

  // Show splash until BOTH auth is done AND splash animation has finished
  if (!splashDone) {
    return (
      <SplashScreen
        onDone={() => setSplashDone(true)}
      />
    );
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <KanbanBoard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
