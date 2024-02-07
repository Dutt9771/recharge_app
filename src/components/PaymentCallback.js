import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "./Header";
import {
  Card,
  CircularProgress,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { BaseUrl } from "../BaseUrl";

function PaymentCallback() {
  let apiCallCount = 0;
  const navigate = useNavigate();
  const [payment, setPayment] = useState("");
  const [reCallApi, setReCallApi] = useState(false);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (reCallApi) {
      setInterval(() => {
        if (apiCallCount >= 0 && apiCallCount < 2) {
          setLoading(true);
          apiCallCount++;
          getStatus();
        }
      }, 10000);
    }
  }, [reCallApi]);

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
    fetch(`${BaseUrl}/api/status`, options)
      .then((response) => response.json())
      .then((response) => {
        if (
          response?.code == "PAYMENT_SUCCESS" ||
          response?.code == "PAYMENT_ERROR"
        ) {
          setPayment(response);
          setReCallApi(false);
          setLoading(false);
          apiCallCount = -1;
          toast.success(response?.message);
          // paymentStore(response, 2);
          setTimeout(() => {
            navigate("/");
            localStorage.clear();
          }, 5000);
        } else {
          if (
            response?.message != "User is not authorized for this operation" &&
            payment?.code == "PAYMENT_PENDING"
          ) {
            if (apiCallCount >= 2) {
              apiCallCount = -1;
              setPayment(response);
              setReCallApi(false);
              setLoading(false);
              toast.error(
                response?.message ? response?.message : "Something Went Wrong"
              );
              navigate("/");
              localStorage.clear();
            } else {
              setPayment(response);
              setLoading(false);
              setReCallApi(true);
              toast.error(
                response?.message ? response?.message : "Something Went Wrong"
              );
            }
          } else {
            toast.error(
              response?.message ? response?.message : "Something Went Wrong"
            );
            navigate("/");
            localStorage.clear();
          }
          // toast.error(
          //   response?.message ? response?.message : "Something Went Wrong"
          // );
          // setTimeout(() => {
          //   navigate("/");
          //   localStorage.clear();
          // }, 5000);
        }
      })
      .catch((err) => {
        toast.error(err?.message ? err?.message : "Something Went Wrong");
        setTimeout(() => {
          navigate("/");
          localStorage.clear();
        }, 5000);
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
        transactionId: response?.data?.merchantTransactionId
          ? response?.data?.merchantTransactionId
          : "",
        // status:"success",
        status: 2,
        phonepeStatus: response?.code ? response?.code : "",
        coin: coupenCode?.id ? coupenCode?.id : "",
      }),
    };

    fetch(`${BaseUrl}/api/transaction`, options)
      .then((response) => response.json())
      .then((response) => {
        toast.success("Your Payment is Successfull");
        localStorage.clear();
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
          {loading ? (
            <CircularProgress
              size={25}
              style={{
                color: "black",
                display: "flex",
                marginLeft: "auto",
                marginRight: "auto",
                // marginTop: "20px",
              }}
            />
          ) : (
            <Container maxWidth={"xs"} style={{ marginTop: "20px" }}>
              {payment?.code && (
                <img
                  src={
                    payment?.code == "PAYMENT_SUCCESS"
                      ? "/assets/images/check.png"
                      : payment?.code == "PAYMENT_PENDING"
                      ? "/assets/images/pending.png"
                      : "/assets/images/failed.png"
                  }
                  alt=""
                  style={{
                    width: isSmallScreen ? "100px" : "150px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                />
              )}
              {payment?.code && (
                <Typography sx={{ mt: 2, mb: 1 }} style={{ textAlign: "left" }}>
                  Payment :{" "}
                  {payment?.code == "PAYMENT_SUCCESS"
                    ? "Success"
                    : payment?.code == "PAYMENT_PENDING"
                    ? "Pending"
                    : "Failed"}
                </Typography>
              )}
              {payment?.data?.merchantId && (
                <Typography sx={{ mt: 2, mb: 1 }} style={{ textAlign: "left" }}>
                  Merchant Id :{" "}
                  {payment?.data?.merchantId ? payment?.data?.merchantId : "-"}
                </Typography>
              )}
              {payment?.data?.merchantTransactionId && (
                <Typography sx={{ mt: 2, mb: 1 }} style={{ textAlign: "left" }}>
                  TransactionId :{" "}
                  {payment?.data?.merchantTransactionId
                    ? payment?.data?.merchantTransactionId
                    : "-"}
                </Typography>
              )}
              {payment?.data?.amount && (
                <Typography sx={{ mt: 2, mb: 1 }} style={{ textAlign: "left" }}>
                  Amount : ₹
                  {payment?.data?.amount / 100
                    ? payment?.data?.amount / 100
                    : "-"}
                </Typography>
              )}
            </Container>
          )}
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
