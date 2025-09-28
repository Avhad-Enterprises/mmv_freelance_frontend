"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useForm, Resolver } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import icon from "@/assets/images/icon/icon_60.svg";
import ErrorMsg from "../common/error-msg";
import { makePostRequest } from "@/utils/api";

type IFormData = {
  email: string;
  password: string;
};

const resolver: Resolver<IFormData> = async (values) => {
  const errors: any = {};
  if (!values.email) {
    errors.email = {
      type: "required",
      message: "Email or username is required.",
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
  const [showPass, setShowPass] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormData>({ resolver });

  const onSubmit = async (data: IFormData) => {
    try {
      const res = await makePostRequest("users/loginf", data);
      const result = res.data;

      toast.success("Login successful!");

      const token = result?.data?.token;
      if (token) localStorage.setItem("token", token);

      const accountType = result?.data?.user?.account_type;

      //Step 1: Fade out modal
      setFadeOut(true);

      //Step 2: Wait for fadeOut to finish, then remove modal + redirect
      setTimeout(() => {
        setIsVisible(false); // Remove modal from DOM

        //Step 3: Redirect after modal is gone
        if (accountType === "freelancer") {
          router.replace("/dashboard/candidate-dashboard?refresh=true");
        } else if (accountType === "client") {
          router.replace("/dashboard/employ-dashboard?refresh=true");
        } else {
          alert("Unknown account type. Cannot redirect.");
        }
      }, 500); // Match WOW fadeOut duration
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }

    reset();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`login-modal-wrapper wow ${fadeOut ? "fadeOut" : "fadeIn"}`}
      data-wow-duration="0.5s"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
        <div className="row">
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Email or Username*</label>
              <input
                type="text"
                placeholder="Enter email or username"
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
    </div>
  );
};

export default LoginForm;
