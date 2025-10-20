"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserData {
  user_id?: number;
  first_name: string;
  last_name: string;
  email?: string;
  account_type: string;
  profile_picture?: string | null;
}

interface UserContextType {
  userData: UserData | null;
  userRole: string;
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<string>("Loading...");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }

      const response = await res.json();
      console.log('API Response:', response);
      
      if (response.success && response.data) {
        const { user, userType } = response.data;
        
        const data: UserData = {
          user_id: user?.user_id,
          first_name: user?.first_name || '',
          last_name: user?.last_name || '',
          email: user?.email || '',
          profile_picture: user?.profile_picture || null,
          account_type: userType || user?.account_type || 'user'
        };

        console.log('User data extracted:', data);
        setUserData(data);

        // Map account_type to display name
        const roleMap: { [key: string]: string } = {
          'freelancer': 'Freelancer',
          'videographer': 'Videographer',
          'videoeditor': 'Video Editor',
          'video_editor': 'Video Editor',
          'client': 'Client'
        };

        const displayRole = roleMap[data.account_type] || data.account_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        console.log('Setting role:', displayRole);
        setUserRole(displayRole);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const refreshUserData = async () => {
    setIsLoading(true);
    await fetchUserData();
  };

  return (
    <UserContext.Provider value={{ userData, userRole, isLoading, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
