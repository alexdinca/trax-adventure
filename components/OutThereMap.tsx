'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMapInstance } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLng, RouteWaypoint } from '@/app/briefing/out-there/briefing-data';

const EMBER = '#C04A30';

interface Props {
  route: LatLng[];
  waypoints: RouteWaypoint[];
}

function waypointIcon(L: typeof import('leaflet'), label: string) {
  const html = `
    <div style="display:flex;align-items:center;gap:6px;transform:translate(-4px,-4px);">
      <span style="width:8px;height:8px;border-radius:50%;background:${EMBER};border:1.5px solid #fff;display:block;flex-shrink:0;"></span>
      <span style="font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#F4F3EF;background:rgba(14,15,17,0.8);padding:2px 6px;white-space:nowrap;">${label}</span>
    </div>
  `;
  return L.divIcon({ html, className: '', iconSize: [0, 0] });
}

export default function OutThereMap({ route, waypoints }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMapInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || route.length === 0) return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet') as typeof import('leaflet');

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      maxZoom: 14,
    }).addTo(map);

    const line = L.polyline(route, { color: EMBER, weight: 3, opacity: 0.9 }).addTo(map);

    const dot = (latlng: LatLng, color: string) =>
      L.circleMarker(latlng, { radius: 5, fillColor: color, color: '#fff', weight: 1.5, fillOpacity: 1 }).addTo(map);

    waypoints.forEach((wpt) => {
      if (wpt.type === 'fuel' || wpt.type === 'lunch' || wpt.type === 'camp' || wpt.type === 'poi') {
        L.marker(wpt.position, { icon: waypointIcon(L, wpt.label) }).addTo(map);
        if (wpt.type === 'camp') dot(wpt.position, EMBER);
      } else if (wpt.type === 'start') {
        dot(wpt.position, '#fff');
      } else if (wpt.type === 'finish') {
        dot(wpt.position, EMBER);
      }
    });

    map.fitBounds(line.getBounds(), { padding: [24, 24] });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
