import React from "react";
import { useForm } from "react-hook-form";

const Step1: React.FC<{ nextStep: (data: any) => void; formData: any }> = ({ nextStep, formData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: formData });
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = (data: any) => {
    nextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* Username */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Username*</label>
            <input 
              type="text" 
              placeholder="Enter user name" 
              className="form-control" 
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <div className="error">{String(errors.username.message)}</div>
            )}
          </div>
        </div>

        {/* First Name */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>First Name*</label>
            <input 
              type="text" 
              placeholder="James" 
              className="form-control"
              {...register("first_name", { required: "First Name is required" })}
            />
            {errors.first_name && (
              <div className="error">{String(errors.first_name.message)}</div>
            )}
          </div>
        </div>

        {/* Last Name */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Last Name*</label>
            <input 
              type="text" 
              placeholder="Brower" 
              className="form-control"
              {...register("last_name", { required: "Last Name is required" })}
            />
            {errors.last_name && (
              <div className="error">{String(errors.last_name.message)}</div>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Email*</label>
            <input 
              type="email" 
              placeholder="james@example.com" 
              className="form-control"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <div className="error">{String(errors.email.message)}</div>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Password*</label>
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password" 
              className="form-control"
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            <span 
              className="placeholder_icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className={`pass-icon ${showPassword ? 'eye-slash' : 'eye'}`}></span>
            </span>
            {errors.password && (
              <div className="error">{String(errors.password.message)}</div>
            )}
          </div>
        </div>

        {/* Next Button */}
        <div className="col-12">
          <button type="submit" className="btn-one tran3s w-100 mt-30">
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step1;