import React, { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import "./EmailForm.css";
import { useFormik } from "formik";
import { CountryCodes } from "../CountryCodes";
import { Flag } from "@mui/icons-material";
import RechargeSchema from "../validations/Recharge";
import { toast } from "react-toastify";

function EmailForm({
  handleNext,
  activeStep,
  steps,
  setActiveStep,
  setMobileNumber,
  loading,
  setLoading,
}) {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  // const isMediumScreen = useMediaQuery((theme) =>
  //   theme.breakpoints.between("sm", "md")
  // );
  // const isLargeScreen = useMediaQuery((theme) =>
  //   theme.breakpoints.between("md", "lg")
  // );
  // const isExtraLargeScreen = useMediaQuery((theme) =>
  //   theme.breakpoints.up("lg")
  // );
  const [isdCode, setIsdCode] = useState(CountryCodes);
  const [amount, setAmount] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const {
    handleBlur,
    handleChange,
    touched,
    errors,
    values,
    setFieldValue,
    handleSubmit,
  } = useFormik({
    initialValues: {
      code: "",
      mobileNumber: "",
    },
    validationSchema: RechargeSchema,
    onSubmit: (values) => {
      setLoading(true);
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          phoneNumber: values?.mobileNumber ? values?.mobileNumber : "",
          isd_code: values?.code ? values?.code?.split("+")?.[1] : "",
        },
      };

      fetch(
        "https://us-central1-influencer-ea69f.cloudfunctions.net/app/api/v1/users/verify",
        options
      )
        .then((response) => response.json())
        .then((response) => {
          if (response && response?.data && response?.success) {
            setMobileNumber(
              values.code && values?.mobileNumber
                ? `${values?.code}${values?.mobileNumber}`
                : ""
            );
            localStorage.setItem("td", JSON.stringify(response?.data?.id));
            localStorage.setItem(
              "rt",
              JSON.stringify(response?.data?.data?.restricted)
            );
            localStorage.setItem(
              "am",
              JSON.stringify(response?.data?.data?.wallet?.amount)
            );
            localStorage.setItem(
              "at",
              JSON.stringify(response?.data?.authToken)
            );
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setLoading(false);
          } else {
            // toast.error()
          }
        })
        .catch((err) => console.error(err));
    },
  });
  const handleAutocompleteChange = (_, value) => {
    // Manually set the Formik form state
    setFieldValue("code", value ? value.dial_code : "");
  };

  return (
    <div>
      {/* <FormControl fullWidth>
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
      </FormControl> */}
      <Container maxWidth={isSmallScreen ? "xs" : "md"}>
        <form onSubmit={handleSubmit} noValidate>
          {/* <Select value={selectedCountry} onChange={handleChange} name="code">
          <div class="search-field">
            <img
              src="/assets/images/icons/search-icon.png"
              alt=""
              class="serach-img"
            />
            <input
              class="search-input"
              type="text"
              onInput={(e) => filter(e)}
              placeholder="Search"
              style={{ width: "100%", lineHeight: "24px" }}
            />
          </div>
          {isdCode.map((country) => (
            <MenuItem key={country.code} value={country.code}>
              <div style={{ display: "flex" }}>
                <img
                  alt="United States"
                  src={
                    "http://purecatamphetamine.github.io/country-flag-icons/3x2/" +
                    country.code +
                    ".svg"
                  }
                  style={{ width: "35px", marginRight: "15px" }}
                />
                {`(${country.dial_code})`}
              </div>
            </MenuItem>
          ))}
        </Select> */}
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              marginLeft: "-14px",
            }}
          >
            <Grid item xs={4} sm={2} md={3}>
              <Autocomplete
                id="country-select-demo"
                name="code"
                onBlur={handleBlur}
                sx={{ width: "100%" }}
                options={isdCode}
                autoHighlight
                getOptionLabel={(option) => option.dial_code}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    <div style={{ display: "flex" }}>
                      {/* <Flag className="country-flag" countryCode={country.flag} svg /> */}
                      <img
                        alt="United States"
                        src={
                          "http://purecatamphetamine.github.io/country-flag-icons/3x2/" +
                          option.code +
                          ".svg"
                        }
                        style={{ width: "35px", marginRight: "15px" }}
                      />
                      {/* {`${option.name} (${option.dial_code})`} */}
                      {`(${option.dial_code})`}
                    </div>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="code"
                    onBlur={handleBlur}
                    label="Country Code"
                    inputProps={{
                      ...params.inputProps, // disable autocomplete and autofill
                      autoComplete: "new-password",
                    }}
                    error={Boolean(touched.code && errors.code)}
                    helperText={touched.code && errors.code}
                    onChange={(e, value) => {
                      // Manually update Autocomplete value
                      handleChange(e);
                      handleAutocompleteChange(e, value);
                    }}
                  />
                )}
                onChange={handleAutocompleteChange}
              />
            </Grid>
            <Grid item xs={4} sm={5} md={7}>
              <TextField
                id="outlined-number"
                label="Mobile Number"
                name="mobileNumber"
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ width: "100%" }}
                error={Boolean(errors.mobileNumber && touched.mobileNumber)}
                helperText={touched.mobileNumber && errors.mobileNumber}
              />
            </Grid>
            <Grid item xs={4} sm={1} md={2}>
              <Button
                type="submit"
                class="button-buy-now"
                role="button"
                sx={{ width: "100%", height: "100%" }}
              >
                {!loading ? "Buy Now" : ""}
                {loading ? (
                  <CircularProgress size={16} style={{ color: "white" }} />
                ) : (
                  ""
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </div>
  );
}

export default EmailForm;
