import { useContext, useEffect, useState } from "react";
 
import axios from "axios";
import { UserContext } from "../../context/UserContextProvider";
import { convertTo12HourFormat, formatDate } from "../utils/scheduleFormatter";
import { time } from "framer-motion";
const useFetchPatientMedicalRecord = () => {
    const [recordDetails, setRecordDetails] = useState([]);
    const { loading, setLoading } = useContext(UserContext);
    const apiUrl = import.meta.env.VITE_APP_KEY;
    const userId = localStorage.getItem("currentUserId");
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${apiUrl}/api/patients/${userId}/appointments`, {
                    headers: {
                        "ngrok-skip-browser-warning": "s",
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                        "Content-Type": "application/json",
                    },
                });
                // تصفية الحجوزات حسب visit_type: "online"
                console.log("filteredBookings", response.data.data);
                const data = Array.isArray(response.data.data[0]) ? response.data.data[0] : response.data.data;
                const filteredBookings = data
                    .filter(item => item.visit_type === "locale")
                    .map((item)=>({
                        id:item.id,
                        clinicName: item.clinic_name,
                        date: formatDate(item.date),
                        time: convertTo12HourFormat(item.time),
                        report: item.report,
                        prescription: item.prescription,
                        anotherFile: item.another_files && item.another_files.length > 0 ? item.another_files.map((file) => ({
                            fileUrl: file.file_path,
                            fileExtension: file.extension,
                            publicId: file.public_id,
                        })) : null,
                        patientNote: item.patient_note || null,
                        appointmentNote: item.appointment_note || null,
                        quickNote: item.quick_note,

                    }));
                setRecordDetails(filteredBookings);
                console.log("filteredBookings", filteredBookings);
            } catch (error) {
                console.error("خطأ في جلب الحجوزات:", error);
                setRecordDetails([]); // إذا حدث خطأ، أعد تعيين القائمة لتكون فارغة
            } finally {
                setLoading(false);
            }
        }
        fetchBooking();
    }, [apiUrl, userId]);

    return { recordDetails, loading }
}
export default useFetchPatientMedicalRecord;
