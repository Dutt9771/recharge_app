import React from "react";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import "./CoupenCode.css";
function CouponCode({ handleNext, activeStep, steps }) {
  const cardArr = [
    {
      title: "100",
      description: "Coins",
      amount: "500",
    },
    {
      title: "100",
      description: "Coins",
      amount: "500",
    },
    {
      title: "100",
      description: "Coins",
      amount: "500",
    },
    {
      title: "100",
      description: "Coins",
      amount: "500",
    },
    {
      title: "100",
      description: "Coins",
      amount: "500",
    },
    {
      title: "100",
      description: "Coins",
      amount: "500",
    },
  ];
  return (
    <div>
      <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
      {/* <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        alignItems="center"
        justifyContent="center"
      > */}
      <div className="custom-container-productlist">
        {cardArr?.map((item, index) => (
          //   <Grid item xs={4} sm={4} md={3} lg={2}>
          <div className={`custom-card-productlist`} key={index}>
            <Card>
              <img
                src="/assets/images/coin.png"
                alt=""
                style={{ width: "45px" }}
              />
              <Typography sx={{ mt: 2, mb: 1 }}>{item?.title}</Typography>
              <Typography sx={{ mt: 2, mb: 1 }}>{item?.amount}</Typography>
              <Button onClick={handleNext} class="button-75" role="button">
                <span class="text">Apply</span>
              </Button>
            </Card>
          </div>
          //   </Grid>
        ))}
      </div>
      {/* </Grid> */}
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

        <Button onClick={handleNext} class="button-75" role="button">
          <span class="text">
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </span>
        </Button>
      </Box>
    </div>
  );
}

export default CouponCode;
