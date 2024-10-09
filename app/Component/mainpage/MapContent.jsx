"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import { OpenStreetMapProvider } from "leaflet-geosearch";

const MapComponent = ({ filteredHostels }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hostelLocations, setHostelLocations] = useState([]);
  const mapRef = useRef(null);
  const provider = new OpenStreetMapProvider();

  const center = [18.51957, 73.85535]; // Default center

  const customIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    className: "custom-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });

  useEffect(() => {
    // Immediately set hostel locations with available coordinates
    const initialLocations = filteredHostels.map((hostel) => ({
      ...hostel,
      latitude: hostel.latitude || center[0] + (Math.random() - 0.5) * 0.1,
      longitude: hostel.longitude || center[1] + (Math.random() - 0.5) * 0.1,
    }));
    setHostelLocations(initialLocations);

    // Then, geocode addresses in the background
    filteredHostels.forEach(async (hostel, index) => {
      if (!hostel.latitude && !hostel.longitude && hostel.address) {
        try {
          const results = await provider.search({ query: hostel.address });
          if (results.length > 0) {
            setHostelLocations((prevLocations) => {
              const newLocations = [...prevLocations];
              newLocations[index] = {
                ...hostel,
                latitude: results[0].y,
                longitude: results[0].x,
              };
              return newLocations;
            });
          }
        } catch (error) {
          console.error("Error searching for address:", error);
        }
      }
    });
  }, [filteredHostels]);

  const SearchControl = () => {
    const map = useMap();

    const handleSearch = async (e) => {
      e.preventDefault();
      const results = await provider.search({ query: searchQuery });
      setSearchResults(results);
      if (results.length > 0) {
        map.flyTo([results[0].y, results[0].x], 13);
      }
    };
    const LoaderComponent = () => {
      return (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50">
          <div className="w-90 h-90 justify-center">
            <Lottie animationData={wait} loop={true} autoplay={true} />
          </div>
        </div>
      );
    };
    return (
      <div
        className="leaflet-top leaflet-right"
        style={{ top: "10px", left: "10px" }}
      >
        <div
          className="leaflet-control leaflet-bar"
          style={{
            backgroundColor: "white",
            padding: "5px",
            borderRadius: "4px",
          }}
        >
          <form
            onSubmit={handleSearch}
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location"
              style={{ marginLeft: "5px", width: "140px", fontSize: "12px" }}
            />
            <button type="submit" style={{ fontSize: "12px" }}>
              Search
            </button>
          </form>
        </div>
      </div>
    );
  };

  const LocateControl = () => {
    const map = useMap();

    const handleLocate = () => {
      map.locate().on("locationfound", function (e) {
        map.flyTo(e.latlng, map.getZoom());
      });
    };

    return (
      <div
        className="leaflet-top leaflet-left"
        style={{ top: "50px", left: "10px" }}
      >
        <div className="leaflet-control leaflet-bar">
          <a
            className="leaflet-control-locate"
            href="#"
            title="Locate me"
            onClick={handleLocate}
            style={{
              backgroundColor: "white",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            <span>📍</span>
          </a>
        </div>
      </div>
    );
  };

  const MapEventHandler = () => {
    useMapEvents({
      moveend: () => {
        if (mapRef.current) {
          const { lat, lng } = mapRef.current.getCenter();
          console.log(`Map center: ${lat}, ${lng}`);
        }
      },
    });
    return null;
  };

  return (
    <div style={{ position: "absolute", width: "100%", height: "100%" }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%", borderRadius: "15px" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup>
          {hostelLocations.map((hostel) => (
            <Marker
              key={hostel.id}
              position={[hostel.latitude, hostel.longitude]}
              icon={customIcon}
            >
              <Popup>
                <div style={{ fontSize: "12px" }}>
                  <h3 style={{ fontSize: "14px", marginBottom: "5px" }}>
                    {hostel.name}
                  </h3>
                  <p>{hostel.address || "Address not available"}</p>
                  <p>Type: {hostel.hostelType || "Not specified"}</p>
                  <p>
                    Rent: ₹
                    {(hostel.rentStructure &&
                      hostel.rentStructure[0] &&
                      hostel.rentStructure[0].rentPerStudent) ||
                      "N/A"}
                  </p>
                  {hostel.verified && <p>✅ Verified</p>}
                  {hostel.food && <p>🍽️ Food Available</p>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        <LocateControl />
        <SearchControl />
        <MapEventHandler />
      </MapContainer>

      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          background: "white",
          padding: "5px",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          fontSize: "12px",
        }}
      >
        <h4 style={{ fontSize: "14px", marginBottom: "5px" }}>Legend</h4>
        <div>
          <span style={{ color: "red", marginRight: "5px" }}>📍</span> Hostel
        </div>
        <div>✅ Verified</div>
        <div>🍽️ Food</div>
      </div>
    </div>
  );
};

export default MapComponent;
