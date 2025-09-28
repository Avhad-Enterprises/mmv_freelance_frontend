import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

// Define the expected shape of the decoded JWT payload
interface IJwtPayload {
  user_id: number;
  email?: string;
  [key: string]: any; // Allow additional fields for flexibility
}

export const getLoggedInUser = (): IJwtPayload | null => {
  if (typeof window === "undefined") {
    return null; // Avoid SSR issues
  }

  try {
    const token = localStorage.getItem("token"); // Match key from LoginForm
    if (!token) {
      return null;
    }

    const decoded: IJwtPayload = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Failed to decode JWT for key 'token':", error);
    toast.error("Session expired. Please log in again.");
    return null;
  }
};