"use client";
import React, { useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMsg from "../common/error-msg";
import toast from "react-hot-toast";
import { makePostRequest } from "@/utils/api";
import TokenRefreshService from "@/utils/tokenRefresh";
import { authCookies } from "@/utils/cookies";

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // ❌ router is no longer needed
  // const router = useRouter(); 

  const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: IFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await makePostRequest("api/v1/auth/login", {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe
      });
      const result = res.data;
      const token = result?.data?.token;
      const userRoles = result?.data?.user?.roles;

      if (token && userRoles) {
        // Check if user has allowed roles for client portal
        const allowedRoles = ['CLIENT', 'VIDEOGRAPHER', 'VIDEO_EDITOR'];
        const hasAllowedRole = userRoles.some((role: string) => allowedRoles.includes(role));

        if (!hasAllowedRole) {
          toast.error("Access denied. Admin accounts cannot login to the client portal.");
          return;
        }

        // Store token using cookies
        authCookies.setToken(token, data.rememberMe);

        reset();

        // Decode token to get user role for redirection
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
          throw new Error('Invalid JWT token format');
        }
        const base64Payload = tokenParts[1];
        const decodedPayload = JSON.parse(atob(base64Payload));
        const tokenRoles = decodedPayload.roles || decodedPayload.role || [];

        const rolesArray = Array.isArray(tokenRoles) ? tokenRoles : [tokenRoles];
        const normalizedRoles = rolesArray.map((role: string) => role.toUpperCase());

        toast.success("Login successful! Redirecting to dashboard...");

        if (onLoginSuccess) {
          onLoginSuccess();
        }

        // Redirect to appropriate dashboard based on role (immediate redirect since full page reload handles context update)
        if (normalizedRoles.includes('CLIENT')) {
          window.location.href = '/dashboard/client-dashboard';
        } else if (normalizedRoles.includes('VIDEOGRAPHER') ||
          normalizedRoles.includes('VIDEO_EDITOR') ||
          normalizedRoles.includes('VIDEOEDITOR')) {
          window.location.href = '/dashboard/freelancer-dashboard';
        } else {
          window.location.href = '/';
        }

      } else {
        toast.error(result?.message || "Login failed: No token or user data received.");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error(error.response?.data?.message || "Invalid email or password");
      } else {
        toast.error(error.response?.data?.message || "Login failed");
      }
    } finally {
      setIsSubmitting(false);
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
              style={{
                position: 'absolute',
                right: '15px',
                top: '44px',
                cursor: 'pointer'
              }}
            >
              <i className={`fa ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
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
            <a href="/forgot-password">Forget Password?</a>
          </div>
        </div>
        <div className="col-12">
          <button
            type="submit"
            className="btn-eleven fw-500 tran3s d-block mt-20"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;