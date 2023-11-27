import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import "./CoupenCode.css";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import ImageLoader from "./ImageLoader";
import { toast } from "react-toastify";
function CouponCode({ handleNext, activeStep, steps, setCouponCode }) {
  const [coupenCodeArr, setCoupenCodeArr] = useState([]);
  const [isAppliedId, setIsAppliedId] = useState("");
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [pageLoading, setPageLoading] = React.useState(true);

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
        if(response?.success){
          setCoupenCodeArr(response?.data?.length > 0 ? response?.data : []);
          setPageLoading(false);
        }else{
          setCoupenCodeArr(response?.data?.length > 0 ? response?.data : []);
        }
      })
      .catch((err) =>
        toast.error(err?.message ? err?.message : "Something Went Wrong")
      );
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
    setCouponCode(item ? item : "");
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
      {pageLoading ? (
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <CircularProgress size={40} style={{ color: "#3f51b5" }} />
        </div>
      ) : (
        <>
          <div className="custom-container-productlist">
            {coupenCodeArr?.length > 0 &&
              coupenCodeArr?.map((item, index) => (
                //   <Grid item xs={4} sm={4} md={3} lg={2}>
                <div className={`custom-card-productlist`} key={index}>
                  <Card style={{ padding: "20px" }}>
                    <ImageLoader
                      src="/assets/images/coin.png"
                      alt=""
                      style={{
                        width: "45px",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                      progressbar_style={{
                        top: "0%",
                        left: "42%",
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
          <Container maxWidth={isSmallScreen ? "xs" : "lg"}>
            <Button
              onClick={handleNext}
              class="button-75"
              role="button"
              style={{
                marginLeft: "auto",
                marginTop: "15px",
                opacity: isAppliedId == "" ? "0.6" : "",
                pointerEvents: isAppliedId == "" ? "none" : "auto",
              }}
            >
              <span class="text">
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </span>
            </Button>
          </Container>
        </>
      )}
      {/* </Grid> */}
    </div>
  );
}

export default CouponCode;
