import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// هوك لإكمال الحجز
const useCompleteAppointment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const apiUrl = import.meta.env.VITE_APP_KEY;

    const completeAppointmentNote = async (completeData, appointmentId) => {
        setLoading(true);
        setError(null);
        console.log("🔵 البيانات المرسلة في FormData:");
        for (let pair of completeData.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            const response = await axios.post(
                `${apiUrl}/api/appointments/${appointmentId}/mark-complete`,
                completeData,
                {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );

            console.log("✅ استجابة الـ API:", response);

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.error("❌ خطأ أثناء إرسال الطلب:", error.response?.data || error);
            setError(error);

            Swal.fire({
                icon: "error",
                title: "خطأ",
                text: error.response?.data?.message || "حدث خطأ أثناء حفظ التعديلات. يرجى المحاولة مرة أخرى.",
            });
        } finally {
            setLoading(false);
        }
    };
    const completeAppointmentReport = async (report, appointmentId) => {
        setLoading(true);
        setError(null);
        const reportData = new FormData();
        reportData.append("appointment_id", appointmentId); 

        // **إضافة الملفات إلى `FormData`**
        report.forEach((file) => reportData.append("report_file", file));

        for (let pair of reportData.entries()) {
            console.log(pair[0], pair[1]);
        }


        try {
            const response = await axios.post(
                `${apiUrl}/api/reports`,
                reportData,
                {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );


                console.log("succ reposrt");
                return "200";
            
        } catch (error) {
            console.error("❌ خطأ أثناء إرسال الطلب:", error.response?.data || error);
            setError(error);

            Swal.fire({
                icon: "error",
                title: "خطأ",
                text:   "حدث خطأ أثناء ارسال التقرير الطبي. يرجى المحاولة مرة أخرى.",
            });
        } finally {
            setLoading(false);
        }
    }

    const completeAppointmentPrescriptions = async (prescriptionFiles, appointmentId) => {
        setLoading(true);
        setError(null);

        // **إنشاء `FormData` وإضافة البيانات**
        const prescriptionData = new FormData();
        prescriptionData.append("appointment_id", appointmentId); 

        // **إرسال الملفات باسم `prescription_files` بدون `[]`**
            prescriptionFiles.forEach((file) => prescriptionData.append("prescription_file", file));


        try {
            const response = await axios.post(
                `${apiUrl}/api/prescriptions`,
                prescriptionData,
                {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );

   

 

                return "200";
        
        } catch (error) {
            console.error("❌ خطأ أثناء إرسال الطلب:", error.response?.data || error);
            setError(error);

            Swal.fire({
                icon: "error",
                title: "خطأ",
                text:  "حدث خطأ أثناء ارسال  الروشيتة الطبية. يرجى المحاولة مرة أخرى.",
            });
        } finally {
            setLoading(false);
        }
    }

    return { completeAppointmentNote, completeAppointmentReport, completeAppointmentPrescriptions, loading, error };
};

export default useCompleteAppointment;
