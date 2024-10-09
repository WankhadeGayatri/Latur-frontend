"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

interface Hostel {
  id: string;
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
 
}

interface MapComponentProps {
  filteredHostels: Hostel[];
}

const MapComponent: React.FC<MapComponentProps> = ({ filteredHostels }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const MapWithNoSSR = dynamic<MapComponentProps>(
    () => import("./MapContent.jsx"),
    {
      ssr: false,
      loading: () => <p>Loading map...</p>,
    }
  );

  if (!isMounted) return null;

  return <MapWithNoSSR filteredHostels={filteredHostels} />;
};

export default MapComponent;
