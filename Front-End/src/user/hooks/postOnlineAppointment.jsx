import axios from "axios";

const apiUrl =import.meta.env.VITE_APP_KEY;
export const postOnlineAppointment = async (doctorId, appointmentData) => {
  try {
    const response = await axios.post(
      `${apiUrl}/doctors/${doctorId}/appointments`,
      appointmentData,
      {
        headers: {
          "ngrok-skip-browser-warning": "s",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("stripe",response.data);
    return response.data; // Return the API response
  } catch (error) {
    console.error("Error posting appointment:", error.response || error);

    // إذا كان هناك خطأ من الخادم
    if (error.response) {
      console.error("Server Error:", error.response.data);
      throw new Error(error.response.data.message || "Server error occurred.");
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error occurred.");
    }
  }
};
