"use client";
import React, { useEffect, useState } from "react";
import { makeGetRequest } from "@/utils/api";

interface State {
  state_id: number;
  state_name: string;
}

interface Props {
  value?: string;
  countryId?: number;
  onChange: (val: string) => void;
}

const StateSelect: React.FC<Props> = ({ value, countryId, onChange }) => {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!countryId) {
      setStates([]);
      return;
    }

    const fetchStates = async () => {
      setLoading(true);
      try {
        const res = await makeGetRequest(`api/v1/location/states/${countryId}`);
        // console.log("States Data : ", res);
        if (res.data?.data) {
          setStates(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching states:", err);
        setStates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, [countryId]);

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="form-select"
    >
      <option value="">Select State</option>
      {loading && <option>Loading...</option>}
      {!loading &&
        states.map((state) => (
          <option key={state.state_id} value={state.state_name}>
            {state.state_name}
          </option>
        ))}
    </select>
  );
};

export default StateSelect;
