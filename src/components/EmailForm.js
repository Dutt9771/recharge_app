import React from "react";
import { Box, Button, Typography } from "@mui/material";

function EmailForm({ handleNext, activeStep, steps }) {
  return (
    <div>
      <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
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
