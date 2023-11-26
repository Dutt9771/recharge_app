import React, { useEffect, useState } from "react";
import { Box, Button, Card, Typography } from "@mui/material";
import "./PaymentOption.css";
function PaymentOption({ handleNext, activeStep, steps, setActiveStep }) {
  const [authToken, setAuthToken] = useState("");
  const [amount, setAmount] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const [restricted, setRestricted] = useState(false);
  function generateRandomText() {
    const randomDigits = Math.floor(Math.random() * 1000000000); // Generate a random 9-digit number
    const randomText = `TX${randomDigits}`;
    console.log('randomText: ', randomText);
    return randomText;
  }

  useEffect(() => {
    setTransactionId(JSON.parse(localStorage.getItem("td")));
    setAmount(JSON.parse(localStorage.getItem("am")));
    setAuthToken(JSON.parse(localStorage.getItem("at")));
    setRestricted(JSON.parse(localStorage.getItem("rt")));
  }, []);
  const Pay = () => {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify({
        transactionId: generateRandomText(),
        // amount: amount ? amount * 100 : 0,
        amount: 100,
      }),
    };

    fetch(
      "https://us-central1-influencer-ea69f.cloudfunctions.net/app/api/v1/api/payment",
      options
    )
      .then((response) => response.json())
      .then((response) => {
        console.log("response: ", response);
        window.open(
          response?.message?.data?.instrumentResponse?.redirectInfo?.url
        );
        if (response && response?.data) {
          localStorage.setItem("td", JSON.stringify(response?.data?.))
          localStorage.setItem("mi", JSON.stringify(response?.data?.))
        }
      })
      .catch((err) => console.error(err));
    // setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "25px" }}
      >
        <Card
          style={{
            width: "200px",
            padding: "20px",
            backgroundColor: "#5f259e",
          }}
        >
          <img
            src="/assets/images/phonepay.jpg"
            alt=""
            style={{
              width: "160px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
          <Typography
            sx={{ mt: 2, mb: 1 }}
            style={{
              textAlign: "center",
              color: "white",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            Pay via PhonePay
          </Typography>
          <Button
            onClick={Pay}
            className="button-75"
            role="button"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            <span className="text">Pay</span>
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default PaymentOption;
