import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { formatDateWithDay, formatTimeTo12Hour } from "../utils/formatDateAndTime";

// هوك لجلب السجل الطبي للمريض
const useHistoryAppointmentsPaitent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [patientHistory, setPatientHistory] = useState([]); // تصحيح الاسم
    const apiUrl = import.meta.env.VITE_APP_KEY;

    const historyPaitent = async (patientId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${apiUrl}/api/patients/${patientId}/doctor-appointments`, {
                headers: {
                    "ngrok-skip-browser-warning": "s",
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    "Content-Type": "application/json",
                },
            });


            const data = response.data.data;

            if (!Array.isArray(data) || data.length === 0) {
                setPatientHistory([]);
                return [];
            }

            const patientHistoryInfo = data.map((appointment) => ({
                date: appointment.date ? formatDateWithDay(appointment.date) : null,
                time: appointment.time ? formatTimeTo12Hour(appointment.time) : null,
                visitInfo: appointment.status && appointment.clinic
                    ? ` في ${appointment.clinic.ar_name || ''}${appointment.clinic.ar_name && appointment.clinic.en_name ? ' - ' : ''}${appointment.clinic.en_name || ''}`
                    : "المعلومات غير متاحة"
            }));

            setPatientHistory(patientHistoryInfo);

            return [patientHistoryInfo];
        } catch (error) {
            console.error("Error fetching patient history:", error);
            setPatientHistory([]);
            setError(error);
            Swal.fire({
                icon: "error",
                title: "خطأ",
                text: "حدث خطأ أثناء جلب السجل الطبي. يرجى المحاولة مرة أخرى.",
            });
            return [];
        } finally {
            setLoading(false);
        }
    };

    return { historyPaitent, patientHistory, loading, error };
};

export default useHistoryAppointmentsPaitent;
