"use client";
import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaTasks, FaList, FaHotel } from "react-icons/fa";
import { SnackbarProvider, useSnackbar } from "notistack";
import axios from "axios";
import { motion } from "framer-motion";
import DataGalaxyLoader from "../DataGalaxyLoader";
import { API_BASE_URL } from "@/config/api";

interface Student {
  _id: string;
  name: string;
  wishlist: string[];
  wishlistApproved: boolean;
  wishlistSubmitted: boolean;
}

interface Hostel {
  _id: string;
  name: string;
}

interface HostelMap {
  [key: string]: string;
}

interface Task {
  id: string;
  name: string;
  items: string[];
  type: "wishlist";
  wishlistSubmitted: boolean;
}

interface TaskCardProps {
  task: Task;
  hostels: HostelMap;
  onRemoveItem: (taskId: string, itemIndex: number) => void;
  onApproveTask: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  hostels,
  onRemoveItem,
  onApproveTask,
}) => {
  const gradientColors: Record<string, string> = {
    wishlist: "from-blue-400 to-purple-500",
    hostels: "from-green-400 to-blue-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-gradient-to-br ${
        gradientColors[task.type]
      } text-white rounded-lg shadow-lg p-6 overflow-hidden`}
    >
      <div className="absolute top-0 right-0 mt-2 mr-2 flex space-x-2">
        <button
          onClick={() => onApproveTask(task.id)}
          className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition duration-200"
        >
          <FaCheck className="text-white" />
        </button>
        <button
          onClick={() => onRemoveItem(task.id, 0)}
          className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition duration-200"
        >
          <FaTimes className="text-white" />
        </button>
      </div>
      <h3 className="text-xl font-bold mb-4">{task.name}</h3>
      <div className="flex items-center mb-4">
        {task.type === "wishlist" ? (
          <FaList className="mr-2" />
        ) : (
          <FaHotel className="mr-2" />
        )}
        <span className="text-lg font-semibold capitalize">{task.type}</span>
      </div>
      <ul className="space-y-2">
        {task.items.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between py-1 px-2 bg-white bg-opacity-20 rounded"
          >
            <span>{hostels[item] || item}</span>
            <button
              onClick={() => onRemoveItem(task.id, index)}
              className="text-red-300 hover:text-red-100 transition duration-200"
            >
              <FaTimes />
            </button>
          </li>
        ))}
      </ul>
      {task.wishlistSubmitted && (
        <div className="mt-4 py-2 px-3 bg-yellow-400 text-yellow-900 rounded-full text-sm font-semibold">
          Wishlist Submitted
        </div>
      )}
    </motion.div>
  );
};

const TaskList: React.FC = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [hostels, setHostels] = useState<HostelMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        enqueueSnackbar("No token found. Please log in.", { variant: "error" });
        setIsLoading(false);
        return;
      }

      try {
        const [studentResponse, hostelResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/admin/students`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/admin/hostels`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const students: Student[] = studentResponse.data;
        const hostelData: Hostel[] = hostelResponse.data;

        const hostelMap: HostelMap = hostelData.reduce(
          (acc: HostelMap, hostel: Hostel) => {
            acc[hostel._id] = hostel.name;
            return acc;
          },
          {}
        );

        setHostels(hostelMap);

        const tasksFromStudents: Task[] = students
          .filter(
            (student: Student) =>
              !student.wishlistApproved && student.wishlist.length > 0
          )
          .map((student: Student) => ({
            id: student._id,
            name: student.name,
            items: student.wishlist,
            type: "wishlist" as const,
            wishlistSubmitted: student.wishlistSubmitted,
          }));

        setTaskList(tasksFromStudents);
        setIsLoading(false);
      } catch (error) {
        enqueueSnackbar("Failed to fetch data", { variant: "error" });
        setIsLoading(false);
      }
    };

    fetchData();
  }, [enqueueSnackbar]);

  const handleRemoveItem = async (taskId: string, itemIndex: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      enqueueSnackbar("No token found. Please log in.", { variant: "error" });
      return;
    }

    try {
      const hostelId = taskList.find((task) => task.id === taskId)?.items[
        itemIndex
      ];

      if (!hostelId) {
        enqueueSnackbar("Hostel ID not found.", { variant: "error" });
        return;
      }

      await axios.post(
        "${API_BASE_URL}/api/admin/wishlist/remove",
        { studentId: taskId, hostelId },
        {
          headers: { Authorization: ` Bearer ${token}` },
        }
      );

      setTaskList((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                items: task.items.filter((_, index) => index !== itemIndex),
              }
            : task
        )
      );

      enqueueSnackbar("Item removed successfully!", { variant: "success" });
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      enqueueSnackbar("Failed to remove item", { variant: "error" });
    }
  };

  const handleApproveTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        enqueueSnackbar("No token found. Please log in.", { variant: "error" });
        return;
      }

      await axios.post(
        "${API_BASE_URL}/api/admin/approve-wishlist",
        { studentId: taskId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      enqueueSnackbar("Wishlist approved successfully!", {
        variant: "success",
      });

      setTaskList((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      console.error("Error approving wishlist:", error);
      enqueueSnackbar("Failed to approve wishlist", { variant: "error" });
    }
  };

  if (isLoading) {
    return <DataGalaxyLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Task Management
      </h1>
      {taskList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {taskList.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              hostels={hostels}
              onRemoveItem={handleRemoveItem}
              onApproveTask={handleApproveTask}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md">
          <FaTasks className="text-6xl mb-4 text-green-400" />
          <h2 className="text-3xl font-semibold mb-2 text-gray-800">
            No Tasks Pending
          </h2>
          <p className="text-xl text-gray-600">
            All tasks have been completed! 🎉
          </p>
        </div>
      )}
    </div>
  );
};

const Tasks: React.FC = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <TaskList />
    </SnackbarProvider>
  );
};

export default Tasks;
