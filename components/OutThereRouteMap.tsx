'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMapInstance, FeatureGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ROUTE_DAY1,
  ROUTE_DAY2,
  ROUTE_DAY3,
  WAYPOINTS,
  DAY_COLORS,
  type LatLng,
} from '@/app/briefing/out-there/briefing-data';

const ROUTES: Record<number, LatLng[]> = { 1: ROUTE_DAY1, 2: ROUTE_DAY2, 3: ROUTE_DAY3 };

interface Props {
  // 0 = show all three tracks, 1|2|3 = a single day
  activeDay: number;
  // bump to force a re-fit even if activeDay is unchanged
  fitKey: number;
}

function labelIcon(L: typeof import('leaflet'), label: string, color: string) {
  const html = `
    <div style="display:flex;align-items:center;gap:6px;transform:translate(-4px,-4px);">
      <span style="width:8px;height:8px;border-radius:50%;background:${color};border:1.5px solid #fff;display:block;flex-shrink:0;"></span>
      <span style="font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#F4F3EF;background:rgba(14,15,17,0.8);padding:2px 6px;white-space:nowrap;">${label}</span>
    </div>
  `;
  return L.divIcon({ html, className: '', iconSize: [0, 0] });
}

export default function OutThereRouteMap({ activeDay, fitKey }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMapInstance | null>(null);
  const groupRef = useRef<FeatureGroup | null>(null);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet') as typeof import('leaflet');

    const map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      maxZoom: 14,
    }).addTo(map);

    groupRef.current = L.featureGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      groupRef.current = null;
    };
  }, []);

  // Redraw tracks whenever the selection changes
  useEffect(() => {
    const map = mapRef.current;
    const group = groupRef.current;
    if (!map || !group) return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet') as typeof import('leaflet');

    group.clearLayers();

    const days = activeDay === 0 ? [1, 2, 3] : [activeDay];
    const dot = (latlng: LatLng, color: string) =>
      L.circleMarker(latlng, { radius: 5, fillColor: color, color: '#fff', weight: 1.5, fillOpacity: 1 });

    days.forEach((d) => {
      const route = ROUTES[d];
      const color = DAY_COLORS[d];
      if (!route || route.length === 0) return;

      L.polyline(route, { color, weight: 3, opacity: 0.9 }).addTo(group);
      dot(route[0], '#fff').addTo(group);
      dot(route[route.length - 1], color).addTo(group);

      // Only label waypoints when a single day is isolated, to avoid clutter on "All".
      if (activeDay !== 0) {
        WAYPOINTS[d].forEach((w) => {
          if (w.type === 'start') return;
          L.marker(w.position, { icon: labelIcon(L, w.label, color) }).addTo(group);
        });
      }
    });

    // Leaflet silently skips fitBounds while a zoom animation flag is set; clear it
    // so rapid day switches always re-fit.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (map as any)._animatingZoom = false;

    const bounds = group.getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDay, fitKey]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
