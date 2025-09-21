
import React, { useState } from 'react';
import { User, UserRole, OfficialDesignation, IssueDepartment, Citizen, Official } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loginType, setLoginType] = useState<UserRole>(UserRole.CITIZEN);

  // Citizen state
  const [citizenEmail, setCitizenEmail] = useState('user@demo.com');
  const [citizenPassword, setCitizenPassword] = useState('password123');
  
  // Official state
  const [officialName, setOfficialName] = useState('Mr. Ward Officer');
  const [officialEmail, setOfficialEmail] = useState('ward.road@visakha.gov');
  const [officialDesignation, setOfficialDesignation] = useState<OfficialDesignation>(OfficialDesignation.WARD);
  const [officialDepartment, setOfficialDepartment] = useState<IssueDepartment>(IssueDepartment.ROAD);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginType === UserRole.CITIZEN) {
      if (citizenEmail === 'user@demo.com' && citizenPassword === 'password123') {
        const citizenUser: Citizen = { role: UserRole.CITIZEN, email: citizenEmail, name: 'Demo User' };
        onLogin(citizenUser);
      } else {
        alert('Invalid citizen credentials.');
      }
    } else {
      if (officialName && officialEmail) {
         const officialUser: Official = {
           role: UserRole.OFFICIAL,
           name: officialName,
           email: officialEmail,
           designation: officialDesignation,
           department: officialDepartment,
         };
         onLogin(officialUser);
      } else {
        alert('Please fill all official fields.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600">🏛️ Civic Reporter</h1>
          <p className="text-gray-500 mt-2">Report issues, make a difference</p>
        </div>

        <div className="flex justify-center bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setLoginType(UserRole.CITIZEN)}
            className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${loginType === UserRole.CITIZEN ? 'bg-blue-600 text-white shadow' : 'text-gray-600'}`}
          >
            Citizen Login
          </button>
          <button
            onClick={() => setLoginType(UserRole.OFFICIAL)}
            className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${loginType === UserRole.OFFICIAL ? 'bg-slate-700 text-white shadow' : 'text-gray-600'}`}
          >
            Official Login
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {loginType === UserRole.CITIZEN ? (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={citizenEmail} onChange={e => setCitizenEmail(e.target.value)} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input type="password" value={citizenPassword} onChange={e => setCitizenPassword(e.target.value)} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input type="text" value={officialName} onChange={e => setOfficialName(e.target.value)} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={officialEmail} onChange={e => setOfficialEmail(e.target.value)} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Designation</label>
                <select value={officialDesignation} onChange={e => setOfficialDesignation(e.target.value as OfficialDesignation)} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500">
                  {Object.values(OfficialDesignation).map(d => <option key={d} value={d}>{d} Level</option>)}
                </select>
              </div>
               <div>
                <label className="text-sm font-medium text-gray-700">Department</label>
                <select value={officialDepartment} onChange={e => setOfficialDepartment(e.target.value as IssueDepartment)} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500">
                  {Object.values(IssueDepartment).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </>
          )}
          <button type="submit" className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 ${loginType === UserRole.CITIZEN ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 hover:bg-slate-800'}`}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
