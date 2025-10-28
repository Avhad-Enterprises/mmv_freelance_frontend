"use client";
import React, { useState } from "react";
import Image from "next/image";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMsg from "../common/error-msg";
import icon from "@/assets/images/icon/icon_60.svg";
import toast from "react-hot-toast";
import { makePostRequest } from "@/utils/api";
import TokenRefreshService from "@/utils/tokenRefresh";

type IFormData = { email: string; password: string; rememberMe: boolean };

const schema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid email format").label("Email"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters").label("Password"),
  rememberMe: Yup.boolean().default(false),
});

// Props interface for LoginForm
interface LoginFormProps {
  onLoginSuccess?: () => void;
  isModal?: boolean;
}

// ✅ The component props can be simplified as they are no longer needed
const LoginForm = ({ onLoginSuccess, isModal = false }: LoginFormProps = {}) => {
  const [showPass, setShowPass] = useState<boolean>(false);
  // ❌ router is no longer needed
  // const router = useRouter(); 

  const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormData>({ resolver: yupResolver(schema) });

  // ✅ This is the only part that needs to be changed
  const onSubmit = async (data: IFormData) => {
    try {
      const res = await makePostRequest("api/v1/auth/login", {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe // Send remember me preference to backend
      });
      const result = res.data;
      const token = result?.data?.token;

      if (token) {
        // Store token based on remember me preference
        if (data.rememberMe) {
          // Keep user logged in across browser sessions
          localStorage.setItem("token", token);
          console.log("Token stored in localStorage (persistent)");
        } else {
          // Session-only login
          sessionStorage.setItem("token", token);
          // Also store in localStorage for backward compatibility with existing code
          localStorage.setItem("token", token);
          console.log("Token stored in sessionStorage (session-only)");
        }

        reset();

        // Start automatic token refresh monitoring
        const tokenRefreshService = TokenRefreshService.getInstance();
        tokenRefreshService.startAutoRefresh();

        // 2. Decode token to get user role
        const base64Payload = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(base64Payload));
        const userRoles = decodedPayload.roles || decodedPayload.role || [];

        // Handle case where roles might be a single string instead of array
        const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];

        // 3. Show a success message
        toast.success("Login successful! Redirecting to dashboard...");

        // 4. Call the onLoginSuccess callback if provided
        if (onLoginSuccess) {
          onLoginSuccess();
        }

        // 5. Redirect to appropriate dashboard based on role
        setTimeout(() => {
          if (rolesArray.includes('CLIENT') || rolesArray.includes('client')) {
            window.location.href = '/dashboard/employ-dashboard';
          } else if (rolesArray.includes('VIDEOGRAPHER') || rolesArray.includes('videographer') || 
                     rolesArray.includes('VIDEO_EDITOR') || rolesArray.includes('video_editor') ||
                     rolesArray.includes('videoEditor')) {
            window.location.href = '/dashboard/candidate-dashboard';
          } else {
            // Fallback to home if no recognized role
            window.location.href = '/';
          }
        }, 500); // 500ms delay

      } else {
        toast.error(result?.message || "Login failed: No token received.");
      }
    } catch (error: any) {
      // Handle login-specific errors without triggering global redirect
      if (error.response?.status === 401) {
        toast.error(error.response?.data?.message || "Invalid email or password");
      } else {
        toast.error(error.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
      <div className="row">
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Email*</label>
            <input
              type="email"
              placeholder="Enter email"
              {...register("email")}
              name="email"
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.email?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta position-relative mb-20">
            <label>Password*</label>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter Password"
              className="pass_log_id"
              {...register("password")}
              name="password"
            />
            <span
              className="placeholder_icon"
              onClick={() => setShowPass(!showPass)}
            >
              <span className={`passVicon ${showPass ? "eye-slash" : ""}`}>
                <Image src={icon} alt="icon" />
              </span>
            </span>
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.password?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="agreement-checkbox d-flex justify-content-between align-items-center">
            <div>
              <input 
                type="checkbox" 
                id="remember" 
                {...register("rememberMe")}
              />
              <label htmlFor="remember">Keep me logged in</label>
            </div>
            <a href="#">Forget Password?</a>
          </div>
        </div>
        <div className="col-12">
          <button
            type="submit"
            className="btn-eleven fw-500 tran3s d-block mt-20"
          >
            Login
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;