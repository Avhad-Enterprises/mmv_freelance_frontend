"use client";
import React from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { makePostRequest } from "@/utils/api";
import useDecodedToken from "@/hooks/useDecodedToken";
import toast from "react-hot-toast";
// import { todo } from "node:test";

type Props = {
  show: boolean;
  handleClose: () => void;
  projectId: number;
};

const ApplyFormModal = ({ show, handleClose, projectId }: Props) => {
  const { register, reset } = useForm();
  const decoded = useDecodedToken();
  const userId = decoded?.user_id;

  const handleSubmit = async () => {
  const response = await makePostRequest('applications/projects/apply', {
    user_id: userId,
    projects_task_id: projectId
  });
};
  const onSubmit = async (data: any) => {
    if (!userId) {
      toast.error("Please login to apply.");
      return;
    }

    const payload = {
      description: data.description,
      projects_task_id: projectId,
      user_id: userId,
    };

    try {
      const response = await makePostRequest(
        "applications/projects/apply",
        payload
      );
      console.log("Applied successfully:", response.data);
      toast.success("Application submitted successfully!");
      reset();
      handleClose();
      // alert("Application submitted successfully!");
    } catch (error: any) {
      console.error("Error applying:", error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while submitting."
      );
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Apply for Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label>Description</label>
            <textarea
              className="form-control"
              {...register("description", { required: true })}
            />
          </div>
          <button className="btn-one w-100 mt-25" type="submit">
            Submit
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ApplyFormModal;
