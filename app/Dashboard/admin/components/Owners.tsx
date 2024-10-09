import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, CircularProgress } from "@mui/material";
import { MdMoreVert, MdClose } from "react-icons/md";
import { API_BASE_URL } from "@/config/api";

interface Owner {
  _id: string;
  name: string;
  hostels: Hostel[];
  number: string;
  status: string;
  address?: string;
  image?: string;
  idProof?: {
    data: Buffer;
    contentType: string;
  };
}

interface Hostel {
  _id: string;
  name: string;
  address: string;
  hostelType: string;
  beds: number;
  images: {
    data: Buffer;
    contentType: string;
  }[];
}

export default function EnhancedOwners() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [showHostelsModal, setShowHostelsModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchOwners = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<Owner[]>(
          `${API_BASE_URL}/api/admin/owners`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "json",
          }
        );
        setOwners(response.data);
      } catch (err) {
        console.error("Error fetching owners:", err);
        setError(
          "Failed to fetch owners. Please check the console for details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  const handleViewHostels = (owner: Owner) => {
    setSelectedOwner(owner);
    setShowHostelsModal(true);
  };

  const handleCloseHostelsModal = () => {
    setShowHostelsModal(false);
    setSelectedOwner(null);
  };

  const renderIdProofImage = (owner: Owner) => {
    if (owner.idProof && owner.idProof.data) {
      const base64String = Buffer.from(owner.idProof.data).toString("base64");
      return (
        <img
          src={`data:${owner.idProof.contentType};base64,${base64String}`}
          alt="ID Proof"
          className="w-16 h-16 object-cover rounded-full"
        />
      );
    }
    return null;
  };

  const renderHostelImage = (hostel: Hostel) => {
    if (hostel.images && hostel.images.length > 0) {
      const base64String = Buffer.from(hostel.images[0].data).toString(
        "base64"
      );
      return (
        <img
          src={`data:${hostel.images[0].contentType};base64,${base64String}`}
          alt={hostel.name}
          className="w-full h-32 object-cover rounded-t-lg"
        />
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white to-sky-100 min-h-screen">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 lg:mb-10 text-sky-800">
        Hostel Owners
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {owners.map((owner) => (
          <div
            key={owner._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-sky-800">
                  {owner.name}
                </h3>
                {renderIdProofImage(owner)}
              </div>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Number:</span> {owner.number}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Address:</span>{" "}
                {owner.address || "N/A"}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-medium">Hostels:</span>{" "}
                {owner.hostels.length}
              </p>
              <div className="flex justify-between items-center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewHostels(owner)}
                  className="bg-sky-500 hover:bg-sky-600"
                >
                  View Hostels
                </Button>
                <button className="text-sky-600 hover:text-sky-800 transition duration-200 ease-in-out">
                  <MdMoreVert size={24} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={showHostelsModal}
        onClose={handleCloseHostelsModal}
        aria-labelledby="hostels-modal-title"
        aria-describedby="hostels-modal-description"
        className="flex items-center justify-center"
      >
        <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3
              id="hostels-modal-title"
              className="text-2xl font-bold text-sky-800"
            >
              {selectedOwner?.name}'s Hostels
            </h3>
            <button
              onClick={handleCloseHostelsModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <MdClose size={24} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedOwner?.hostels.map((hostel) => (
              <div
                key={hostel._id}
                className="bg-sky-50 rounded-lg overflow-hidden shadow-md"
              >
                {renderHostelImage(hostel)}
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-sky-800 mb-2">
                    {hostel.name}
                  </h4>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Type:</span>{" "}
                    {hostel.hostelType}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Beds:</span> {hostel.beds}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Address:</span>{" "}
                    {hostel.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
