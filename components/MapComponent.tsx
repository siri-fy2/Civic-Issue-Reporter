import React, { useEffect, useRef } from 'react';
import { Issue, IssueDepartment } from '../types';

declare const L: any; // Using Leaflet from CDN

interface MapComponentProps {
  issues: Issue[];
}

const DEPARTMENT_COLORS: Record<IssueDepartment, string> = {
  [IssueDepartment.ROAD]: '#E74C3C', // Red
  [IssueDepartment.SANITATION]: '#F1C40F', // Yellow
  // FIX: Corrected typo from IssueDirection to IssueDepartment. This resolves the missing property error and the unknown name error.
  [IssueDepartment.WATER]: '#3498DB', // Blue
};

const MapComponent: React.FC<MapComponentProps> = ({ issues }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([17.72, 83.3], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstance.current);
    }
  }, []);

  useEffect(() => {
    if (mapInstance.current) {
        // Clear existing markers
        mapInstance.current.eachLayer((layer: any) => {
            if (layer instanceof L.CircleMarker) {
                mapInstance.current.removeLayer(layer);
            }
        });

        // Add new markers
        issues.forEach(issue => {
            const color = DEPARTMENT_COLORS[issue.department] || '#808080';
            const marker = L.circleMarker([issue.lat, issue.lng], {
                radius: 8,
                color: 'white',
                weight: 2,
                fillColor: color,
                fillOpacity: 0.9,
            }).addTo(mapInstance.current);

            marker.bindPopup(`
                <b>ID:</b> ${issue.id}<br>
                <b>Type:</b> ${issue.issueType}<br>
                <b>Location:</b> ${issue.location}<br>
                <b>Status:</b> ${issue.status}
            `);
        });
    }
  }, [issues]);

  return (
    <div className="rounded-lg shadow-md overflow-hidden relative">
      <div ref={mapRef} style={{ height: '600px', width: '100%' }} />
      <div className="absolute top-2 right-2 bg-white p-2 rounded-md shadow-lg z-[1000]">
        <h4 className="font-bold text-sm mb-1">Legend</h4>
        {Object.entries(DEPARTMENT_COLORS).map(([dept, color]) => (
            <div key={dept} className="flex items-center text-xs">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                {dept}
            </div>
        ))}
      </div>
    </div>
  );
};

export default MapComponent;