import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContextProvider";
import { cleanSchedule } from "../utils/cleanSchedule"; // استخدام الدالة المشتركة

const useFetchSpecialties = (specialId) => {
    const [specificClinicsByCateg, setSpecificClinicsByCateg] = useState([]);
    const { loading, setLoading } = useContext(UserContext);
    const [error, setError] = useState(null);
          const apiUrl =import.meta.env.VITE_APP_KEY;

    useEffect(() => {
        const fetchClinics = async () => {
            if (!specialId) return; // لا ترسل طلبًا إذا لم يتم تحديد التخصص

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `${apiUrl}/api/categories/${specialId}`,
                    { headers: { "ngrok-skip-browser-warning": "s" } }
                );
                 const cleanedClinics = response.data.clinics.data.map((clinic) => ({
                    ...clinic,
                    schedule: cleanSchedule(clinic.schedule.data || []),
                }));

                setSpecificClinicsByCateg(cleanedClinics);
            } catch (err) {
                console.error("Error fetching clinics by specialty:", err);
                setError(err);
                setSpecificClinicsByCateg([]);
            } finally {
                setLoading(false);
            }
        };

        fetchClinics();
    }, [specialId]);

    return { specificClinicsByCateg, loading, error };
};

export default useFetchSpecialties;
