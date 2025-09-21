
import React, { useState, useCallback, ChangeEvent, useRef } from 'react';
import { Citizen, Issue, IssueDepartment, Flag, OfficialDesignation } from '../types';
import { VIZAG_COORDINATES } from '../constants';
import Modal from './Modal';

// Icons
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const ReportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const TrackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;

type CitizenPage = 'profile' | 'reportIssue' | 'trackIssue';

interface DashboardProps {
  user: Citizen;
  onLogout: () => void;
  issues: Issue[];
  addIssue: (issue: Issue) => void;
  updateIssue: (issue: Issue) => void;
}

interface NavItemProps {
  label: string;
  page: CitizenPage;
  activePage: CitizenPage;
  setPage: (page: CitizenPage) => void;
  icon: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ label, page, activePage, setPage, icon }) => (
  <li>
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); setPage(page); }}
      className={`flex items-center px-6 py-3 text-gray-600 hover:bg-blue-600 hover:text-white transition-colors duration-200 ${activePage === page ? 'bg-blue-600 text-white' : ''}`}
    >
      {icon} {label}
    </a>
  </li>
);

// Child Page Components (defined outside main component to prevent re-creation on re-render)
const ProfilePage = ({ user, issues, viewImage, editIssue, trackIssueFromProfile }: any) => {
    const getSimplifiedStatus = (detailedStatus: string) => {
        const s = detailedStatus.toLowerCase();
        if (s.includes('resolved')) return { text: 'Resolved', className: 'bg-green-100 text-green-800' };
        if (s.includes('new at')) return { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' };
        return { text: 'In Progress', className: 'bg-blue-100 text-blue-800' };
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold text-blue-700 mb-4 border-b pb-2">User Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                    <div><strong>Name:</strong> {user.name}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Member Since:</strong> 2024-01-01</div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-blue-700 mb-4 border-b pb-2">My Reported Issues</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Issue Type</th>
                                <th scope="col" className="px-6 py-3">Location</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issues.map(issue => {
                                const status = getSimplifiedStatus(issue.status);
                                return (
                                <tr key={issue.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{issue.id}</td>
                                    <td className="px-6 py-4">{issue.date}</td>
                                    <td className="px-6 py-4">{issue.issueType}</td>
                                    <td className="px-6 py-4">{issue.location}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>{status.text}</span></td>
                                    <td className="px-6 py-4 flex items-center space-x-2">
                                        <button onClick={() => viewImage(issue)} className="text-blue-600 hover:text-blue-800">View</button>
                                        <button onClick={() => editIssue(issue)} className="text-yellow-600 hover:text-yellow-800">Edit</button>
                                        <button onClick={() => trackIssueFromProfile(issue.id)} className="text-green-600 hover:text-green-800">Track</button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ReportIssuePage = ({ addIssue, setPage }: any) => {
    const [issueType, setIssueType] = useState('');
    const [subIssueType, setSubIssueType] = useState('Pothole');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [geoInfo, setGeoInfo] = useState<{lat: number, lon: number} | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCapturedImage(event.target?.result as string);
            }
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if(videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsCameraOpen(true);
                    getDeviceData();
                }
            } catch (err) {
                alert("Could not access camera.");
            }
        }
    };

    const snapPhoto = () => {
        if(videoRef.current && canvasRef.current){
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
            setCapturedImage(canvas.toDataURL('image/jpeg'));
            closeCamera();
        }
    };
    
    const closeCamera = () => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
        setIsCameraOpen(false);
    };

    const getDeviceData = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => { 
                    const { latitude, longitude } = pos.coords;
                    setGeoInfo({ lat: latitude, lon: longitude });
                    reverseGeocode(latitude, longitude);
                },
                (err) => { console.warn(`ERROR(${err.code}): ${err.message}`); }
            );
        }
    };

    const reverseGeocode = async (lat: number, lon: number) => {
        setAddress("Fetching address...");
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await response.json();
            if (data && data.display_name) {
                setAddress(data.display_name);
                 const area = data.address.suburb || data.address.neighbourhood || data.address.city_district;
                if(area && Object.keys(VIZAG_COORDINATES).includes(area)){
                    setLocation(area);
                }
            } else {
                setAddress("Address not found.");
            }
        } catch (error) {
            setAddress("Could not fetch address.");
        }
    };
    
    const handleSubmit = () => {
        if (!issueType || !location || !description.trim() || !capturedImage) {
            alert('Please fill all fields and provide a photo.');
            return;
        }

        const fullIssueType = issueType === 'Road Issue' ? `Road Issue - ${subIssueType}` : issueType;
        const dept = fullIssueType.includes('Road') ? IssueDepartment.ROAD : (fullIssueType === 'Sanitation' ? IssueDepartment.SANITATION : IssueDepartment.WATER);
        const coords = VIZAG_COORDINATES[location] || { lat: 17.72, lng: 83.3 };
        
        const newIssue: Issue = {
            id: 'user-' + Date.now().toString().slice(-6),
            lat: geoInfo?.lat ?? coords.lat,
            lng: geoInfo?.lon ?? coords.lng,
            date: new Date().toISOString().slice(0, 10),
            issueType: fullIssueType,
            location: `${location} (Details: ${address})`,
            status: 'New at Ward',
            image: capturedImage,
            description: description,
            currentLevel: OfficialDesignation.WARD,
            department: dept,
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            flag: Flag.NONE
        };
        
        addIssue(newIssue);
        alert(`Issue (${newIssue.id}) submitted successfully!`);
        setPage('profile');
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Report a New Issue</h1>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type of Issue</label>
                    <select value={issueType} onChange={e => setIssueType(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="">-- Select --</option>
                        <option value="Sanitation">Sanitation</option>
                        <option value="Road Issue">Road Issue</option>
                        <option value="Water">Water</option>
                    </select>
                </div>
                {issueType === 'Road Issue' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specify Road Issue</label>
                        <select value={subIssueType} onChange={e => setSubIssueType(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                            <option value="Pothole">Pothole</option>
                            <option value="Streetlight">Streetlight</option>
                            <option value="Obstacle">Obstacle</option>
                        </select>
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Photo of Issue</label>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                    <div className="flex space-x-2">
                        <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300">📤 Upload</button>
                        <button onClick={startCamera} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">📸 Camera</button>
                    </div>
                    {capturedImage && <img src={capturedImage} alt="Preview" className="mt-4 rounded-lg max-h-60" />}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Detailed Location</label>
                    <select value={location} onChange={e => setLocation(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="">-- Select Area --</option>
                        {Object.keys(VIZAG_COORDINATES).sort().map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address / Landmark</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                {geoInfo && <div className="text-sm bg-blue-50 p-3 rounded-md text-blue-700">📍 Coordinates: {geoInfo.lat.toFixed(5)}, {geoInfo.lon.toFixed(5)}</div>}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Describe the issue..."></textarea>
                </div>
                <button onClick={handleSubmit} className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 font-semibold">Submit Issue</button>
            </div>
            <Modal isOpen={isCameraOpen} onClose={closeCamera}>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Take Photo</h3>
                <video ref={videoRef} autoPlay className="w-full rounded-lg"></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
                <button onClick={snapPhoto} className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Snap Photo</button>
            </Modal>
        </div>
    );
};

const TrackIssuePage = ({ issues }: any) => {
    const [trackId, setTrackId] = useState('');
    const [trackedIssue, setTrackedIssue] = useState<Issue | null | undefined>(null);

    const handleTrack = () => {
        const foundIssue = issues.find((issue: Issue) => issue.id === trackId);
        setTrackedIssue(foundIssue);
    };

    const getSimpleStatus = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('resolved')) return 'Resolved';
        if (s.includes('new')) return 'Pending';
        return 'In Progress';
    };

    const status = trackedIssue ? getSimpleStatus(trackedIssue.status) : '';
    const isSubmitted = !!trackedIssue;
    const isInProgress = isSubmitted && (status === 'In Progress' || status === 'Resolved');
    const isResolved = isSubmitted && status === 'Resolved';

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Where is my Issue?</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={trackId}
                        onChange={(e) => setTrackId(e.target.value)}
                        placeholder="Enter your Issue ID"
                        className="flex-grow p-2 border border-gray-300 rounded-md"
                    />
                    <button onClick={handleTrack} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Track</button>
                </div>
                
                {trackedIssue === undefined && <p className="mt-4 text-red-600">Invalid Issue ID. Please try again.</p>}
                
                {trackedIssue && (
                    <div className="mt-8 space-y-6">
                        <div className={`flex items-center transition-opacity duration-500 ${isSubmitted ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${isSubmitted ? 'bg-green-500' : 'bg-gray-300'}`}>✓</div>
                            <div className="ml-4">
                                <h4 className="font-semibold text-gray-800">Issue Submitted</h4>
                                <p className="text-sm text-gray-500">Received on {trackedIssue.date} for "{trackedIssue.issueType}".</p>
                            </div>
                        </div>
                        <div className={`flex items-center transition-opacity duration-500 ${isInProgress ? 'opacity-100' : 'opacity-40'}`}>
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${isInProgress ? 'bg-green-500' : 'bg-gray-300'}`}>⚙️</div>
                            <div className="ml-4">
                                <h4 className="font-semibold text-gray-800">Work in Progress</h4>
                                <p className="text-sm text-gray-500">The issue is being addressed by the department.</p>
                            </div>
                        </div>
                        <div className={`flex items-center transition-opacity duration-500 ${isResolved ? 'opacity-100' : 'opacity-40'}`}>
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${isResolved ? 'bg-green-500' : 'bg-gray-300'}`}>🏁</div>
                            <div className="ml-4">
                                <h4 className="font-semibold text-gray-800">Resolved</h4>
                                <p className="text-sm text-gray-500">The issue has been marked as resolved.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


const CitizenDashboard: React.FC<DashboardProps> = ({ user, onLogout, issues, addIssue, updateIssue }) => {
  const [activePage, setActivePage] = useState<CitizenPage>('profile');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  
  const [imageModalData, setImageModalData] = useState<Issue | null>(null);
  const [editModalData, setEditModalData] = useState<Issue | null>(null);

  const viewImage = (issue: Issue) => setImageModalData(issue);
  const editIssue = (issue: Issue) => setEditModalData(issue);

  const trackIssueFromProfile = (issueId: string) => {
      setActivePage('trackIssue');
      // This is a bit of a hack to pass the ID. In a real app, use URL routing or state management.
      setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>('#trackIssueIdInput');
        if(input) {
            input.value = issueId;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            document.querySelector<HTMLButtonElement>('#trackButton')?.click();
        }
      }, 0);
  };
  
  const handleSaveChanges = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(editModalData) {
        updateIssue(editModalData);
        setEditModalData(null);
        alert('Issue updated successfully!');
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'profile':
        return <ProfilePage user={user} issues={issues} viewImage={viewImage} editIssue={editIssue} trackIssueFromProfile={trackIssueFromProfile} />;
      case 'reportIssue':
        return <ReportIssuePage addIssue={addIssue} setPage={setActivePage} />;
      case 'trackIssue':
        return <TrackIssuePage issues={issues} />;
      default:
        return <ProfilePage user={user} issues={issues} viewImage={viewImage} editIssue={editIssue} trackIssueFromProfile={trackIssueFromProfile} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 text-2xl font-bold text-blue-600">🏛️ Civic Reporter</div>
        <nav>
          <ul>
            <NavItem label="Profile" page="profile" activePage={activePage} setPage={setActivePage} icon={<ProfileIcon />} />
            <NavItem label="Report an Issue" page="reportIssue" activePage={activePage} setPage={setActivePage} icon={<ReportIcon />} />
            <NavItem label="Track Issue" page="trackIssue" activePage={activePage} setPage={setActivePage} icon={<TrackIcon />} />
          </ul>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b">
          <div>{/* Can add hamburger for mobile */}</div>
          <div className="relative">
            <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10">
                <a href="#" onClick={onLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign Out</a>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto">{renderPage()}</main>
      </div>

      <Modal isOpen={!!imageModalData} onClose={() => setImageModalData(null)}>
        {imageModalData && <>
            <h3 className="text-lg font-medium text-gray-900">Issue Photo</h3>
            <p className="text-sm text-gray-500 mb-4">{imageModalData.issueType} at {imageModalData.location}</p>
            <img src={imageModalData.image} alt="Issue" className="w-full h-auto rounded-lg" />
        </>}
      </Modal>

      <Modal isOpen={!!editModalData} onClose={() => setEditModalData(null)}>
        {editModalData && (
            <form onSubmit={handleSaveChanges}>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Issue</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Issue Type</label>
                        <input type="text" value={editModalData.issueType} onChange={e => setEditModalData({...editModalData, issueType: e.target.value})} className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" value={editModalData.location} onChange={e => setEditModalData({...editModalData, location: e.target.value})} className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea rows={3} value={editModalData.description} onChange={e => setEditModalData({...editModalData, description: e.target.value})} className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button type="button" onClick={() => setEditModalData(null)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Save Changes</button>
                </div>
            </form>
        )}
      </Modal>

    </div>
  );
};

export default CitizenDashboard;
