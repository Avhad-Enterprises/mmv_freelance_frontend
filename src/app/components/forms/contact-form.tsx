"use client";
import React, { useState } from "react";
import * as Yup from "yup";
import { Resolver, useForm } from "react-hook-form";
import ErrorMsg from "../common/error-msg";
import { makePostRequest } from "@/utils/api";
import toast from "react-hot-toast";

// form data type
type IFormData = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

// schema
const schema = Yup.object().shape({
  name: Yup.string().required().max(255, "Name must be less than 255 characters").label("Name"),
  email: Yup.string().required().email().max(255, "Email must be less than 255 characters").label("Email"),
  subject: Yup.string().max(255, "Subject must be less than 255 characters").label("Subject"),
  message: Yup.string().required().max(2000, "Message must be less than 2000 characters").label("Message"),
});
// resolver
const resolver: Resolver<IFormData> = async (values) => {
  try {
    await schema.validate(values, { abortEarly: false });
    return {
      values,
      errors: {},
    };
  } catch (validationErrors: any) {
    const errors: any = {};
    validationErrors.inner.forEach((error: any) => {
      errors[error.path] = {
        type: error.type,
        message: error.message,
      };
    });
    return {
      values: {},
      errors,
    };
  }
};
const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormData>({ resolver });
  
  // on submit
  const onSubmit = async (data: IFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await makePostRequest("api/v1/contact/submit", {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });
      
      if (response.data.success) {
        toast.success("Contact form submitted successfully. You will receive a confirmation email shortly.");
        reset();
      } else {
        toast.error(response.data.message || "Failed to submit contact form");
      }
    } catch (error: any) {
      console.error("Contact form submission error:", error);
      toast.error(
        error.response?.data?.message || 
        "Failed to submit contact form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="messages"></div>
      <div className="row controls">
        <div className="col-sm-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">Name*</label>
            <input
              type="text"
              placeholder="Your Name*"
              {...register("name", { required: `Name is required!` })}
              name="name"
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.name?.message!} />
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">Email*</label>
            <input
              type="email"
              placeholder="Email Address*"
              {...register("email", { required: `Email is required!` })}
              name="email"
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.email?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta form-group mb-35">
            <label htmlFor="">Subject (optional)</label>
            <input
              {...register("subject")}
              type="text"
              placeholder="Write about the subject here.."
              name="subject"
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.subject?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta form-group mb-35">
            <textarea
              placeholder="Your message*"
              {...register("message", { required: `Message is required!` })}
              name="message"
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.message?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <button 
            className="btn-eleven fw-500 tran3s d-block"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
