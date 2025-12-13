"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authCookies } from "@/utils/cookies";
import { normalizeRoles } from "@/utils/role-utils";

interface UserData {
  user_id?: number;
  first_name: string;
  last_name: string;
  email?: string;
  account_type: string;
  profile_picture?: string | null;
  is_oauth_user?: boolean;       // Indicates user registered via OAuth
  linked_providers?: string[];    // OAuth providers linked to account ('google', 'facebook', etc.)
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
    let token: string | undefined;

    try {
      // Get token from cookies
      token = authCookies.getToken();

      // If no token, user is not authenticated
      if (!token) {
        setUserData(null);
        setUserRoles([]);
        setCurrentRole('Not Authenticated');
        setIsLoading(false);
        return;
      }

      // Decode token to get roles (do this early for fallback)
      let decodedPayload: any = null;
      let rolesArray: string[] = [];

      try {
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
          throw new Error('Invalid JWT token format');
        }
        const base64Payload = tokenParts[1];
        decodedPayload = JSON.parse(atob(base64Payload));
        const userRolesFromToken = decodedPayload.roles || decodedPayload.role || [];
        rolesArray = Array.isArray(userRolesFromToken) ? userRolesFromToken : [userRolesFromToken];
      } catch (decodeError) {
        // Token decode failed, clear invalid token and set unauthenticated state
        authCookies.removeToken();
        setUserData(null);
        setUserRoles([]);
        setCurrentRole('Not Authenticated');
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      });

      if (!res.ok) {
        // If API is not available, fall back to token-based user info
        const data: UserData = {
          user_id: decodedPayload.user_id || decodedPayload.sub,
          first_name: decodedPayload.first_name || decodedPayload.name?.split(' ')[0] || '',
          last_name: decodedPayload.last_name || decodedPayload.name?.split(' ').slice(1).join(' ') || '',
          email: decodedPayload.email || '',
          profile_picture: decodedPayload.profile_picture || null,
          account_type: decodedPayload.account_type || 'user'
        };

        setUserData(data);

        const displayRoles = normalizeRoles(rolesArray);
        setUserRoles(displayRoles);
        setCurrentRole(displayRoles[0] || 'User');
        setIsLoading(false);
        return;
      }

      const response = await res.json();

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

        setUserData(data);

        const displayRoles = normalizeRoles(rolesArray);
        setUserRoles(displayRoles);
        setCurrentRole(displayRoles[0] || 'User');
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (error) {
      // If API fails and we have a token, try to use token data as fallback
      if (token) {
        try {
          const tokenParts = token.split(".");
          if (tokenParts.length !== 3) {
            throw new Error('Invalid JWT token format');
          }
          const base64Payload = tokenParts[1];
          const decodedPayload = JSON.parse(atob(base64Payload));
          const userRolesFromToken = decodedPayload.roles || decodedPayload.role || [];
          const rolesArray = Array.isArray(userRolesFromToken) ? userRolesFromToken : [userRolesFromToken];

          const data: UserData = {
            user_id: decodedPayload.user_id || decodedPayload.sub,
            first_name: decodedPayload.first_name || decodedPayload.name?.split(' ')[0] || '',
            last_name: decodedPayload.last_name || decodedPayload.name?.split(' ').slice(1).join(' ') || '',
            email: decodedPayload.email || '',
            profile_picture: decodedPayload.profile_picture || null,
            account_type: decodedPayload.account_type || 'user'
          };

          setUserData(data);

          const displayRoles = normalizeRoles(rolesArray);
          setUserRoles(displayRoles);
          setCurrentRole(displayRoles[0] || 'User');
        } catch (tokenError) {
          // Only set error state if both API and token fallback fail
          setUserData(null);
          setUserRoles([]);
          setCurrentRole('Error Loading');
        }
      } else {
        // No token available
        setUserData(null);
        setUserRoles([]);
        setCurrentRole('Not Authenticated');
      }
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
