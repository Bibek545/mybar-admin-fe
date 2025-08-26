import axios from "axios";
import { toast } from "react-toastify";
import { renewAccessJWTApi } from "./authAPI";
// import {  renewAccessJWTApi } from "./authAPI";

const getAccessJWT = () => {
  return localStorage.getItem("accessJWT");
};
const getRefreshJWt = () => {
  return localStorage.getItem("refreshJWT");
};

// apiProcessor is a helper to make API calls easier and less repetitive
export const apiProcessor = async ({
  url,
  method,
  payload,
  showToast,
  isPrivateCall,
  isRefreshJWT,
}) => {
  try {
    const headers = {};

    if (isPrivateCall) {
      const token = isRefreshJWT ? getRefreshJWt() : getAccessJWT();
      headers.authorization = "Bearer " + token;
    }
    // You can use GET, POST, PUT, PATCH, DELETE
    const responsePending = axios({
      url, // endpoint (e.g. "/api/v1/bookings")
      method, // "get", "post", etc.
      data: payload,
      headers, // data to send (for POST/PUT/PATCH)
    });

    if (showToast) {
      toast.promise(responsePending, {
        pending: "Please wait ....",
      });
    }

    const { data } = await responsePending;
    showToast && toast[data.status](data.message);
    return data; // Return just the response data
  } catch (error) {
    // If there's an error (network, server, etc), show it in console
    console.error(error);

    // Try to show a user-friendly message
    const msg = error?.response?.data?.message || error.message;
    // ||
    // "Something went wrong.";

    showToast && toast.error(msg);
    if (error.status === 401 && msg === "jwt expired") {
      // call api to get new accessJWT

      const { payload } = await renewAccessJWTApi();

      if (payload) {
        sessionStorage.setItem("accessJWT", payload);
      }
      //call the api processor
      return apiProcessor({
        url,
        method,
        payload,
        showToast,
        isPrivateCall,
        isRefreshJWT,
      });
    } else if (
      error?.response?.status === 401 ||
      error?.response?.status === 403 ||
      msg.toLowerCase().includes("jwt") ||
      msg.toLowerCase().includes("token")
    ) {
      // Only remove tokens on true auth errors
      localStorage.removeItem("accessJWT");
      localStorage.removeItem("refreshJWT");
    }

    // Return an error object so your component can display the message
    return {
      status: "error",
      message: msg,
    };
  }
};
