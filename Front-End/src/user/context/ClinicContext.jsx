import axios from "axios";
import { useContext } from "react";
import { createContext, useEffect, useMemo, useState } from "react";
import {
    FaStethoscope,
    FaTooth,
    FaEye,
    FaBaby,
    FaUserMd,
    FaCut, // استخدام FaCut كبديل
    FaBrain,
    FaHeart,
    FaLungs,
    FaSyringe,
    FaShieldAlt,
    FaFlask,
    FaFirstAid,
    FaBandAid,
    FaPills,
    FaHospital,
    FaMicroscope,
} from "react-icons/fa";
import { UserContext } from "../../context/UserContextProvider";

const iconMap = {
    General: FaStethoscope,
    Dentistry: FaTooth,
    Ophthalmoloy: FaEye,
    Pediatrics: FaBaby,
    "Internal Medicine": FaUserMd,
    Surgery: FaCut,
    Psychiatry: FaBrain,
    Cardiology: FaHeart,
    Dermatology: FaBandAid,
    Orthopedics: FaHospital,
    "ENT (Ear, Nose, and Throat)": FaLungs,
    Anesthesiology: FaSyringe,
    "Obstetrics and Gynecology": FaFirstAid,
    Radiology: FaMicroscope,
    Urology: FaFlask,
    Immunology: FaShieldAlt,
    "Infectious Diseases": FaPills,
};

const defaultSpecialties = [
    { ar_name: "طب عام", icon: FaStethoscope },
    { ar_name: "طب أسنان", icon: FaTooth },
    { ar_name: "طب عيون", icon: FaEye },
    { ar_name: "طب أطفال", icon: FaBaby },
    { ar_name: "طب نساء وولادة", icon: FaFirstAid },
    { ar_name:  "طب الباطني", icon: FaUserMd },
    { ar_name: "جراحة عامة", icon: FaCut },
    { ar_name: "طب نفسي", icon: FaBrain },
    { ar_name: "أمراض القلب", icon: FaHeart },
    { ar_name: "الجلدية", icon: FaBandAid },
    { ar_name: "العظام", icon: FaHospital },
    { ar_name: "أنف وأذن وحنجرة", icon: FaHospital },
    { ar_name: "التخدير", icon: FaSyringe },
    { ar_name: "الأشعة", icon: FaMicroscope },
    { ar_name: "المسالك البولية", icon: FaFlask },
    { ar_name: "المناعة", icon: FaShieldAlt },
    { ar_name: "الأمراض المعدية", icon: FaPills },
];

// eslint-disable-next-line react-refresh/only-export-components
export const ClinicContext = createContext();

const ClinicContextProvider = ({ children }) => {
    const [specialties, setSpecialties] = useState(defaultSpecialties);
    const [cities, setCities] = useState([]);
    const {loading, setLoading}=useContext(UserContext);
     const apiUrl =import.meta.env.VITE_APP_KEY;

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${apiUrl}/api/categories`, {
                    headers: { "ngrok-skip-browser-warning": "s" }
                });
                const data = response.data.data;

                if (data && data.length > 0) {
                   

                    // تحديث الأيقونات بناءً على `en_name`
                    const updatedSpecialties = data.map((specialty) => ({
                        ...specialty,
                        icon: iconMap[specialty.en_name] || FaCut, // استخدم أيقونة افتراضية إذا لم يتم العثور على تطابق
                    }));

                    setSpecialties(updatedSpecialties);
                } else {
                    setSpecialties(defaultSpecialties);
                }
            } catch (error) {
                console.error("خطأ في جلب التخصصات:", error);
                setSpecialties(defaultSpecialties);
            }finally{
                setLoading(false);
            }
        };

        fetchSpecialties();
    }, [apiUrl]);

    //جلب المدن 
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/cities`, {
                    headers: { "ngrok-skip-browser-warning": "s" }
                });
                setCities(response.data.data); // تخزين قائمة المدن
            } catch (error) {
                console.error("خطأ في جلب المدن:", error);
                setCities([]); // في حال حدوث خطأ، اجعل قائمة المدن فارغة
            }
        };

        fetchCities();
    }, [apiUrl]);

    const contextValue = useMemo(() => ({
        specialties,
        cities,
        loading
    }), [specialties, cities,loading]);

    return (
        <ClinicContext.Provider value={contextValue}>
            {children}
        </ClinicContext.Provider>
    );
};

export default ClinicContextProvider;
