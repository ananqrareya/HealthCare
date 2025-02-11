/*import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

function DoctorDetails({ doctor, open, onClose }) {
    if (!doctor) return null;

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-all duration-500 ${open ? 'block opacity-100' : 'hidden opacity-0'}`}
            onClick={onClose}
        >
            <div
                className="bg-white max-w-2xl w-full p-6 rounded-lg shadow-xl transform transition-all duration-500 scale-100 hover:scale-105"
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
            >
                <div className="mb-6">
                    <h2 className="text-3xl font-semibold text-center text-blue-600">{doctor.name}</h2>
                </div>

                <div className="grid gap-6">
                    <div className="flex gap-6 mb-6">
                        <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-32 h-32 rounded-full object-cover shadow-lg"
                        />
                        <div>
                            <h3 className="font-semibold text-lg text-blue-600">{doctor.specialization}</h3>
                            <p className="text-gray-500">خبرة {doctor.experience} سنوات</p>
                            <div className="mt-2">
                                <h4 className="font-semibold mb-1">المؤهلات العلمية:</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    {doctor.education.map((edu, index) => (
                                        <li key={index} className="text-gray-600">{edu}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg text-blue-600 mb-3">العيادات:</h3>
                        <div className="space-y-4">
                            {doctor.clinics.map((clinic, index) => (
                                <div key={index} className="p-4 bg-blue-50 rounded-lg shadow-md hover:shadow-lg transition-shadow space-y-2">
                                    <h4 className="font-semibold">{clinic.name}</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <MapPin className="h-4 w-4" />
                                        <span>{clinic.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Phone className="h-4 w-4" />
                                        <span>{clinic.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Clock className="h-4 w-4" />
                                        <span>{clinic.workingHours}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 text-blue-600 hover:underline transition-colors duration-200"
                >
                    إغلاق
                </button>
            </div>
        </div>
    );
}

export default DoctorDetails;
*/