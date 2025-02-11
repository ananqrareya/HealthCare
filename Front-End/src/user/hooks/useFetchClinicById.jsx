import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContextProvider";
import axios from "axios";
import { formatClinicWorkingHours } from "../utils/formatClinicWorkingHours";
 

const useFetchClinicById = (clinicId) => {
    const [clinic, setClinic] = useState(null);
    const { loading, setLoading } = useContext(UserContext);
    const [error, setError] = useState(null);
          const apiUrl =import.meta.env.VITE_APP_KEY;

 

    useEffect(() => {
        let isMounted = true;

        const fetchClinic = async () => {
            if (!clinicId) return;
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `${apiUrl}/api/clinics/${clinicId}`,
                    { headers: { "ngrok-skip-browser-warning": "s" } }
                );

                const data = response.data;
                const clinicF = data.data;

                if (isMounted) {
                    const formattedClinic = {
                        id: clinicF.id || "غير متوفر",
                        name: clinicF.ar_name || "اسم غير متوفر",
                        city: clinicF.city?.ar_name || "مدينة غير محددة",
                        doctorId: clinicF.doctor.id,
                        address: clinicF.address
                            ? Object.values(clinicF.address)
                                .filter(Boolean)
                                .join("، ")
                            : "عنوان غير متوفر",
                        phone: clinicF.doctor?.phone || "غير متوفر",
                        workingHours: formatClinicWorkingHours(clinicF.schedule || []),
                        appointment_time: clinicF.appointment_time || 15,
                    };
                    setClinic(formattedClinic);
                    console.log("Formatted Clinic:", formattedClinic);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error fetching clinic by ID:", err);
                    setError(err);
                    setClinic(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchClinic();

        return () => {
            isMounted = false;
        };
    }, [clinicId, setLoading]);

    return { clinic, loading, error };
};

export default useFetchClinicById;
