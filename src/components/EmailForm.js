import React from "react";
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
import { useFormik } from "formik";

function EmailForm({ handleNext, activeStep, steps }) {
  const { handleBlur, handleChange, errors, values } = useFormik({
    initialValues: {
      code: "",
      mobileNumber: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Code</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}>+91</MenuItem>
          <MenuItem value={20}>+11</MenuItem>
          <MenuItem value={30}>+69</MenuItem>
        </Select>
        <TextField
          id="outlined-number"
          label="Mobile Number"
          type="mobileNumber"
          InputLabelProps={{
            shrink: true,
          }}
        />
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
