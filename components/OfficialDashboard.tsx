
import React, { useState, useMemo, useCallback } from 'react';
import { Official, Issue, Flag, OfficialDesignation } from '../types';
import { HIERARCHY } from '../constants';
import MapComponent from './MapComponent';

// Icons
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293A1 1 0 0016 6v10a1 1 0 00.293.707L20 20.414V7.586L17.707 5.293z" clipRule="evenodd" /></svg>;


type OfficialPage = 'dashboard' | 'map';

interface DashboardProps {
  user: Official;
  onLogout: () => void;
  issues: Issue[];
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
}

interface NavItemProps {
  label: string;
  page: OfficialPage;
  activePage: OfficialPage;
  setPage: (page: OfficialPage) => void;
  icon: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ label, page, activePage, setPage, icon }) => (
  <li>
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); setPage(page); }}
      className={`flex items-center px-6 py-3 text-gray-600 hover:bg-slate-700 hover:text-white transition-colors duration-200 ${activePage === page ? 'bg-slate-700 text-white' : ''}`}
    >
      {icon} {label}
    </a>
  </li>
);

const runDailyChecks = (issues: Issue[]): Issue[] => {
    const now = new Date();
    return issues.map(issue => {
        if (issue.status !== 'Resolved' && now > issue.dueDate) {
            const currentHierarchyIndex = HIERARCHY.indexOf(issue.currentLevel);
            if (currentHierarchyIndex < HIERARCHY.length - 1) {
                const nextLevel = HIERARCHY[currentHierarchyIndex + 1];
                return {
                    ...issue,
                    flag: Flag.RED,
                    status: `Auto-Escalated (Overdue) to ${nextLevel}`,
                    currentLevel: nextLevel,
                    dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
                };
            }
        }
        return issue;
    });
};

const DashboardPage: React.FC<{
    issues: Issue[], 
    user: Official,
    onMarkResolved: (id: string) => void,
    onFlag: (id: string, reason: string) => void,
    onEscalate: (id: string, reason: string) => void
}> = ({ issues, user, onMarkResolved, onFlag, onEscalate }) => {
    
    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Department Issues</h1>
            <p className="text-gray-600 mb-6">Showing issues for: {user.department} Department</p>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                 <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Flag</th>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Due Date</th>
                            <th scope="col" className="px-6 py-3">Location</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-8 text-gray-500">No issues in your department at this time.</td></tr>
                        ) : issues.map(issue => {
                            const userLevelIndex = HIERARCHY.indexOf(user.designation);
                            const issueLevelIndex = HIERARCHY.indexOf(issue.currentLevel);
                            let actions = <span className="text-xs text-gray-400">No action required.</span>;
                            if (issue.status === 'Resolved') {
                                actions = <span className="text-xs text-green-600 font-semibold">Completed</span>
                            } else if (issue.currentLevel === user.designation && issueLevelIndex <= userLevelIndex) {
                                actions = (
                                    <div className="flex flex-wrap gap-1">
                                        <button onClick={() => onMarkResolved(issue.id)} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Resolve</button>
                                        <button onClick={() => onFlag(issue.id, 'Time')} className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Time Esc.</button>
                                        <button onClick={() => onFlag(issue.id, 'Budget')} className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Budget Esc.</button>
                                        {user.designation !== OfficialDesignation.IAS && (
                                            <button onClick={() => onEscalate(issue.id, 'Not Possible')} className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Escalate</button>
                                        )}
                                    </div>
                                );
                            }
                            
                            return (
                               <tr key={issue.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-xl">{issue.flag === Flag.RED ? '🚩' : issue.flag === Flag.GREEN ? '✅' : '⚪'}</td>
                                    <td className="px-6 py-4 font-mono text-gray-800">{issue.id}</td>
                                    <td className="px-6 py-4">{issue.dueDate.toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{issue.location}</td>
                                    <td className="px-6 py-4">{issue.status}</td>
                                    <td className="px-6 py-4">{actions}</td>
                               </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const MapPage: React.FC<{ issues: Issue[] }> = ({ issues }) => {
    const unresolvedIssues = useMemo(() => issues.filter(issue => issue.status !== 'Resolved'), [issues]);
    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Unresolved Issues Map</h1>
            <MapComponent issues={unresolvedIssues} />
        </div>
    );
};


const OfficialDashboard: React.FC<DashboardProps> = ({ user, onLogout, issues, setIssues }) => {
  const [activePage, setActivePage] = useState<OfficialPage>('dashboard');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const processedIssues = useMemo(() => runDailyChecks(issues), [issues]);

  const filteredIssues = useMemo(() => {
    return processedIssues.filter(issue => {
        if (user.department !== issue.department) return false;
        if (user.designation === OfficialDesignation.IAS) return true;

        const userLevelIndex = HIERARCHY.indexOf(user.designation);
        const issueLevelIndex = HIERARCHY.indexOf(issue.currentLevel);
        return issueLevelIndex <= userLevelIndex;
    });
  }, [processedIssues, user.designation, user.department]);

  const updateIssue = useCallback((updatedIssue: Issue) => {
    setIssues(prev => prev.map(i => i.id === updatedIssue.id ? updatedIssue : i));
  }, [setIssues]);

  const markAsResolved = (issueId: string) => {
      const issue = issues.find(i => i.id === issueId);
      if(issue) {
          updateIssue({...issue, status: 'Resolved', flag: Flag.GREEN});
          alert(`Issue ${issueId} marked as Resolved.`);
      }
  };

  const flagForEscalation = (issueId: string, reason: string) => {
      const issue = issues.find(i => i.id === issueId);
      if(issue) {
          updateIssue({...issue, status: `Flagged for ${reason} Escalation at ${user.designation}`});
      }
  };

  const escalateNow = (issueId: string, reason: string) => {
      const issue = issues.find(i => i.id === issueId);
      if (issue) {
          const currentHierarchyIndex = HIERARCHY.indexOf(issue.currentLevel);
          if (currentHierarchyIndex < HIERARCHY.length - 1) {
              const nextLevel = HIERARCHY[currentHierarchyIndex + 1];
              updateIssue({
                  ...issue,
                  currentLevel: nextLevel,
                  status: `${reason} from ${user.designation}`,
                  flag: Flag.RED,
                  dueDate: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000),
              });
              alert(`Issue ${issueId} escalated to ${nextLevel}.`);
          }
      }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage issues={filteredIssues} user={user} onMarkResolved={markAsResolved} onFlag={flagForEscalation} onEscalate={escalateNow} />;
      case 'map':
        return <MapPage issues={filteredIssues} />;
      default:
        return <DashboardPage issues={filteredIssues} user={user} onMarkResolved={markAsResolved} onFlag={flagForEscalation} onEscalate={escalateNow} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 text-2xl font-bold text-slate-700">🏛️ Official Portal</div>
        <nav>
          <ul>
            <NavItem label="Dashboard" page="dashboard" activePage={activePage} setPage={setActivePage} icon={<DashboardIcon />}/>
            <NavItem label="Map View" page="map" activePage={activePage} setPage={setActivePage} icon={<MapIcon />}/>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b">
          <div></div>
          <div className="relative">
            <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="w-10 h-10 bg-slate-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-10 p-2">
                <div className="px-2 py-2 border-b">
                    <p className="font-bold text-sm text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.designation} - {user.department}</p>
                </div>
                <a href="#" onClick={onLogout} className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md">Sign Out</a>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto">{renderPage()}</main>
      </div>
    </div>
  );
};

export default OfficialDashboard;
