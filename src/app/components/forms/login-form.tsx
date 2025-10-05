"use client";
import React, { useState } from "react";
import Image from "next/image";
import * as Yup from "yup";
import { Resolver, useForm } from "react-hook-form";
import ErrorMsg from "../common/error-msg";
import icon from "@/assets/images/icon/icon_60.svg";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { makePostRequest } from "@/utils/api";

// form data type
type IFormData = {
  email: string;
  password: string;
};

// schema (email format removed)
const schema = Yup.object().shape({
  email: Yup.string().required("Email is required").label("Email"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters").label("Password"),
});

// resolver
const resolver: Resolver<IFormData> = async (values) => {
  const errors: any = {};
  if (!values.email) {
    errors.email = {
      type: "required",
      message: "Email is required.",
    };
  }
  if (!values.password) {
    errors.password = {
      type: "required",
      message: "Password is required.",
    };
  }
  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};

const LoginForm = () => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormData>({ resolver });

  const onSubmit = async (data: IFormData) => {
    try {
      const res = await makePostRequest("auth/login", data);
      const result = res.data;

      toast.success("Login successful!");
      console.log("Login Response:", result);

      const token = result?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("Token saved:", token);
      } else {
        console.warn("No token received.");
      }

      const userRoles = result?.data?.user?.roles;
      if (!userRoles || userRoles.length === 0) {
        alert("No roles assigned. Cannot redirect.");
        return;
      }

      if (userRoles.includes('CLIENT')) {
        router.push("/dashboard/employ-dashboard");
      } else if (userRoles.includes('VIDEOGRAPHER') || userRoles.includes('VIDEO_EDITOR')) {
        router.push("/dashboard/candidate-dashboard");
      } else {
        alert("Unknown role type. Cannot redirect.");
      }
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    }

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
      <div className="row">
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Email*</label>
            <input
              type="text"
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
