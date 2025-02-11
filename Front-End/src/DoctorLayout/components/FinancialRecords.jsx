import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Download, Filter, Plus, MoreVertical, X, DollarSign, FileText, Calendar, ArrowUpRight, ArrowDownRight, Receipt } from 'lucide-react';
import { DoctorLayoutContext } from '../context/DoctorLayoutContext';

export default function FinancialRecords() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const { onlineAppointmentComplete, preferences } = useContext(DoctorLayoutContext);
    const [invoices, setInvoices] = useState([]);
    const apiUrl = import.meta.env.VITE_APP_KEY;
    const [totalRevenue, setTotalRevenue] = useState(0);
    useEffect(() => {
        if (onlineAppointmentComplete && onlineAppointmentComplete.length > 0) {
            const doctorId = localStorage.getItem("currentUserId"); // Replace with actual doctor ID if needed
            const fetchInvoices = async () => {
                try {
                    const invoicesData = [];
                    for (const appointment of onlineAppointmentComplete) {
                        const patientId = appointment.patientId; // Assuming the patient ID is available here
                        const url = `${apiUrl}/api/doctors/${doctorId}/patients/${patientId}/bails`;
                        const response = await axios.get(url,
                            {
                                headers: { "ngrok-skip-browser-warning": "s" },
                            }
                        );
                        const totalRevenue = response.data.reduce((total, invoice) => {
                            // تحويل `amount` إلى رقم عشري
                            const amount = parseFloat(invoice.amount);

                            if (isNaN(amount)) {
                                console.error("قيمة amount غير صالحة:", invoice.amount);
                                return total; // تجاهل الفاتورة إذا كانت القيمة غير صالحة
                            }

                            // إضافة `amount` إلى الإجمالي
                            return total + amount;
                        }, 0);

                        // تحديث الحالة مع الاحتفاظ بالقيمة السابقة
                        setTotalRevenue((prevTotal) => prevTotal + totalRevenue);


                        const patientInvoices = response.data.map(invoice => ({
                            ...invoice,
                            patientName: appointment.patientName,
                            patientId: appointment.patientId,
                            appointmentDate: appointment.date,
                            appointmentTime: appointment.time,
                            avatar: appointment.patientAvatar
                        }));

                        invoicesData.push(...patientInvoices);
                    }
                    setInvoices(invoicesData);
                } catch (error) {
                    console.error('Error fetching invoices:', error);
                }
            };

            fetchInvoices();
        }
    }, [onlineAppointmentComplete]); // Trigger when onlineAppointmentComplete changes
    const downloadInvoice = async (invoiceId) => {
        try {
            const response = await axios.post(
                `${apiUrl}/api/bails/${invoiceId}/download/invoice`,
                {}, // بيانات الجسم (إذا لزم الأمر)
                {
                    headers: {
                        "ngrok-skip-browser-warning": "s",
                        'Content-Type': 'application/json',
                    },
                    responseType: 'arraybuffer', // تغيير نوع الاستجابة إلى arraybuffer
                }
            );

            console.log("response", response);

            // التحقق من وجود ترويسة Content-Disposition
            const contentDisposition = response.headers['content-disposition'];
            let filename = `invoice_${invoiceId}.pdf`; // الاسم الافتراضي للملف

            if (contentDisposition) {
                const matches = contentDisposition.match(/filename="(.+)"/);
                if (matches && matches[1]) {
                    filename = matches[1];
                }
            }

            // تحويل البيانات إلى Blob
            const blob = new Blob([response.data], { type: 'application/pdf' });

            // إنشاء رابط لتحميل الملف باستخدام Blob
            const fileURL = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = filename; // تخصيص اسم الملف بناءً على الترويسة
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading invoice:', error);
        }
    };



    return (
        <>
            {preferences.onlinePrice > 0 ? (
                <div className="space-y-6 p-4">
                    {/* العنوان وزر الفاتورة الجديدة */}
                    <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">السجل المالي</h1>
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2 space-x-reverse">
                            <Plus size={20} />
                            <span>فاتورة جديدة</span>
                        </button>
                    </div>

                    {/* بطاقات الإحصائيات */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* بطاقة إجمالي الدخل */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                    <DollarSign className="text-green-600 dark:text-green-400" size={24} />
                                </div>
                                <span className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                                    +12.5%
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{totalRevenue}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">إجمالي الدخل للحجوزات الأونلاين</p>
                        </div>

                        {/* بطاقة عدد الفواتير */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                                    <Receipt className="text-indigo-600 dark:text-indigo-400" size={24} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{onlineAppointmentComplete.length}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">عدد الفواتير</p>
                        </div>
                    </div>

                    {/* قائمة الفواتير */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                        {/* البحث والتصفية */}
                        <div className="flex flex-col lg:flex-row gap-4 mb-6">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="البحث في الفواتير..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                    />
                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                                >
                                    <option value="all">جميع الفواتير</option>
                                    <option value="paid">مدفوع</option>
                                    <option value="pending">معلق</option>
                                    <option value="overdue">متأخر</option>
                                </select>
                            </div>
                        </div>

                        {/* عرض الفواتير */}
                        <div className="space-y-4">
                            {invoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-indigo-100 dark:hover:border-indigo-900 hover:bg-indigo-50/20"
                                >
                                    {/* معلومات المريض */}
                                    <div className="flex items-center space-x-4 space-x-reverse">
                                        <img
                                            src={invoice.avatar}
                                            alt={invoice.patientName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <div className="flex items-center space-x-2 space-x-reverse">
                                                <h4 className="font-semibold text-gray-800 dark:text-white">
                                                    {invoice.patientName}
                                                </h4>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    ({invoice.patientId})
                                                </span>
                                            </div>
                                            <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-2 space-x-reverse mt-1">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {invoice.invoice_id}
                                                </span>
                                                <span className="hidden lg:block text-sm text-gray-400 dark:text-gray-500">•</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(invoice.appointmentDate).toLocaleDateString('ar-EG')}
                                                    - {invoice.appointmentTime}
                                                </span>
                                                <span className="hidden lg:block text-sm text-gray-400 dark:text-gray-500">•</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    online
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* المبلغ والإجراءات */}
                                    <div className="flex items-center mt-4 lg:mt-0 space-x-4 space-x-reverse">
                                        <span className="text-lg font-semibold text-gray-800 dark:text-white">
                                            {invoice.amount} ₪
                                        </span>
                                        <span className="px-3 py-1 text-sm rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                                            {"مدفوع"}
                                        </span>
                                        <div className="flex items-center space-x-2 space-x-reverse">
                                            <button
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                                onClick={() => downloadInvoice(invoice.id)}
                                            >
                                                <Download size={20} className="text-gray-500 dark:text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        أنت عامل الحجز الإلكتروني مجاني فلن يكون هناك سجل مالي.
                    </h2>
                </div>
            )}
        </>
    );
}
