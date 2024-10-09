import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Edit, Eye, Trash2 } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface Student {
  _id: string;
  name: string;
  number: string;
  class: string;
  year: string;
  school: string;
  city: string;
  email: string;
  address: string;
  passportPhoto?: {
    data: string;
    contentType: string;
  };
  admittedHostel?: {
    name: string;
    owner: {
      name: string;
      number: string;
    };
  };
  complaints: Array<{
    description: string;
    status: string;
    complaintType: string;
    hostelName: string;
  }>;
  feedback: Array<{
    rating: number;
    comment: string;
    hostelName: string;
  }>;
}

export default function StudentsPage(): JSX.Element {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchStudents = async (): Promise<void> => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found, please login first.");
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get<Student[]>(
          `${API_BASE_URL}/api/admin/students`,
          config
        );
        setStudents(response.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        setError(axiosError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleViewDetails = (student: Student): void => {
    setSelectedStudent(student);
  };

  const handleClosePopup = (): void => {
    setSelectedStudent(null);
    setEditingStudent(null);
    setIsEditing(false);
  };

  const handleEditStudent = (student: Student): void => {
    setEditingStudent({ ...student });
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setEditingStudent((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleUpdateStudent = async (): Promise<void> => {
    if (!editingStudent || !selectedStudent) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }
    try {
      const updatedFields: Partial<Student> = {};
      (Object.keys(editingStudent) as Array<keyof Student>).forEach((key) => {
        if (editingStudent[key] !== selectedStudent[key]) {
          // Use type assertion to assure TypeScript that this assignment is safe
          (updatedFields as any)[key] = editingStudent[key];
        }
      });

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.put<Student>(
        `${API_BASE_URL}/api/admin/students`,
        {
          studentId: editingStudent._id,
          ...updatedFields,
        },
        config
      );
      setStudents((prev) =>
        prev.map((student) =>
          student._id === editingStudent._id
            ? { ...student, ...updatedFields }
            : student
        )
      );
      setSelectedStudent({ ...selectedStudent, ...updatedFields });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating student:", error);
      setError(
        "Failed to update student. Please check the console for details."
      );
    }
  };

  const handleDeleteStudent = async (studentId: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.delete<void>(
        `${API_BASE_URL}/api/admin/students/${studentId}`,
        config
      );

      setStudents((prev) =>
        prev.filter((student) => student._id !== studentId)
      );

      if (selectedStudent && selectedStudent._id === studentId) {
        setSelectedStudent(null);
      }

      if (editingStudent && editingStudent._id === studentId) {
        setEditingStudent(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      setError(
        "Failed to delete student. Please check the console for details."
      );
    }
  };

  const getPassportPhotoSrc = (photo?: {
    data: string;
    contentType: string;
  }): string | null => {
    if (!photo) return null;
    return `data:${photo.contentType};base64,${photo.data}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-4 bg-gradient-to-r from-white to-sky-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-sky-800">Students</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-sky-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-sky-800 uppercase tracking-wider">
                Photo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-sky-800 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-sky-800 uppercase tracking-wider">
                Contact
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-sky-800 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr
                key={student._id}
                className="hover:bg-sky-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={
                      getPassportPhotoSrc(student.passportPhoto) ||
                      "/api/placeholder/40/40"
                    }
                    alt={`${student.name}'s passport`}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {student.number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleViewDetails(student)}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 transition-colors duration-200"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200"
                      title="Edit Student"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student._id)}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                      title="Delete Student"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStudent && !isEditing && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="flex justify-center mb-4">
                <img
                  src={
                    getPassportPhotoSrc(selectedStudent.passportPhoto) ||
                    "/api/placeholder/100/100"
                  }
                  alt={`${selectedStudent.name}'s passport`}
                  className="h-24 w-24 rounded-full object-cover"
                />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {selectedStudent.name}
              </h3>
              <div className="mt-2 px-7 py-3">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Email
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {selectedStudent.email}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Number
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {selectedStudent.number}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        class
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {selectedStudent.class}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Year
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {selectedStudent.year}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        School
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {selectedStudent.school}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        City
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {selectedStudent.city}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Address
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {selectedStudent.address}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Admitted Hostel
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {selectedStudent.admittedHostel?.name || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Hostel Owner
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {selectedStudent.admittedHostel?.owner.name || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h4 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                  Complaints
                </h4>
                {selectedStudent.complaints.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hostel
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedStudent.complaints.map((complaint, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {complaint.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {complaint.status}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {complaint.complaintType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {complaint.hostelName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-gray-500">No complaints</p>
                )}

                <h4 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                  Feedback
                </h4>
                {selectedStudent.feedback.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Comment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hostel
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedStudent.feedback.map((feedback, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {feedback.rating}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {feedback.comment}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {feedback.hostelName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-gray-500">No feedback</p>
                )}
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => handleEditStudent(selectedStudent)}
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 mb-2"
                >
                  Edit
                </button>
                <button
                  onClick={handleClosePopup}
                  className="px-4 py-2 bg-sky-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
                >
                  Close
                </button>
                {/* <button
                  onClick={() => handleDeleteStudent(selectedStudent._id)}
                  className="text-red-600 hover:text-red-900 transition-colors duration-200"
                >
                  Delete
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditing && editingStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Edit Student Details
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={editingStudent.name}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number
              </label>
              <input
                type="text"
                name="number"
                value={editingStudent.number}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={editingStudent.city}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                School
              </label>
              <input
                type="text"
                name="school"
                value={editingStudent.school}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Class
              </label>
              <input
                type="text"
                name="class"
                value={editingStudent.class}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="text"
                name="year"
                value={editingStudent.year}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleClosePopup}
                className="text-gray-500 hover:text-gray-400 transition duration-200 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStudent}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400 transition duration-200 ease-in-out"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
