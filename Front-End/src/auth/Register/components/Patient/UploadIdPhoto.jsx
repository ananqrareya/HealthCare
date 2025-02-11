import React, { useState } from "react";
import { FileText, Upload } from "lucide-react";
import Swal from "sweetalert2";

const UploadIdPhoto = ({ onNext }) => {
    const [idPhoto, setIdPhoto] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUploadAndVerify = () => {
        if (!idPhoto) {
            Swal.fire({
                icon: "warning",
                title: "الصورة مفقودة",
                text: "يرجى تحميل صورة الهوية الخاصة بك.",
                confirmButtonText: "حسنًا",
            });
            return;
        }

        onNext(idPhoto); // استدعاء الدالة بعد رفع الصورة
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setIdPhoto(file);
        } else {
            Swal.fire({
                icon: "error",
                title: "ملف غير صالح",
                text: "يرجى تحميل ملف صورة صالح.",
                confirmButtonText: "حسنًا",
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setIdPhoto(file);
        } else {
            Swal.fire({
                icon: "error",
                title: "ملف غير صالح",
                text: "يرجى تحميل ملف صورة صالح.",
                confirmButtonText: "حسنًا",
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] mt-5  bg-white p-8 rounded-lg shadow-lg max-w-sm mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4  text-center">
                قم بتحميل صورة الهوية الخاصة بك
            </h2>
            <p className="text-gray-600 mb-4 text-center">
                اسحب صورة الهوية الخاصة بك هنا أو اضغط لتحميلها يدويًا.
            </p>

            {/* Drag and Drop Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("id-photo-input").click()} // Click to upload
                className={`w-full border-2 ${dragging ? "border-blue-500" : "border-gray-300"} border-dashed rounded-lg p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition`}
            >
                {idPhoto ? (
                    <div className="text-sm text-gray-600">
                        <Upload className="h-6 w-6 text-green-500 mx-auto mb-2" />
                        <p>{idPhoto.name}</p>
                    </div>
                ) : (
                    <>
                        <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">اضغط أو اسحب الملف لتحميله</p>
                    </>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                accept="image/*"
                id="id-photo-input"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Upload and Verify Button */}
            <button
                onClick={handleUploadAndVerify}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                        جاري التحقق...
                    </>
                ) : (
                    "تحميل والتحقق"
                )}
            </button>
        </div>
    );
};

export default UploadIdPhoto;
