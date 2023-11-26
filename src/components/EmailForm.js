import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import "./EmailForm.css";
import { useFormik } from "formik";
import { CountryCodes } from "../CountryCodes";
import { Flag } from "@mui/icons-material";

function EmailForm({ handleNext, activeStep, steps }) {
  const [isdCode, setIsdCode] = useState(CountryCodes);
  const { handleBlur, handleChange, errors, values } = useFormik({
    initialValues: {
      code: "",
      mobileNumber: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const countries = [
    { code: "+1", label: "United States", flag: "US" },
    { code: "+44", label: "United Kingdom", flag: "GB" },
    // Add more countries as needed
  ];
  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Code</InputLabel>
        <div className="code-field">
          <img src="" alt="" className="code-img" />
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Age"
            onChange={handleChange}
            className="code-input"
          >
            <MenuItem value={10}>+91</MenuItem>
            <MenuItem value={20}>+11</MenuItem>
            <MenuItem value={30}>+69</MenuItem>
          </Select>
        </div>
        <TextField
          id="outlined-number"
          label="Mobile Number"
          type="mobileNumber"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </FormControl>
      <FormControl>
        <Select value={selectedCountry} onChange={handleCountryChange}>
          {countries.map((country) => (
            <MenuItem key={country.code} value={country.code}>
              <Flag className="country-flag" countryCode={country.flag} svg />
              {`${country.label} (${country.code})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        {/* <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button> */}
        <Box sx={{ flex: "1 1 auto" }} />
        {/* {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )} */}

        <Button onClick={handleNext}>
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </Box>
    </div>
  );
}

export default EmailForm;
