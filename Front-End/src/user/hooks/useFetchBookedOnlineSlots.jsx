import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContextProvider";
import axios from "axios";
import { convertTo12HourFormat } from "../utils/scheduleFormatter";

const useFetchBookedOnlineSlots=(doctorId)=>{
    const [bookedOnlineSlots, setBookedSlots] = useState({});
    const { loading, setLoading } = useContext(UserContext);
    const [error, setError] = useState(null);
          const apiUrl =import.meta.env.VITE_APP_KEY;

    useEffect(() => {
        if (!doctorId) return;
        const fetchBookedSlots = async () => {
            setLoading(true);
            setError(null);
            try{
                const response = await axios.get(
                    `${apiUrl}/api/doctors/${doctorId}/ReservedAppointments`,
                    { headers: { "ngrok-skip-browser-warning": "s" } }
                );
                const rawData = response.data;
                console.log("response fetch",rawData);
                // تنسيق البيانات لتحويل المفاتيح إلى كائنات Date
                const formattedData = Object.entries(rawData).reduce((acc, [dateKey, slots]) => {
                    if (!Array.isArray(slots)) return acc; // تخطي القيم غير الصحيحة

                    // استخراج التاريخ فقط من المفتاح (قبل الوقت)
                    const date = dateKey.split(" ")[0]; // فقط التاريخ (YYYY-MM-DD)

                    // تحويل الأوقات إلى 12 ساعة بالعربية
                    const formattedSlots = slots.map((time) => convertTo12HourFormat(time));

                    // إضافة البيانات المنسقة إلى الكائن النهائي
                    acc[date] = formattedSlots;
                    return acc;
                }, {});


            

                // تحديث الحالة
                setBookedSlots(formattedData);
     
            }catch(err){
                setError(err);
                setBookedSlots(null);
            } finally {
                setLoading(false);
            }
        };
        fetchBookedSlots();
    }, [doctorId, setLoading]);
    return { bookedOnlineSlots, loading, error };
};
export default useFetchBookedOnlineSlots;