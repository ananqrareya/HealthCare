import React, { useRef, useEffect, useState } from "react";

const CircularCapture = ({ onNext }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [captured, setCaptured] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("استعد لالتقاط الصورة.");

    // تشغيل الكاميرا
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
        } catch (err) {
            console.error("حدث خطأ أثناء الوصول إلى الكاميرا:", err);
        }
    };

    // التقاط الصورة وحفظها كـ Base64
    const captureImage = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // ضبط أبعاد الكانفاس لتطابق أبعاد الفيديو
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // رسم إطار الفيديو على الكانفاس
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // تحويل محتوى الكانفاس إلى Base64
        const imageData = canvas.toDataURL("image/png");

        // حفظ الصورة في Local Storage
        localStorage.setItem("capturedImage", imageData);

        // عرض رسالة نجاح
        setCaptured(true);
        setFeedbackMessage("تم التقاط الصورة بنجاح!");

        // الانتقال إلى الخطوة التالية بعد التأخير
        setTimeout(() => {
            onNext(); // استدعاء الوظيفة للانتقال للخطوة التالية
        }, 1000);
    };

    useEffect(() => {
        if (isReady && !captured) {
            startCamera(); // تشغيل الكاميرا عند استعداد المستخدم
            setTimeout(() => {
                captureImage(); // التقاط الصورة تلقائيًا بعد ثانيتين
            }, 2000);
        }
    }, [isReady, captured]);

    return (
        <div className="w-full max-w-lg p-8 bg-white shadow-xl rounded-lg">

            {!isReady ? (
                <div className="text-center">
                    <p className="text-lg">{feedbackMessage}</p>
                    <button
                        onClick={() => setIsReady(true)} // عندما يضغط المستخدم على "استعد"، يبدأ فتح الكاميرا
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        استعد
                    </button>
                </div>
            ) : (
                <>
                    {/* إطار دائري */}
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                        <div
                            className="rounded-full border-4 border-green-500"
                            style={{
                                width: "18rem",
                                height: "18rem",
                            }}
                        ></div>
                    </div>

                    {/* رسائل التغذية الراجعة */}
                    <p className="absolute top-10 text-lg text-gray-300">{feedbackMessage}</p>

                    {/* فيديو الكاميرا */}
                    <video
                        ref={videoRef}
                        className="rounded-full w-[17rem] h-[17rem] object-cover"
                        autoPlay
                        muted
                    ></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </>
            )}
        </div>
    );
};

export default CircularCapture;
