import { fetchNewAcessJWTApi } from "../../services/authAPI.jsx";
import { fetchUserAPI } from "../user/userApi.js";
import { setUser } from "../user/userSlice.js";

export const fetchUserAction = () => async (dispatch) => {
  //call api
  const {status, payload} = await fetchUserAPI();

//   console.log(userInfo);
  //receivev the user

  //dispatch the user to redux store

  status === "success" && payload?._id && dispatch(setUser(payload));
};

export const autoLoginUser = () => async (dispatch) => {
    const accessJWT = sessionStorage.getItem("accessJWT")
    if(accessJWT) {
        dispatch(fetchUserAction());
        return;
    }

    const refreshJWT = localStorage.getItem("refreshJWT")
    if(refreshJWT) {
        //fetch accessJWT and set it in the sessionstorage

        const {payload} = await fetchNewAcessJWTApi();

        if(payload) {
            sessionStorage.setItem("accessJWT", payload);
            dispatch(fetchUserAction());

        }
        

        //dispatch the fetch useraction
    };
};