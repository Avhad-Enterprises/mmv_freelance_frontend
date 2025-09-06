"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import ErrorMsg from "../common/error-msg"
import icon from "@/assets/images/icon/icon_60.svg"
import { makeGetRequest, makePostRequest } from "@/utils/api"

type AccountType = "client" | "freelancer"

type IFormData = {
  username: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  password: string
  account_type: AccountType
  skill: string[]
  agreement_candidate: boolean
  agreement_employer: boolean
}

interface RegisterFormProps {
  activeTab: "candidate" | "employer"
}

/** ---- Yup Schema ---- */
const schema: Yup.ObjectSchema<IFormData> = Yup.object({
  username: Yup.string().required("User  Name is required.").min(3, "User  Name must be at least 3 characters."),
  first_name: Yup.string()
    .required("First Name is required.")
    .matches(/^[A-Za-z]+$/, "First Name can contain alphabets only."),
  last_name: Yup.string()
    .required("Last Name is required.")
    .matches(/^[A-Za-z]+$/, "Last Name can contain alphabets only."),
  email: Yup.string().required("Email is required.").email("Please enter a valid email."),
  phone_number: Yup.string()
    .required("Phone Number is required.")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits."),
  password: Yup.string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters.")
    .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter.")
    .matches(/[0-9]/, "Password must contain at least 1 number."),
  account_type: Yup.mixed<AccountType>().oneOf(["client", "freelancer"]).required("Account type is required."),
  skill: Yup.array()
    .of(Yup.string().required())
    .default([])
    .when("account_type", {
      is: "freelancer",
      then: (s) => s.min(1, "At least one skill is required."),
      otherwise: (s) => s.transform(() => []),
    }),
  agreement_candidate: Yup.boolean()
    .default(false)
    .when("account_type", {
      is: "freelancer",
      then: (s) => s.oneOf([true], "You must agree before registering."),
      otherwise: (s) => s.default(false),
    }),
  agreement_employer: Yup.boolean()
    .default(false)
    .when("account_type", {
      is: "client",
      then: (s) => s.oneOf([true], "You must agree before registering."),
      otherwise: (s) => s.default(false),
    }),
})

const RegisterForm: React.FC<RegisterFormProps> = ({ activeTab }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields, isSubmitting, isSubmitted },
    reset,
    trigger,
  } = useForm<IFormData>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
      account_type: activeTab === "candidate" ? "freelancer" : "client",
      skill: [],
      agreement_candidate: false,
      agreement_employer: false,
    },
  })

  const [skills, setSkills] = useState<string[]>([])
  const [availableskill, setAvailableSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const type: AccountType = activeTab === "candidate" ? "freelancer" : "client"
    setValue("account_type", type, { shouldValidate: true })
    if (type === "client") {
      setValue("skill", [], { shouldValidate: true })
      setSkills([])
    }
  }, [activeTab, setValue])

  useEffect(() => {
    register("skill")
  }, [register])

  const addSkill = async () => {
    const trimmedSkills = skillInput.split(",").map(skill => skill.trim()).filter(skill => skill);
    const newSkills = [...skills];

    for (const trimmedSkill of trimmedSkills) {
      if (newSkills.includes(trimmedSkill)) continue;

      if (availableskill.includes(trimmedSkill)) {
        newSkills.push(trimmedSkill);
        continue;
      }

      try {
        await makePostRequest("/tags/insertskill", {
          skill_name: trimmedSkill,
          created_by: 1,
        });
        newSkills.push(trimmedSkill);
      } catch (error) {
        console.error("Failed to insert skill:", error);
        alert("Could not add skill. It may already exist.");
      }
    }

    setSkills(newSkills);
    setValue("skill", newSkills, { shouldValidate: true });
    setSkillInput("");
    setAvailableSkills([]);
  }

  const fetchSkill = async (query: string) => {
    try {
      const response = await makeGetRequest(`tags/getallskill`)
      const fetchedSkills = Array.isArray(response.data?.data) ? response.data.data : []
      const names: string[] = fetchedSkills
        .map((s: any) => s?.skill_name)
        .filter((name: string) =>
          String(name || "")
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
      setAvailableSkills(names)
    } catch (error) {
      console.error("Failed to fetch skills:", error)
      setAvailableSkills([])
    }
  }

  const removeSkill = (skill: string) => {
    const newSkills = skills.filter((s) => s !== skill)
    setSkills(newSkills)
    setValue("skill", newSkills, { shouldValidate: true })
  }

  const onSubmit = async (data: IFormData) => {
    try {
      // Frontend validation for agreement
      const agreementField =
        activeTab === "candidate" ? data.agreement_candidate : data.agreement_employer
      if (!agreementField) {
        alert("Please agree to the terms before registering.")
        return
      }

      // Only DB fields are sent
      const payload = {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        password: data.password,
        account_type: activeTab === "candidate" ? "freelancer" : "client",
        skill: data.account_type === "freelancer" ? JSON.stringify(skills) : "[]",
      }

      await makePostRequest("users/insert_user", payload)
      alert("Registered successfully!")
      reset()
      setSkills([])
      setAvailableSkills([])
      setSkillInput("")
    } catch (error: any) {
      console.error("Registration failed:", error)
      alert(error?.response?.data?.message || "Registration failed. Please try again.")
    }
  }

  const skillError = (errors.skill as unknown as { message?: string })?.message || ""

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* Hidden Account Type */}
        <input
          type="hidden"
          value={activeTab === "candidate" ? "freelancer" : "client"}
          {...register("account_type")}
        />

        {/* Username */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>User Name*</label>
            <input type="text" placeholder="Enter user name" {...register("username")} />
            <div className="help-block with-errors">
              <ErrorMsg msg={touchedFields.username ? errors.username?.message : ""} />
            </div>
          </div>
        </div>

        {/* First Name */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>First Name*</label>
            <input type="text" placeholder="James" {...register("first_name")} />
            <div className="help-block with-errors">
              <ErrorMsg msg={touchedFields.first_name ? errors.first_name?.message : ""} />
            </div>
          </div>
        </div>

        {/* Last Name */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Last Name*</label>
            <input type="text" placeholder="Brower" {...register("last_name")} />
            <div className="help-block with-errors">
              <ErrorMsg msg={touchedFields.last_name ? errors.last_name?.message : ""} />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Email*</label>
            <input type="email" placeholder="james@example.com" {...register("email")} />
            <div className="help-block with-errors">
              <ErrorMsg msg={touchedFields.email ? errors.email?.message : ""} />
            </div>
          </div>
        </div>

        {/* Phone Number */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Phone Number*</label>
            <input type="text" placeholder="Enter phone number" {...register("phone_number")} inputMode="numeric" />
            <div className="help-block with-errors">
              <ErrorMsg msg={touchedFields.phone_number ? errors.phone_number?.message : ""} />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-20">
            <label>Password*</label>
            <input type={showPassword ? "text" : "password"} placeholder="Enter Password" {...register("password")} />
            <span className="placeholder_icon" onClick={() => setShowPassword((p) => !p)} style={{ cursor: "pointer" }}>
              <span className={"passVicon"}>
                <Image src={icon || "/placeholder.svg"} alt="pass-icon" />
              </span>
            </span>
            <div className="help-block with-errors">
              <ErrorMsg msg={touchedFields.password ? errors.password?.message : ""} />
            </div>
          </div>
        </div>

        {/* Skills */}
        {activeTab === "candidate" && (
          <div className="col-12">
            <label>Skills*</label>
            <div className="input-group-meta position-relative mb-25">
              <input
                type="text"
                placeholder="Type skills separated by comma and press Enter"
                value={skillInput}
                onChange={(e) => {
                  const value = e.target.value
                  setSkillInput(value)

                  const lastSkill = value.split(",").pop()?.trim()
                  if (lastSkill?.length) fetchSkill(lastSkill)
                  else setAvailableSkills([])
                }}
                onBlur={() => trigger("skill")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    const enteredSkills = skillInput
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s.length && !skills.includes(s))

                    if (enteredSkills.length) {
                      const newSkills = [...skills, ...enteredSkills]
                      setSkills(newSkills)
                      setValue("skill", newSkills, { shouldValidate: true })
                    }

                    setSkillInput("")
                    setAvailableSkills([])
                  }
                }}
              />

              {/* Suggestion Dropdown */}
              {availableskill.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #ccc",
                    maxHeight: "220px",
                    overflowY: "auto",
                    zIndex: 10,
                  }}
                >
                  {availableskill.map((s) => (
                    <div
                      key={s}
                      style={{ padding: "8px", cursor: "pointer" }}
                      onClick={() => {
                        if (!skills.includes(s)) {
                          const newSkills = [...skills, s]
                          setSkills(newSkills)
                          setValue("skill", newSkills, { shouldValidate: true })
                        }
                        setSkillInput("")
                        setAvailableSkills([])
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}

              {/* Skill Tags */}
              <div style={{ marginTop: "10px" }}>
                {skills.map((s, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: "inline-block",
                      background: "#eee",
                      padding: "5px 10px",
                      marginRight: "5px",
                      marginBottom: "6px",
                      borderRadius: "15px",
                    }}
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = skills.filter((item) => item !== s)
                        setSkills(updated)
                        setValue("skill", updated, { shouldValidate: true })
                      }}
                      style={{
                        marginLeft: "8px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Validation Message */}
            <div className="help-block with-errors">
              <ErrorMsg msg={touchedFields.skill || isSubmitted ? skillError : ""} />
            </div>
          </div>
        )}



        {/* Agreement */}
        <div className="col-12" style={{ marginTop: "15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              id={activeTab === "candidate" ? "agree_candidate" : "agree_employer"}
              {...register(activeTab === "candidate" ? "agreement_candidate" : "agreement_employer")}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
            <label
              htmlFor={activeTab === "candidate" ? "agree_candidate" : "agree_employer"}
              style={{ cursor: "pointer" }}
            >
              By hitting the Register button, you agree to the{" "}
              {activeTab === "candidate" ? (
                <>
                  <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
                </>
              ) : (
                <>
                  <a href="#">Employer Terms</a> and <a href="#">Privacy Policy</a>
                </>
              )}
            </label>
          </div>
          <div className="help-block with-errors" style={{ marginTop: "5px" }}>
            <ErrorMsg
              msg={
                activeTab === "candidate"
                  ? errors.agreement_candidate?.message || ""
                  : errors.agreement_employer?.message || ""
              }
            />
          </div>
        </div>

        {/* Submit */}
        <div className="col-12">
          <button type="submit" className="btn-eleven fw-500 tran3s d-block mt-20" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Register"}
          </button>
        </div>
      </div>
    </form>
  )
}

export default RegisterForm
