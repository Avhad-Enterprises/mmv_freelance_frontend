"use client";
import React, { useEffect, useState } from "react";
import { makeGetRequest } from "@/utils/api";

interface Country {
  country_id: number;
  country_name: string;
}

interface Props {
  value?: string;
  onChange: (val: string) => void;
}

const CountrySelect: React.FC<Props> = ({ value, onChange }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await makeGetRequest("location/countries");
        if (res.data?.data) {
          setCountries(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) return <p>Loading countries...</p>;

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="form-select"
    >
      <option value="">Select Country</option>
      {countries.map((country) => (
        <option key={country.country_id} value={country.country_name}>
          {country.country_name}
        </option>
      ))}
    </select>
  );
};

export default CountrySelect;
