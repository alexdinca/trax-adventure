'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap, Polyline } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DAY1, DAY2, DAY3, DAY_COLORS } from '@/app/briefing/dobrogea-calling/briefing-data';

interface Props {
  activeDay: number;
  fitKey: number;
}

export default function LeafletRouteMap({ activeDay, fitKey }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layersRef = useRef<Record<number, Polyline>>({});

  // Init map once on mount
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Leaflet must be required at runtime (not imported at top level) to avoid SSR issues
    // Since this component is always dynamically imported with ssr:false, require is safe here
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

    const l1 = L.polyline(DAY1, { color: DAY_COLORS[1], weight: 3, opacity: 0.9 });
    const l2 = L.polyline(DAY2, { color: DAY_COLORS[2], weight: 3, opacity: 0.9 });
    const l3 = L.polyline(DAY3, { color: DAY_COLORS[3], weight: 3, opacity: 0.9 });

    layersRef.current = { 1: l1, 2: l2, 3: l3 };
    mapRef.current = map;

    const dot = (latlng: [number, number], color: string) =>
      L.circleMarker(latlng, { radius: 5, fillColor: color, color: '#fff', weight: 1.5, fillOpacity: 1 });

    dot(DAY1[0], '#fff').addTo(map);
    dot(DAY1[DAY1.length - 1], DAY_COLORS[1]).addTo(map);
    dot(DAY2[0], '#fff').addTo(map);
    dot(DAY2[DAY2.length - 1], DAY_COLORS[2]).addTo(map);
    dot(DAY3[0], '#fff').addTo(map);
    dot(DAY3[DAY3.length - 1], DAY_COLORS[3]).addTo(map);

    // Show day 1 by default
    l1.addTo(map);
    map.fitBounds(l1.getBounds(), { padding: [20, 20] });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update layers and zoom whenever activeDay or fitKey changes
  useEffect(() => {
    const map = mapRef.current;
    const layers = layersRef.current;
    if (!map || !layers[1]) return;

    [1, 2, 3].forEach((n) => {
      if (map.hasLayer(layers[n])) map.removeLayer(layers[n]);
    });

    // Clear _animatingZoom before calling fitBounds — Leaflet's _tryAnimatedZoom
    // silently returns without zooming if _animatingZoom is true (set for 250ms
    // after any zoom animation starts), so any quick day-switch would silently fail.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (map as any)._animatingZoom = false;

    if (activeDay === 0) {
      [1, 2, 3].forEach((n) => layers[n].addTo(map));
      const allBounds = layers[1]
        .getBounds()
        .extend(layers[2].getBounds())
        .extend(layers[3].getBounds());
      map.fitBounds(allBounds, { padding: [20, 20] });
    } else {
      layers[activeDay].addTo(map);
      map.fitBounds(layers[activeDay].getBounds(), { padding: [20, 20] });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDay, fitKey]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
