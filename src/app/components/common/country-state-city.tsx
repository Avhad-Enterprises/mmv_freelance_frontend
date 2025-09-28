"use client";
import React, { useEffect, useState } from "react";
import { Country, State, City, ICountry, IState, ICity } from "country-state-city";

type Props = {
  country: string;
  state: string;
  city: string;
  disabled?: boolean;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
};

const CityStateCountry: React.FC<Props> = ({
  country,
  state,
  city,
  onCountryChange,
  onStateChange,
  onCityChange,
}) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  // Load countries
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (country) {
      const selectedCountry = countries.find((c) => c.name === country);
      if (selectedCountry) {
        setStates(State.getStatesOfCountry(selectedCountry.isoCode));
      }
      onStateChange("");
      onCityChange("");
      setCities([]);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [country, countries]);

  // Load cities when state changes
  useEffect(() => {
    if (state && country) {
      const selectedCountry = countries.find((c) => c.name === country);
      const selectedState = states.find((s) => s.name === state);
      if (selectedCountry && selectedState) {
        setCities(City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode));
      }
      onCityChange("");
    } else {
      setCities([]);
    }
  }, [state, country, countries, states]);

  return (
    <>
      {/* Country */}
      <div className="col-md-6 col-lg-3">
        <div className="dash-input-wrapper mb-25">
          <label>Country*</label>
          <select
            className="form-control"
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* State */}
      <div className="col-md-6 col-lg-3">
        <div className="dash-input-wrapper mb-25">
          <label>State*</label>
          <select
            className="form-control"
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
            disabled={!states.length}
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* City */}
      <div className="col-md-6 col-lg-3">
        <div className="dash-input-wrapper mb-25">
          <label>City*</label>
          <select
            className="form-control"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={!cities.length}
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default CityStateCountry;
