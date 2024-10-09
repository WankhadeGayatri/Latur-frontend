"use client";

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from "react";

interface NotificationContextType {
  notificationCount: number;
  updateNotificationCount: (count: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notificationCount, setNotificationCount] = useState<number>(0);

  const updateNotificationCount = useCallback((count: number) => {
    setNotificationCount(count);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notificationCount, updateNotificationCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
