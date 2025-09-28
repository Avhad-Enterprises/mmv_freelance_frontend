"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { makePostRequest, makeGetRequest } from "@/utils/api"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import Step1 from "./steps/Step1"
import Step2 from "./steps/Step2"
import Step3 from "./steps/Step3"
import Step4 from "./steps/Step4"
import Step5 from "./steps/Step5"
import FinalReview from "./steps/FinalReview"
import ClientStep2 from "./steps/client/ClientStep2"
import ClientStep3 from "./steps/client/ClientStep3"
import ClientStep4 from "./steps/client/ClientStep4"
import ClientStep5 from "./steps/client/ClientStep5"
import ClientFinalReview from "./steps/client/ClientFinalReview"
import ErrorMsg from "../common/error-msg"
import Image from "next/image"
import icon from "@/assets/images/icon/icon_60.svg"

type AccountType = "freelancer" | "client"

interface RegisterFormProps {
  activeTab: "candidate" | "employer"
}

interface IFormData {
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

const schema = Yup.object({
  username: Yup.string().required("User Name is required.").min(3, "User Name must be at least 3 characters."),
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
}) as Yup.ObjectSchema<IFormData>

const RegisterForm: React.FC<RegisterFormProps> = ({ activeTab }) => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<IFormData>>({})
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [availableskill, setAvailableSkills] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    setValue,
    formState: { errors, touchedFields, isSubmitted, isSubmitting },
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

  // useEffect hooks
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

  // Step navigation
  const nextStep = (data: Partial<IFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  // Skills management
  const addSkill = async () => {
    const trimmedSkills = skillInput.split(",").map(skill => skill.trim()).filter(skill => skill)
    const newSkills = [...skills]

    for (const trimmedSkill of trimmedSkills) {
      if (newSkills.includes(trimmedSkill)) continue

      if (availableskill.includes(trimmedSkill)) {
        newSkills.push(trimmedSkill)
        continue
      }

      try {
        await makePostRequest("/tags/insertskill", {
          skill_name: trimmedSkill,
          created_by: 1,
        })
        newSkills.push(trimmedSkill)
      } catch (error) {
        console.error("Failed to insert skill:", error)
        alert("Could not add skill. It may already exist.")
      }
    }

    setSkills(newSkills)
    setValue("skill", newSkills, { shouldValidate: true })
    setSkillInput("")
    setAvailableSkills([])
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

  const handleRegister = async (data: Partial<IFormData>) => {
    try {
      const finalData = { ...formData, ...data }
      console.log("Final Data:", finalData)

      const payload = {
        username: finalData.username,
        first_name: finalData.first_name,
        last_name: finalData.last_name,
        email: finalData.email,
        phone_number: finalData.phone_number,
        password: finalData.password,
        account_type: activeTab === "candidate" ? "freelancer" : "client",
        skill: finalData.account_type === "freelancer" ? JSON.stringify(skills) : "[]",
      }

      await makePostRequest("users/insert_user", payload)
      alert("Registered successfully!")
      reset()
      setSkills([])
      setAvailableSkills([])
      setSkillInput("")
      router.push("/")
    } catch (error: any) {
      console.error("Registration failed:", error)
      alert(error?.response?.data?.message || "Registration failed. Please try again.")
    }
  }

  const renderStep = () => {
    const stepProps = {
      nextStep,
      prevStep,
      formData,
      skills,
      skillInput,
      setSkillInput,
      availableSkills: availableskill,
      addSkill,
      removeSkill,
      fetchSkill,
      errors,
      touchedFields,
      register,
      showPassword,
      setShowPassword,
      isSubmitting,
      trigger,
    }

    // Common first step for both freelancer and client
    if (currentStep === 1) {
      return <Step1 {...stepProps} />
    }

    // Render different steps based on activeTab
    if (activeTab === "candidate") {
      switch (currentStep) {
        case 2:
          return <Step2 {...stepProps} />
        case 3:
          return <Step3 {...stepProps} />
        case 4:
          return <Step4 {...stepProps} />
        case 5:
          return <Step5 {...stepProps} />
        case 6:
          return <FinalReview {...stepProps} handleRegister={handleRegister} />
        default:
          return null
      }
    } else {
      switch (currentStep) {
        case 2:
          return <ClientStep2 {...stepProps} />
        case 3:
          return <ClientStep3 {...stepProps} />
        case 4:
          return <ClientStep4 {...stepProps} />
        case 5:
          return <ClientStep5 {...stepProps} />
        case 6:
          return <ClientFinalReview {...stepProps} handleRegister={handleRegister} />
        default:
          return null
      }
    }
  }

  return (
    <div className="form-wrapper m-auto">
      {renderStep()}
    </div>
  )
}

export default RegisterForm