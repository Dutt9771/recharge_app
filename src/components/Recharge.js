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
import React from "react";
import { styled } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
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
    2: <EmailRoundedIcon />,
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
  const [activeStep, setActiveStep] = React.useState(0);
  const [couponCode, setCouponCode] = React.useState("");
  const [mobileNumber, setMobileNumber] = React.useState("");
  const steps = [
    `Coupon Code${couponCode ? " ( ₹" + couponCode + ")" : ""}`,
    `Mobile Number${mobileNumber ? " (" + mobileNumber + ")" : ""}`,
    "Payment",
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
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
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
          />
        )}
        {activeStep == 1 && (
          <EmailForm
            handleNext={handleNext}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setMobileNumber={setMobileNumber}
            steps={steps}
          />
        )}
        {activeStep == 2 && (
          <PaymentOption
            handleNext={handleNext}
            activeStep={activeStep}
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
