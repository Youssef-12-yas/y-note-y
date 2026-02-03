import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { OnboardingScreen } from './components/Onboarding/OnboardingScreen';
import { AuthPage } from './components/Auth/AuthPage';
import { MainLayout } from './components/Layout/MainLayout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { GroupsPage } from './components/Groups/GroupsPage';
import { GroupDetail } from './components/Groups/GroupDetail';
import { NoteEditor } from './components/Notes/NoteEditor';
import { AIReviewPage } from './components/AIReview/AIReviewPage';
import { SettingsPage } from './components/Settings/SettingsPage';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    return localStorage.getItem('ynote-onboarding') === 'complete';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('ynote-auth') === 'true';
  });

  const handleOnboardingComplete = () => {
    localStorage.setItem('ynote-onboarding', 'complete');
    setHasSeenOnboarding(true);
  };

  const handleAuthSuccess = () => {
    localStorage.setItem('ynote-auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('ynote-auth');
    setIsAuthenticated(false);
  };

  // Show onboarding first
  if (!hasSeenOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route 
              path="/auth" 
              element={
                isAuthenticated 
                  ? <Navigate to="/dashboard" replace /> 
                  : <AuthPage onSuccess={handleAuthSuccess} />
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated 
                  ? <MainLayout onLogout={handleLogout}><Dashboard /></MainLayout>
                  : <Navigate to="/auth" replace />
              } 
            />
            <Route 
              path="/groups" 
              element={
                isAuthenticated 
                  ? <MainLayout onLogout={handleLogout}><GroupsPage /></MainLayout>
                  : <Navigate to="/auth" replace />
              } 
            />
            <Route 
              path="/groups/:groupId" 
              element={
                isAuthenticated 
                  ? <MainLayout onLogout={handleLogout}><GroupDetail /></MainLayout>
                  : <Navigate to="/auth" replace />
              } 
            />
            <Route 
              path="/notes/:noteId" 
              element={
                isAuthenticated 
                  ? <MainLayout onLogout={handleLogout}><NoteEditor /></MainLayout>
                  : <Navigate to="/auth" replace />
              } 
            />
            <Route 
              path="/ai-review" 
              element={
                isAuthenticated 
                  ? <MainLayout onLogout={handleLogout}><AIReviewPage /></MainLayout>
                  : <Navigate to="/auth" replace />
              } 
            />
            <Route 
              path="/settings" 
              element={
                isAuthenticated 
                  ? <MainLayout onLogout={handleLogout}><SettingsPage /></MainLayout>
                  : <Navigate to="/auth" replace />
              } 
            />
            
            {/* Index redirects */}
            <Route 
              path="/" 
              element={
                isAuthenticated 
                  ? <Navigate to="/dashboard" replace />
                  : <Navigate to="/auth" replace />
              } 
            />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;