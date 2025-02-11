import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContextProvider";
import axios from "axios";
import { transformDoctorData } from "../utils/transformDoctorData";
 
const useFetchDoctorById = (doctorId) => {
    const [doctor, setDoctor] = useState(null);
    const { loading, setLoading } = useContext(UserContext);
    const [error, setError] = useState(null);
          const apiUrl =import.meta.env.VITE_APP_KEY;

    useEffect(() => {
        const fetchDoctor = async () => {
            if (!doctorId) return;
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `${apiUrl}/api/doctors/${doctorId}`,
                    { headers: { "ngrok-skip-browser-warning": "s" } }
                );

                // تحويل البيانات إلى التنسيق المطلوب
                const transformedDoctor = transformDoctorData(response.data.data);
                console.log("conv",transformedDoctor);
                setDoctor(transformedDoctor);
            } catch (err) {
                console.error("Error fetching doctor by ID:", err);
                setError(err);
                setDoctor(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [doctorId, setLoading]);

    return { doctor, loading, error };
};

export default useFetchDoctorById;
