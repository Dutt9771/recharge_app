import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "./Header";
import { Card, Container, Typography, useMediaQuery } from "@mui/material";

function PaymentCallback() {
  const navigate = useNavigate();
  const [payment, setPayment] = useState("");
  const [coupen, setCoupenCode] = useState(
    JSON.parse(localStorage.getItem("cd"))
      ? JSON.parse(localStorage.getItem("cd"))
      : ""
  );
  const [isResponse, setIsResponse] = useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [authToken, setAuthToken] = useState(
    JSON.parse(localStorage.getItem("at"))
      ? JSON.parse(localStorage.getItem("at"))
      : ""
  );
  const [merchantId, setMerchantId] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // Accessing individual query parameters
  useEffect(() => {
    getStatus();
    // const merchantIdData = localStorage.getItem("mi") || "";
    // const mi = merchantIdData ? JSON.parse(merchantIdData) : "";
    // if (mi) {
    //   setMerchantId(mi);
    // }
    // const transactionId = localStorage.getItem("td");
    // const td = transactionId ? JSON.parse(transactionId) : "";
    // if (td) {
    //   setTransactionId(td);
    // }
  }, []);
  const getStatus = () => {
    const transaction_queryparams = queryParams.get("transaction");
    // console.log("authToken: ", authToken);
    // console.log("transaction_queryparams: ", transaction_queryparams);

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        transactionId: transaction_queryparams,

        // merchantId: JSON.parse(localStorage.getItem("mi"))
        //   ? JSON.parse(localStorage.getItem("mi"))
        //   : "",
      }),
    };
    fetch(
      "https://us-central1-influencer-ea69f.cloudfunctions.net/app/api/v1/api/status",
      options
    )
      .then((response) => response.json())
      .then((response) => {
        // console.log("response: ", response);
        if (response?.success) {
          setPayment(response?.data);
          // toast.success(response?.message);
          paymentStore(response?.data, 2);
        } else {
          toast.error(
            response?.message ? response?.message : "Something Went Wrong"
          );
        }
      })
      .catch((err) => {
        toast.error(err?.message ? err?.message : "Something Went Wrong");
      });
  };
  const paymentStore = (response, status) => {
    const coupenCode = JSON.parse(
      localStorage.getItem("cd") ? localStorage.getItem("cd") : ""
    );
    // console.log("coupenCode: ", coupenCode);
    const options = {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        transactionId: response?.merchantTransactionId
          ? response?.merchantTransactionId
          : "",
        // status:"success",
        status: 2,
        phonepayStatus: "success",
        coin: coupenCode ? coupenCode : "",
      }),
    };

    fetch(
      "https://us-central1-influencer-ea69f.cloudfunctions.net/app/api/v1/api/transaction",
      options
    )
      .then((response) => response.json())
      .then((response) => {
        toast.success("Your Payment is Successfull");
        navigate("/");
      })
      .catch((err) =>
        toast.error(err?.message ? err?.message : "Something Went Wrong")
      );
  };
  return (
    <>
      <Header />
      <Container maxWidth={"xs"} style={{ marginTop: "15px" }}>
        <Card style={{ padding: "20px" }}>
          <img
            src="/assets/images/check.png"
            alt=""
            style={{
              width: isSmallScreen ? "100px" : "150px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
          <Container maxWidth={"xs"} style={{ marginTop: "20px" }}>
            {payment?.responseCode && (
              <Typography sx={{ mt: 2, mb: 1 }} style={{ textAlign: "left" }}>
                Payment : {payment?.responseCode ? payment?.responseCode : ""}
              </Typography>
            )}
            {payment?.merchantId && (
              <Typography sx={{ mt: 2, mb: 1 }} style={{ textAlign: "left" }}>
                Merchant Id : {payment?.merchantId ? payment?.merchantId : ""}
              </Typography>
            )}
            {payment?.merchantTransactionId && (
              <Typography sx={{ mt: 2, mb: 1 }} style={{ textAlign: "left" }}>
                TransactionId :{" "}
                {payment?.merchantTransactionId
                  ? payment?.merchantTransactionId
                  : ""}
              </Typography>
            )}
            {payment?.amount && (
              <Typography sx={{ mt: 2, mb: 1 }} style={{ textAlign: "left" }}>
                Amount : ₹{payment?.amount / 100 ? payment?.amount / 100 : ""}
              </Typography>
            )}
          </Container>
        </Card>
      </Container>
    </>
  );
}

const componentConfig = {
  component: PaymentCallback,
  path: "/recharge/payment/callback",
  // public: false,
  //   layout: DashboardLayout,
  // roles: ["admin"],
  // group: null,
  //   sidebar: false,
};

export default componentConfig;
