"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authCookies } from "@/utils/cookies";

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
  userRoles: string[];
  currentRole: string;
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
  setCurrentRole: (role: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [currentRole, setCurrentRole] = useState<string>("Loading...");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserData = async () => {
    try {
      // Get token from cookies
      const token = authCookies.getToken();

      // If no token, user is not authenticated
      if (!token) {
        console.log('No authentication token found - user not authenticated');
        setUserRoles([]);
        setCurrentRole('Not Authenticated');
        setIsLoading(false);
        return;
      }

      // Decode token to get roles
      const base64Payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      const userRolesFromToken = decodedPayload.roles || decodedPayload.role || [];
      const rolesArray = Array.isArray(userRolesFromToken) ? userRolesFromToken : [userRolesFromToken];

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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

        // Map roles to display names
        const roleMap: { [key: string]: string } = {
          'freelancer': 'Freelancer',
          'videographer': 'Videographer',
          'videoeditor': 'Video Editor',
          'video_editor': 'Video Editor',
          'client': 'Client'
        };

        const displayRoles = rolesArray.map(role => roleMap[role.toLowerCase()] || role.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()));
        console.log('Setting roles:', displayRoles);
        setUserRoles(displayRoles);
        setCurrentRole(displayRoles[0] || 'User'); // Set first role as current
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
    <UserContext.Provider value={{ userData, userRoles, currentRole, isLoading, refreshUserData, setCurrentRole }}>
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
