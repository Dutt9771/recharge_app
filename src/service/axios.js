
import LocalStorage from "./localStorage";
import { BASE_URL } from "../constants";
import { store } from "../redux/store";
import { toast } from "react-toastify";
import axios from "axios";
let flag = false;

const showToastMassage = () => {
  if (!flag) {
    toast.error("Your session has expired. Please login again.");
    flag = !flag;
    setTimeout(() => {
      flag = !flag;
    }, 5000);
  }
};

const showToastMassagePermition = (message) => {
  if (!flag) {
    toast.error(message);
    flag = !flag;
    setTimeout(() => {
      flag = !flag;
    }, 5000);
  }
};

const Axios = axios.create({
  baseURL: BASE_URL,
});

Axios.interceptors.request.use(
  (req) => {
    req.headers = {
      ...req.headers,
      Authorization: `Bearer ${LocalStorage.getItem("accessToken")}`,
    };

    return req;
  },
  (err) => {
    return Promise.reject(err);
  }
);

Axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response.status === 401) {
      showToastMassage();
      // store.dispatch(logOutUser());
      return Promise.reject(err);
    }
    if (err.response.status === 404) {
      return Promise.reject(err);
    }
    if (err.response.status === 400) {
      //   if (
      //     err.response.data.message ===
      //     "User is not authorized for this operation"
      //   ) {
      //     toast.error(err.response.data.message);
      //   } else {
      showToastMassagePermition(err.response.data.message);
      //   }
      return Promise.reject(err);
    }
    // toast.error(err.response.data.message);
    return Promise.reject(err);
  }
);

export { Axios };
