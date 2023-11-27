import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function PaymentCallback() {
  const [transactionId, setTransactionId] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [transaction, setTransaction] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Accessing individual query parameters
  const transaction_queryparams = queryParams.get("transaction");
  useEffect(() => {
    setTransaction(transaction_queryparams);
    const merchantIdData = localStorage.getItem("mi") || "";
    const mi = merchantIdData ? JSON.parse(merchantIdData) : "";
    if (mi) {
      setMerchantId(mi);
    }
    const transactionId = localStorage.getItem("td");
    const td = transactionId ? JSON.parse(transactionId) : "";
    if (td) {
      setTransactionId(td);
    }
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify({
        transactionId: JSON.parse(localStorage.getItem("td"))
          ? JSON.parse(localStorage.getItem("td"))
          : "",
        merchantId: JSON.parse(localStorage.getItem("mi"))
          ? JSON.parse(localStorage.getItem("mi"))
          : "",
      }),
    };

    fetch(
      "https://us-central1-influencer-ea69f.cloudfunctions.net/app/api/v1/api/status",
      options
    )
      .then((response) => response.json())
      .then((response) => {
        console.log("response: ", response);
      })
      .catch((err) => console.error(err));
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get(
    //       "https://us-central1-influencer-ea69f.cloudfunctions.net/app/api/v1/api/status",{
    //       data:{
    //         transactionId: JSON.parse(localStorage.getItem("td"))
    //           ? JSON.parse(localStorage.getItem("td"))
    //           : "",
    //         merchantId: JSON.parse(localStorage.getItem("mi"))
    //           ? JSON.parse(localStorage.getItem("mi"))
    //           : "",
    //       }}
    //     );

    //     // Handle the data from the response
    //     console.log("Response data:", response.data);
    //   } catch (error) {
    //     // Handle errors
    //     console.error("Error fetching data:", error.message);
    //   }
    // };
    // fetchData();
    // setActiveStep((prevActiveStep) => prevActiveStep + 1
  }, []);

  return <div>Payment CallBack {transaction}</div>;
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
