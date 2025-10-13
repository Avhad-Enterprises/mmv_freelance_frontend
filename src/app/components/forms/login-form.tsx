"use client";
import React, { useState } from "react";
import Image from "next/image";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMsg from "../common/error-msg";
import icon from "@/assets/images/icon/icon_60.svg";
// ❌ We no longer need the router for redirection
// import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { makePostRequest } from "@/utils/api";

type IFormData = { email: string; password: string; };

const schema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid email format").label("Email"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters").label("Password"),
});

// ✅ The component props can be simplified as they are no longer needed
const LoginForm = () => {
  const [showPass, setShowPass] = useState<boolean>(false);
  // ❌ router is no longer needed
  // const router = useRouter(); 

  const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormData>({ resolver: yupResolver(schema) });

  // ✅ This is the only part that needs to be changed
  const onSubmit = async (data: IFormData) => {
    try {
      const res = await makePostRequest("auth/login", data);
      const result = res.data;
      const token = result?.data?.token;

      if (token) {
        // 1. Store the token as before
        localStorage.setItem("token", token);
        reset();
        
        // 2. Show a success message
        toast.success("Login successful! Refreshing...");

        // 3. Reload the page after a short delay
        // The delay gives the user a moment to see the success toast.
        setTimeout(() => {
          window.location.reload();
        }, 500); // 500ms delay

      } else {
        toast.error(result?.message || "Login failed: No token received.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
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
              <input type="checkbox" id="remember" />
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