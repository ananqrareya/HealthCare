import { createContext, useContext, useEffect, useMemo, useState } from "react";

import axios from "axios";
import {
    FaStethoscope,
    FaTooth,
    FaEye,
    FaBaby,
    FaFirstAid,
    FaUserMd,
    FaCut,
    FaBrain,
    FaHeart,
    FaBandAid,
    FaHospital,
    FaSyringe,
    FaMicroscope,
    FaFlask,
    FaShieldAlt,
    FaPills,
    FaLungs,
} from "react-icons/fa";
import { UserContext } from "../../context/UserContextProvider";

export const DoctorContext = createContext();

// خريطة التخصصات مع الأسماء العربية والأيقونات
const SPECIALITY_MAP = {
    General: { ar_name: "طب عام", icon: FaStethoscope },
    Dentistry: { ar_name: "طب أسنان", icon: FaTooth },
    Ophthalmoloy: { ar_name: "طب عيون", icon: FaEye },
    Pediatrics: { ar_name: "طب أطفال", icon: FaBaby },
    "Internal Medicine": { ar_name: "باطنة", icon: FaUserMd },
    Surgery: { ar_name: "جراحة عامة", icon: FaCut },
    Psychiatry: { ar_name: "طب نفسي", icon: FaBrain },
    Cardiology: { ar_name: "أمراض القلب", icon: FaHeart },
    Dermatology: { ar_name: "الجلدية", icon: FaBandAid },
    Orthopedics: { ar_name: "العظام", icon: FaHospital },
    "ENT (Ear, Nose, and Throat)": { ar_name: "أنف وأذن وحنجرة", icon: FaLungs },
    Anesthesiology: { ar_name: "التخدير", icon: FaSyringe },
    "Obstetrics and Gynecology": { ar_name: "طب نساء وولادة", icon: FaFirstAid },
    Radiology: { ar_name: "الأشعة", icon: FaMicroscope },
    Urology: { ar_name: "المسالك البولية", icon: FaFlask },
    Immunology: { ar_name: "المناعة", icon: FaShieldAlt },
    "Infectious Diseases": { ar_name: "الأمراض المعدية", icon: FaPills },
};

const DoctorContextProvider = ({ children }) => {
    const [doctors, setDoctors] = useState([]);
    const { loading, setLoading } = useContext(UserContext);
    const apiUrl = import.meta.env.VITE_APP_KEY;

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${apiUrl}/api/doctors`, {
                    headers: { "ngrok-skip-browser-warning": "s" },
                });

                const transformedDoctors = response.data.data.map((doctor) => {
                    // إذا كان التخصص بالعربية، استخدمه كما هو
                    if (/[\u0600-\u06FF]/.test(doctor.speciality)) {
                        return {
                            ...doctor,
                            specialityAr: doctor.speciality,
                            icon: FaHospital, // أيقونة افتراضية، يمكن تخصيصها
                        };
                    }

                    // إذا كان التخصص بالإنجليزية، ترجمه باستخدام الخريطة
                    const speciality = SPECIALITY_MAP[doctor.speciality];
                    return {
                        ...doctor,
                        specialityAr: speciality?.ar_name || "تخصص غير محدد",
                        icon: speciality?.icon || FaHospital,
                    };
                });

                setDoctors(transformedDoctors);
            } catch (error) {
                console.error("خطأ في جلب الدكاترة:", error);
                setDoctors([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, [apiUrl, setLoading]);

    const contextValue = useMemo(
        () => ({
            doctors,
            loading,
        }),
        [doctors, loading]
    );

    return (
        <DoctorContext.Provider value={contextValue}>
            {children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;
