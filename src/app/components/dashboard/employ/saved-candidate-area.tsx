"use client";
import React, { useEffect, useState } from "react";
// import DashboardHeader from "../candidate/dashboard-header";
import CandidateItem from "./candidate-item";
import EmployShortSelect from "./short-select";
import { makePostRequest } from "@/utils/api";
import useDecodedToken from "@/hooks/useDecodedToken";

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const SavedCandidateArea = ({ setIsOpenSidebar }: IProps) => {
  const decoded = useDecodedToken();
  const [savedCandidates, setSavedCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedCandidates = async () => {
    if (!decoded) return;
    setLoading(true);
    try {
      const res = await makePostRequest("favorites/freelance-info", {
        user_id: Number(decoded.user_id),
      });
      const rawData = res.data.data || [];
      setSavedCandidates(rawData);
    } catch (err) {
      console.error("Error fetching saved candidates:", err);
    } finally {
      setLoading(false);
    }
    console.log(decoded.user_id)
  };

  useEffect(() => {
    fetchSavedCandidates();
  }, [decoded]);

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        {/* <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} /> */}

        <div className="d-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <h2 className="main-title m0">Saved Candidates</h2>
          <div className="short-filter d-flex align-items-center">
            <div className="text-dark fw-500 me-2">Sort by:</div>
            <EmployShortSelect />
          </div>
        </div>

        <div className="wrapper">
          {loading && <p>Loading saved candidates...</p>}

          {!loading && savedCandidates.length > 0 && savedCandidates.map((item, index) => (
            <CandidateItem key={item.favorite_freelancer_id || index} item={item} />
          ))}

          {!loading && savedCandidates.length === 0 && (
            <p>No saved candidates found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedCandidateArea;
