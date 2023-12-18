import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "./Header";
import {
  Button,
  Card,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { BaseUrl } from "../BaseUrl";

function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([
    {
      title: "Coupon added",
      transaction_method: "Purchase",
      transaction_description: "Coupon",
      transaction_status: "Success",
      transaction_date: "12/1/2023, 03:15:32 PM",
      amount: "1000",
      transaction_type: "+ Credit",
    },
    {
      title: "Coupon added",
      transaction_method: "Purchase",
      transaction_description: "Coupon",
      transaction_status: "Success",
      transaction_date: "12/1/2023, 03:15:32 PM",
      amount: "8000",
      transaction_type: "+ debit",
    },
    {
      title: "Coupon added",
      transaction_method: "Purchase",
      transaction_description: "Coupon",
      transaction_status: "Success",
      transaction_date: "20/01/2023, 09:09:32 PM",
      amount: "3000",
      transaction_type: "+ debit",
    },
    {
      title: "Coupon added",
      transaction_method: "Purchase",
      transaction_description: "Coupon",
      transaction_status: "Pending",
      transaction_date: "01/10/2023, 03:15:32 PM",
      amount: "5000",
      transaction_type: "+ Credit",
    },
  ]);
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
  //   useEffect(() => {
  //   getStatus();
  //   }, []);
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
        // console.log("response: ", response);
        if (response?.success) {
          //   setPayment(response?.data);
          // toast.success(response?.message);
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
  return (
    <>
      <Header />
      <Container
        maxWidth={isSmallScreen ? "xs" : "sm"}
        style={{ marginTop: "15px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{ mt: 2, mb: 1 }}
            style={{
              marginTop: isSmallScreen ? "10px" : "25px",
              marginBottom: isSmallScreen ? "15px" : "25px",
              fontSize: isSmallScreen ? "larger" : "x-large",
              textAlign: "center",
            }}
          >
            Transactions
          </Typography>
          <Button
            onClick={() => navigate("/")}
            className="button-75"
            role="button"
            style={{ marginTop: "auto", marginBottom: "auto" }}
          >
            Back
          </Button>
        </div>
        {transactions?.length > 0 ? (
          transactions?.map((item) => (
            <Card style={{ padding: "20px", marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {item?.title && (
                  <Typography
                    sx={{ mt: 2, mb: 1 }}
                    style={{
                      textAlign: "left",
                      marginTop: "5px",
                      marginBottom: "5px",
                      fontSize: isSmallScreen ? "small" : "",
                    }}
                  >
                    {item?.title ? item?.title : ""}
                  </Typography>
                )}
                {item?.transaction_type && (
                  <Typography
                    sx={{ mt: 2, mb: 1 }}
                    style={{
                      textAlign: "left",
                      marginTop: "5px",
                      marginBottom: "5px",
                      fontSize: isSmallScreen ? "small" : "",
                    }}
                  >
                    {item?.transaction_type ? item?.transaction_type : ""}
                  </Typography>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {item?.transaction_status && (
                  <Typography
                    sx={{ mt: 2, mb: 1 }}
                    style={{
                      textAlign: "left",
                      marginTop: "5px",
                      marginBottom: "5px",
                      fontSize: isSmallScreen ? "small" : "",
                    }}
                  >
                    {item?.transaction_status ? item?.transaction_status : ""}
                  </Typography>
                )}
                {item?.transaction_date && (
                  <Typography
                    sx={{ mt: 2, mb: 1 }}
                    style={{
                      textAlign: "left",
                      marginTop: "auto",
                      marginBottom: "auto",
                      fontSize: isSmallScreen ? "x-small" : "",
                    }}
                  >
                    {item?.transaction_date ? item?.transaction_date : ""}
                  </Typography>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {item?.transaction_description && (
                  <Typography
                    sx={{ mt: 2, mb: 1 }}
                    style={{
                      textAlign: "left",
                      marginTop: "5px",
                      marginBottom: "5px",
                      fontSize: isSmallScreen ? "small" : "",
                    }}
                  >
                    {item?.transaction_description
                      ? item?.transaction_description
                      : ""}
                  </Typography>
                )}
                {item?.amount && item?.transaction_method && (
                  <div style={{ display: "flex" }}>
                    <Typography
                      sx={{ mt: 2, mb: 1 }}
                      style={{
                        textAlign: "left",
                        marginTop: "5px",
                        marginBottom: "5px",
                        fontSize: isSmallScreen ? "small" : "",
                        marginRight: "15px",
                      }}
                    >
                      {item?.transaction_method ? item?.transaction_method : ""}
                    </Typography>
                    <Typography
                      sx={{ mt: 2, mb: 1 }}
                      style={{
                        textAlign: "left",
                        marginTop: "5px",
                        marginBottom: "5px",
                        fontSize: isSmallScreen ? "small" : "",
                      }}
                    >
                      {item?.amount ? item?.amount : ""}
                    </Typography>
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Typography
            sx={{ mt: 2, mb: 1 }}
            style={{
              textAlign: "center",
              marginTop: "25px",
              marginBottom: "5px",
              fontSize: isSmallScreen ? "small" : "",
            }}
          >
            No Records Found
          </Typography>
        )}
      </Container>
    </>
  );
}

const componentConfig = {
  component: Transactions,
  path: "/recharge/transactions",
  // public: false,
  //   layout: DashboardLayout,
  // roles: ["admin"],
  // group: null,
  //   sidebar: false,
};

export default componentConfig;
