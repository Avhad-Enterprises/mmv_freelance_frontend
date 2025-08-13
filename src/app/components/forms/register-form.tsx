
"use client";
import React, { useState } from "react";
import Image from "next/image";
import * as Yup from "yup";
import { Resolver, useForm } from "react-hook-form";
import ErrorMsg from "../common/error-msg";
import icon from "@/assets/images/icon/icon_60.svg";
import { useRouter } from "next/navigation";
import { makePostRequest, makeGetRequest } from "@/utils/api";
import { useEffect } from "react";

// form data type
type IFormData = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  account_type: string;
  skill: string[];
};

// schema
const schema = Yup.object().shape({
  username: Yup.string().required().label("User Name"),
  first_name: Yup.string().required().label("First Name"),
  last_name: Yup.string().required().label("Last Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  phone_number: Yup.number().required().label("Phone Number"),
  account_type: Yup.string().oneOf(["customer", "freelancer"]).required(),
  skill: Yup.array().when("account_type", {
    is: "freelancer",
    then: (schema) => schema.required("Skills are required"),
  }),
});
// resolver
const resolver: Resolver<IFormData> = async (values) => {
  return {
    values: values.email ? values : {},
    errors: !values.email
      ? {
        username: {
          type: "required",
          message: "User Name is required.",
        },
        first_name: {
          type: "required",
          message: "First Name is required.",
        },
        last_name: {
          type: "required",
          message: "Last Name is required.",
        },
        email: {
          type: "required",
          message: "Email is required.",
        },
        phone_number: {
          type: "required",
          message: "Phone Number is required.",
        },
        password: {
          type: "required",
          message: "Password is required.",
        },
        skill: {
          type: "required",
          message: "Skills are required.",
        },
      }
      : {},
  };
};

interface RegisterFormProps {
  activeTab: "candidate" | "employer";
}

const RegisterForm = ({ activeTab }: RegisterFormProps) => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [availableskill, setAvailableSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const router = useRouter();

  // react hook form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<IFormData>({ resolver });

  // Add skill tag to array
  const addSkill = async () => {
    const trimmedSkill = skillInput.trim();
    if (!trimmedSkill || skills.includes(trimmedSkill)) return;

    // If the input exactly matches an available skill, just add it
    if (availableskill.includes(trimmedSkill)) {
      const newSkills = [...skills, trimmedSkill];
      setSkills(newSkills);
      setValue("skill", newSkills);
      setSkillInput("");
      setAvailableSkills([]);
      return;
    }

    try {
      await makePostRequest("/tags/insertskill", {
        skill_name: trimmedSkill,
        created_by: 1,
      });

      const newSkills = [...skills, trimmedSkill];
      setSkills(newSkills);
      setValue("skill", newSkills);
      setSkillInput("");
      setAvailableSkills([]);
    } catch (error) {
      console.error("Failed to insert skill:", error);
      alert("Could not add skill. Maybe it already exists.");
    }
  };


  const fetchSkill = async (query: string) => {
    try {
      const response = await makeGetRequest(`tags/getallskill`);
      const fetchedSkills = Array.isArray(response.data?.data) ? response.data.data : [];
      const skillNames = fetchedSkills
        .map((skill: any) => skill.skill_name)
        .filter((name: string) => name.toLowerCase().includes(query.toLowerCase()));
      setAvailableSkills(skillNames);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
      setAvailableSkills([]);
    }
  };


  const removeSkill = (skill: string) => {
    const newSkills = skills.filter((s) => s !== skill);
    setSkills(newSkills);
    setValue("skill", newSkills);
  };


  // on submit
  const onSubmit = async (data: IFormData) => {
    try {
      const payload = {
        ...data,
        account_type: activeTab === "candidate" ? "freelancer" : "customer",
        skill: JSON.stringify(skills),
      };      

      console.log("Payload:", payload);
      const response = await makePostRequest("users/insert_user", payload);
      const result = response.data;

      console.log(data.account_type);
      console.log("API response:", response.data);

      alert("Registered successfully!");
      console.log("API response:", response.data);

      reset();
      setSkills([]);

    } catch (error: any) {
      console.error("Registration failed:", error);
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
      }
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (

    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <input
          type="hidden"
          value={activeTab === "candidate" ? "freelancer" : "customer"}
          {...register("account_type")}
          name="account_type"
        />
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>User Name*</label>
            <input
              type="text"
              placeholder="Enter user name"
              {...register("username", { required: `First Name is required!` })}
              name="username"
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.username?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>First Name*</label>
            <input
              type="text"
              placeholder="James Brower"
              {...register("first_name", { required: `First Name is required!` })}
              name="first_name"
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.first_name?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Last Name*</label>
            <input
              type="text"
              placeholder="James Brower"
              {...register("last_name", { required: `Last Name is required!` })}
              name="last_name"
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.last_name?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Email*</label>
            <input
              type="email"
              placeholder="james@example.com"
              {...register("email", { required: `Email is required!` })}
              name="email"
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.email?.message!} />
            </div>
          </div>
        </div>

        {activeTab === "candidate" && (
          <div className="col-12">
            <label>Skills*</label>
            <div className="input-group-meta position-relative mb-25">
              <input
                type="text"
                placeholder="Type skill and press Enter"
                value={skillInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSkillInput(value);
                  fetchSkill(value);  // 🔑 live query
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(); // fallback add
                  }
                }}
              />
              {availableskill.length > 0 && (
                <div style={{
                  position: "relative",
                  background: "#fff",
                  border: "1px solid #ccc",
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 10,
                }}>
                  {availableskill.map((skill) => (
                    <div
                      key={skill}
                      style={{ padding: "8px", cursor: "pointer" }}
                      onClick={() => {
                        if (!skills.includes(skill)) {
                          const newSkills = [...skills, skill];
                          setSkills(newSkills);
                          setValue("skill", newSkills);
                        }
                        setSkillInput("");
                        setAvailableSkills([]);
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: "10px" }}>
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: "inline-block",
                      background: "#eee",
                      padding: "5px 10px",
                      marginRight: "5px",
                      borderRadius: "15px",
                    }}
                  >
                    {skill}{" "}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      style={{ marginLeft: "5px" }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <ErrorMsg msg={errors.skill?.message!} />
          </div>
        )}


        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Phone Number*</label>
            <input
              type="text"
              placeholder="Enter Phone number"
              {...register("phone_number", { required: `Phone Number is required!` })}
              name="phone_number"
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.phone_number?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta position-relative mb-20">
            <label>Password*</label>
            <input
              type={`${showPass ? "text" : "password"}`}
              placeholder="Enter Password"
              className="pass_log_id"
              {...register("password", { required: `Password is required!` })}
              name="password"
            />
            <span
              className="placeholder_icon"
              onClick={() => setShowPass(!showPass)}
            >
              <span className={`passVicon ${showPass ? "eye-slash" : ""}`}>
                <Image src={icon} alt="pass-icon" />
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
                name="remember"
              />
              <label htmlFor="remember">
                By hitting the Register button, you agree to the{" "}
                <a href="#">Terms conditions</a> &{" "}
                <a href="#">Privacy Policy</a>
              </label>
            </div>
          </div>
        </div>
        <div className="col-12">
          <button type="submit" className="btn-eleven fw-500 tran3s d-block mt-20">
            Register
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;

