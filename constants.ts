
import { Issue, OfficialDesignation, IssueDepartment, Flag } from './types';

export const HIERARCHY: OfficialDesignation[] = [
    OfficialDesignation.WARD,
    OfficialDesignation.ZONE,
    OfficialDesignation.CITY,
    OfficialDesignation.IAS,
];

export const VIZAG_COORDINATES: { [key: string]: { lat: number; lng: number } } = {
    "Akkayyapalem": {lat: 17.73, lng: 83.30}, 
    "Allipuram": {lat: 17.70, lng: 83.28}, 
    "Anakapalle": {lat: 17.68, lng: 83.01}, 
    "Arilova": {lat: 17.76, lng: 83.32}, 
    "Asilmetta": {lat: 17.72, lng: 83.31}, 
    "Bheemunipatnam (Bheemili)": {lat: 17.88, lng: 83.45}, 
    "Chinna Waltair": {lat: 17.74, lng: 83.33}, 
    "Dwaraka Nagar": {lat: 17.72, lng: 83.30}, 
    "Gajuwaka": {lat: 17.67, lng: 83.21}, 
    "Gopalapatnam": {lat: 17.75, lng: 83.25}, 
    "Jagadamba Centre": {lat: 17.70, lng: 83.29}, 
    "Kancharapalem": {lat: 17.73, lng: 83.28}, 
    "Maddilapalem": {lat: 17.73, lng: 83.32}, 
    "Madhurawada": {lat: 17.82, lng: 83.34}, 
    "MVP Colony": {lat: 17.74, lng: 83.32}, 
    "Pendurthi": {lat: 17.82, lng: 83.22}, 
    "RK Beach": {lat: 17.71, lng: 83.32}, 
    "Seethammadhara": {lat: 17.74, lng: 83.31}, 
    "Siripuram": {lat: 17.72, lng: 83.32}
};

export const INITIAL_ISSUES: Issue[] = [
    { id: 'user-922400', lat: 17.7388, lng: 83.3151, date: '2025-09-10', issueType: 'Road Issue - Pothole', location: 'MVP Colony', status: 'New at Ward', currentLevel: OfficialDesignation.WARD, department: IssueDepartment.ROAD, dueDate: new Date('2025-09-20'), flag: Flag.NONE, image: 'https://picsum.photos/seed/pothole/600/400', description: 'Large pothole causing traffic issues.' },
    { id: 'user-836000', lat: 17.6868, lng: 83.2185, date: '2025-09-18', issueType: 'Sanitation', location: 'Gajuwaka', status: 'New at Ward', currentLevel: OfficialDesignation.WARD, department: IssueDepartment.SANITATION, dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), flag: Flag.NONE, image: 'https://picsum.photos/seed/garbage/600/400', description: 'Garbage bin overflowing for days.' },
    { id: 'user-123456', lat: 17.7289, lng: 83.3222, date: '2025-09-15', issueType: 'Water', location: 'Siripuram', status: 'Escalated from Ward', currentLevel: OfficialDesignation.ZONE, department: IssueDepartment.WATER, dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), flag: Flag.NONE, image: 'https://picsum.photos/seed/pipe/600/400', description: 'Major pipeline burst.' },
    { id: 'user-789012', lat: 17.7126, lng: 83.3235, date: '2025-09-01', issueType: 'Road Issue - Streetlight', location: 'RK Beach', status: 'Acknowledged by City', currentLevel: OfficialDesignation.CITY, department: IssueDepartment.ROAD, dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), flag: Flag.NONE, image: 'https://picsum.photos/seed/light/600/400', description: 'Entire stretch of lights not working.' }
];
