import React, { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import type { User } from "./types";
import "./App.css";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>("home");

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("home");
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  // Navigation simple basée sur l'état
  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  switch (currentPage) {
    case "login":
      return <Login onLogin={handleLogin} onNavigate={navigateTo} />;
    case "signup":
      return <Signup onLogin={handleLogin} onNavigate={navigateTo} />;
    default:
      return <Home onNavigate={navigateTo} />;
  }
}

export default App;
