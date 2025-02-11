import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PatientRegistration from "./components/Patient/PatientRegistration";
import PhoneNumberVerification from "./components/Patient/PhoneNumberVerification";
import UploadIdPhoto from "./components/Patient/UploadIdPhoto";
import VerificationDetails from "./components/Patient/VerificationDetails";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function PatientFlow({ onBackToRoleSelection }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [userDetails, setUserDetails] = useState({});
    const [phone, setPhone] = useState("");
    const [userId, setUserId] = useState(null);
    const [idPhoto, setIdPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const savedStep = parseInt(localStorage.getItem("currentStep"), 10) || 1;
        const savedUserDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
        const savedPhone = localStorage.getItem("phone") || "";
        const savedUserId = localStorage.getItem("userId");

        setCurrentStep(savedStep);
        setUserDetails(savedUserDetails);
        setPhone(savedPhone);
        setUserId(savedUserId);

        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading) {
            console.log("Storing data to localStorage:");
            console.log({ currentStep, userDetails, phone, userId });
            localStorage.setItem("currentStep", currentStep);
            localStorage.setItem("userDetails", JSON.stringify(userDetails));
            localStorage.setItem("phone", phone);
            localStorage.setItem("userId", userId);
        }
    }, [currentStep, userDetails, phone, userId, loading]);

    const handleNextStep = (data) => {
        if (data?.idPhoto) setIdPhoto(data.idPhoto);
        if (data?.userDetails) setUserDetails(data.userDetails);
        setCurrentStep((prev) => prev + 1);
    };

    const handlePreviousStep = () => {
        if (currentStep === 1) {
            onBackToRoleSelection();
        } else {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleComplete = () => {
        localStorage.clear();

        setCurrentStep(0);
        setUserDetails({});
        setPhone("");
        setUserId(null);
        setIdPhoto(null);

        Swal.fire({
            icon: "success",
            title: "تم التسجيل بنجاح!",
            text: "تم التحقق من حسابك بنجاح.",
            confirmButtonText: "موافق",
            // إضافة خصائص RTL
            customClass: {
                popup: 'rtl-popup',
                confirmButton: 'rtl-confirm-btn'
            },
            // استخدام اتجاه الكتابة من اليمين لليسار
            didOpen: () => {
                const popup = Swal.getPopup();
                popup.style.direction = 'rtl';
            }
        }).then(() => {
            navigate("/login");
        });
    };

    if (loading) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center h-screen bg-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                <p className="mt-4 text-gray-700">Loading, please wait...</p>
            </motion.div>
        );
    }

    const variants = {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 50 },
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <motion.div
                className="p-6 max-w-screen-lg w-full bg-white shadow-md rounded-lg overflow-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-full bg-gray-300 h-2 rounded sm:h-3 mb-4">
                    <motion.div
                        className="bg-blue-500 h-2 rounded sm:h-3"
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / 4) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <motion.div
                    key={currentStep}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={variants}
                    transition={{ duration: 0.5 }}
                >
                    {currentStep === 1 && (
                        <PatientRegistration
                            {...userDetails}
                            onNext={(phone, userId, details) => {
                                setUserDetails(details);
                                setUserId(userId);
                                handleNextStep({ userDetails: details });
                            }}
                            onBack={handlePreviousStep}
                        />
                    )}
                    {currentStep === 2 && (
                        <PhoneNumberVerification
                            phone={userDetails.phone}
                            user_id={userId}
                            onNext={handleNextStep}
                        />
                    )}
                    {currentStep === 3 && (
                        <UploadIdPhoto
                            userId={userId}
                            onBack={handlePreviousStep}
                            onNext={(idPhoto) => handleNextStep({ idPhoto })}
                        />
                    )}
                    {currentStep === 4 && (
                        <VerificationDetails
                            userId={userId}
                            idPhoto={idPhoto}
                            onBack={handlePreviousStep}
                            setCurrentStep={setCurrentStep}
                            onComplete={handleComplete}
                        />
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
