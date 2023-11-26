import React, { useEffect, useState } from "react";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import "./CoupenCode.css";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
function CouponCode({ handleNext, activeStep, steps, setCouponCode }) {
  const [coupenCodeArr, setCoupenCodeArr] = useState([]);
  const [isAppliedId, setIsAppliedId] = useState("");

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };

    fetch(
      "https://us-central1-influencer-ea69f.cloudfunctions.net/app/api/v1/coupons",
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setCoupenCodeArr(response?.data?.length > 0 ? response?.data : []);
      })
      .catch((err) => console.error(err));
  }, []);
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
  const apply = (item) => {
    setIsAppliedId(item?.id ? item?.id : "");
    console.log("item: ", item);
    setCouponCode(item?.data?.price ? item?.data?.price : "");
    // setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  return (
    <div>
      {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
      {/* <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        alignItems="center"
        justifyContent="center"
      > */}
      <div className="custom-container-productlist">
        {coupenCodeArr?.length > 0 &&
          coupenCodeArr?.map((item, index) => (
            //   <Grid item xs={4} sm={4} md={3} lg={2}>
            <div className={`custom-card-productlist`} key={index}>
              <Card style={{ padding: "20px" }}>
                <img
                  src="/assets/images/coin.png"
                  alt=""
                  style={{
                    width: "45px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                />
                <Typography
                  sx={{ mt: 2, mb: 1 }}
                  style={{ textAlign: "center" }}
                >
                  {item?.data?.name}
                </Typography>
                <Typography
                  sx={{ mt: 2, mb: 1 }}
                  style={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CurrencyRupeeRoundedIcon
                    style={{ height: "17px", width: "auto" }}
                  />
                  <span>{item?.data?.price}</span>
                </Typography>
                <Button
                  onClick={() => apply(item)}
                  className="button-75"
                  role="button"
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    color: "white",
                    opacity: isAppliedId == item?.id ? "0.6" : "1.0",
                  }}
                  disabled={isAppliedId == item?.id}
                >
                  <span className="text" style={{ color: "white" }}>
                    {isAppliedId == item?.id ? "Applied" : "Apply"}
                  </span>
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
