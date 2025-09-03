// services/uploadAPI.js (optional)
import axios from "axios";

export const uploadEventImageApi = async (file) => {
  const form = new FormData();
  form.append("image", file);
  const { data } = await axios.post("/api/v1/upload/event-image", form, {
    headers: { "Content-Type": "multipart/form-data" },
    // if your axios is not already attaching auth headers, include the token here
  });
  return data; // { status, url }
};
