import { apiProcessor } from "../services/api.jsx";

// const apiBaseURL = "http://localhost:8040";
// const apiBaseURL = "http://thp-admin-be-env.eba-pejytbmb.ap-southeast-2.elasticbeanstalk.com";
const apiBaseURL = "https://mybar-admin-be.onrender.com"
const authApiEP = apiBaseURL + "/api/v1/admin/auth";

export const loginAdminApi = async (payload) => {
  const obj = {
    url: authApiEP + "/login",
    method: "post",
    payload,
    showToast: true,
  };
  return apiProcessor(obj);
};

//request new accessJWT api
// export const fetchNewAcessJWTApi = async () => {
//   const obj = {
//     url: authApiEP + "/renew-jwt",
//     method: "get",
//     isPrivateCall: true,
//     isRefreshJWt: true,
//   };

//   return apiProcessor(obj);
// };

export const renewAccessJWTApi = async ({ refreshJWT }) => {
  const obj = {
    url: authApiEP + "/renew-jwt",
    method: "post",
    payload: { refreshJWT },
    showToast: false,
  };
  return apiProcessor(obj);
};

//logout

export const logoutApi = () => {
  const obj = {
    url: authApiEP + "/logout",
    method: "get",
    isPrivateCall: true,
  };
  return apiProcessor(obj);
};

// bookings
export const fetchBookingsApi = async () => {
  const obj = {
    url: authApiEP + "/booking",
    method: "get",
    isPrivateCall: true,
    showToast: true,
  };
  return apiProcessor(obj);
};

// update bookings
export const updateStatusApi = async (id, status) => {
  const obj = {
    url: authApiEP + `/booking/${id}/status`,
    method: "patch",
    payload: { status },
    isPrivateCall: true,
    showToast: true,
  };
  return apiProcessor(obj);
};

// delete bookings
export const deleteBookingApi = async (id) => {
  const obj = {
    url: authApiEP + `/booking/${id}`,
    method: "delete",
    isPrivateCall: true,
    showToast: true,
  };
  return apiProcessor(obj);
};
// menu
export const fetchMenuItemsApi = async () => {
  const obj = {
    url: authApiEP + "/menu",
    method: "get",
    isPrivateCall: true,
    showToast: true,
  };
  return apiProcessor(obj);
};

//adding menu
export const addMenuItemApi = async (payload) => {
  const obj = {
    url: authApiEP + "/menu",
    method: "post",
    payload,
    isPrivateCall: true,
    showToast: true,
  };
  return apiProcessor(obj);
};

// edit menu

export const editMenuItemApi = async (id,payload) => {
  const obj = {
  url: authApiEP + `/menu/${id}`,
    method: "patch",
     payload,
    isPrivateCall: true,
    showToast: true,
  };
  return apiProcessor(obj);
};

//deletemenu
export const deleteMenuItemApi = async (id) => {
  const obj = {
    url: authApiEP + `/menu/${id}`,
    method: "delete",
    isPrivateCall: true,
    showToast: true,
  };
  return apiProcessor(obj);
};



// getting the events
export const fetchEventsApi = async ()=> {
  const obj = {
    url: authApiEP + "/events",
    method: "get",
    isPrivateCall: true,
    showToast: true,
  };
  return apiProcessor(obj);
};

//adding the new event
export const addEventApi = async (payload)=> {
  const obj = {
    url: authApiEP + `/events`,
    method: "post",
    payload,
    isPrivateCall: true,
    showToast: true,
  };
  return apiProcessor(obj)
};

//editing the events
export const editEventApi = async (id, payload)=> {
  const obj = {
    url: authApiEP + `/events/${id}`,
    method: "patch",
     payload,
    isPrivateCall: true,
    showToast: true,
  };
  return apiProcessor(obj)
};

export const deleteEventApi = async (id)=> {
  const obj = {
    url: authApiEP + `/events/${id}`,
    method: "delete",
    isPrivateCall: true,
    showToast: true,
  };
  return apiProcessor(obj);
};
// getting the events
export const fetchUsersApi = async ()=> {
  const obj = {
    url: authApiEP + "/users",
    method: "get",
    isPrivateCall: true,
    showToast: true,
  };
  return apiProcessor(obj);
};

export const fetchSingleUserApi = async (id)=> {
  const obj = {
    url: authApiEP + `/users/${id}`,
    method: "get",
    isPrivateCall: true,
    showToast: true,
  };
  return apiProcessor(obj)
};

//adding the new event
export const addUserApi = async (payload)=> {
  const obj = {
    url: authApiEP + `/users`,
    method: "post",
    payload,
    isPrivateCall: true,
    showToast: true,
  };
  return apiProcessor(obj)
};

//editing the events
export const editUserApi = async (id, payload)=> {
  const obj = {
    url: authApiEP + `/users/${id}`,
    method: "patch",
     payload,
    isPrivateCall: true,
    showToast: true,
  };
  return apiProcessor(obj)
};

export const deleteUserApi = async (id)=> {
  const obj = {
    url: authApiEP + `/users/${id}`,
    method: "delete",
    isPrivateCall: true,
    showToast: true,
  };
  return apiProcessor(obj);
};

// fe†ching the reports
export const fetchReportStatsApi = ()=> {
  const obj = {
   url: authApiEP + "/reports/booking-stats",
   method: "get",
   isPrivateCall: true,
  };
  return apiProcessor(obj);
};

export const getAdminProfile = () => {
  const obj = {
    url: authApiEP + "/admin-profile",
    method: "get",
    isPrivateCall: true,
  };
  return apiProcessor(obj);
};

export const updateAdminProfile = (payload) => {
  const obj = {
    url: authApiEP +  "/admin-profile",
    method: "put",
    isPrivateCall: true,
    payload,
  };
  return apiProcessor(obj);
};