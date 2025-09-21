
import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import CitizenDashboard from './components/CitizenDashboard';
import OfficialDashboard from './components/OfficialDashboard';
import { User, UserRole, Issue } from './types';
import { INITIAL_ISSUES } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addIssue = useCallback((newIssue: Issue) => {
    setIssues(prevIssues => [newIssue, ...prevIssues]);
  }, []);

  const updateIssue = useCallback((updatedIssue: Issue) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => issue.id === updatedIssue.id ? updatedIssue : issue)
    );
  }, []);
  
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentUser.role === UserRole.CITIZEN) {
    return <CitizenDashboard user={currentUser} onLogout={handleLogout} issues={issues} addIssue={addIssue} updateIssue={updateIssue} />;
  }
  
  if (currentUser.role === UserRole.OFFICIAL) {
    return <OfficialDashboard user={currentUser} onLogout={handleLogout} issues={issues} setIssues={setIssues} />;
  }

  return null;
};

export default App;
