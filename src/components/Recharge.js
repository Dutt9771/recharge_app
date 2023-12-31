import {
  Box,
  Button,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  Typography,
  stepConnectorClasses,
} from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import CoupenCode from "./CoupenCode";
import CouponCode from "./CoupenCode";
import EmailForm from "./EmailForm";
import PaymentOption from "./PaymentOption";
import Header from "./Header";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));
function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <LocalOfferRoundedIcon />,
    2: <CallRoundedIcon />,
    3: <PaymentRoundedIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

function Recharge() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAppliedId, setIsAppliedId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const steps = [
    `Coupon Code${
      couponCode?.data?.price ? " ( ₹" + couponCode?.data?.price + ")" : ""
    }`,
    `Mobile Number${mobileNumber ? " (" + mobileNumber + ")" : ""}`,
    `Payment${
      couponCode?.data?.price ? " ( ₹" + couponCode?.data?.price + ")" : ""
    }`,
  ];
  const handleNext = () => {
    // let newSkipped = skipped;
    // if (isStepSkipped(activeStep)) {
    //   newSkipped = new Set(newSkipped.values());
    //   newSkipped.delete(activeStep);
    // }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // setSkipped(newSkipped);
  };

  const steeper = (label) => {
    if (
      label !=
        `Payment${
          couponCode?.data?.price ? " ( ₹" + couponCode?.data?.price + ")" : ""
        }` &&
      couponCode?.data?.price &&
      activeStep < 2
    ) {
      const index = steps.findIndex((item) => item == label);
      if (index >= 0) {
        setActiveStep(index);
      }
    }
  };
  const getPointerCursor = (label) => {
    if (
      label !=
        `Payment${
          couponCode?.data?.price ? " ( ₹" + couponCode?.data?.price + ")" : ""
        }` &&
      couponCode?.data?.price &&
      activeStep < 2
    ) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <>
      <Header />
      <div style={{ marginTop: "30px" }}>
        <Stepper
          alternativeLabel
          connector={<ColorlibConnector />}
          activeStep={activeStep}
        >
          {steps.map((label) => (
            <Step
              key={label}
              onClick={() => steeper(label)}
              style={{ cursor: getPointerCursor(label) ? "pointer" : "" }}
            >
              <StepLabel
                StepIconComponent={ColorlibStepIcon}
                style={{ cursor: getPointerCursor(label) ? "pointer" : "" }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep == 0 && (
          <CouponCode
            handleNext={handleNext}
            setCouponCode={setCouponCode}
            activeStep={activeStep}
            steps={steps}
            setActiveStep={setActiveStep}
            isAppliedId={isAppliedId}
            setIsAppliedId={setIsAppliedId}
          />
        )}
        {activeStep == 1 && (
          <EmailForm
            handleNext={handleNext}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setMobileNumber={setMobileNumber}
            setLoading={setLoading}
            loading={loading}
            steps={steps}
          />
        )}
        {activeStep == 2 && (
          <PaymentOption
            handleNext={handleNext}
            activeStep={activeStep}
            couponCode={couponCode}
            setLoading={setLoading}
            loading={loading}
            setActiveStep={setActiveStep}
            steps={steps}
          />
        )}
        {activeStep === steps.length && (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              {/* <Button onClick={handleReset}>Reset</Button> */}
            </Box>
          </React.Fragment>
        )}
      </div>
    </>
  );
}

const componentConfig = {
  component: Recharge,
  path: "/recharge",
  // public: false,
  //   layout: DashboardLayout,
  // roles: ["admin"],
  // group: null,
  //   sidebar: false,
};

export default componentConfig;
