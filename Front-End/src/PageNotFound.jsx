import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react"; // أيقونة الخطأ

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 via-blue-200 to-blue-100 text-white relative" dir="rtl">
            {/* خلفية متحركة مع ألوان هادئة */}
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1566073585-2f54918f54d3")' }}></div>

            <div className="text-center z-10 relative text-mainColor ">
                <div className="mb-8">
                    {/* أيقونة تحذير مع تأثير الحركة */}
                    <AlertTriangle className="mx-auto text-8xl mb-4  text-red-500 animate-bounce" />
                    <h1 className="text-8xl font-extrabold tracking-widest mb-4 text-red-500">404</h1>
                    <p className="text-2xl font-semibold mb-4">
                        عذرًا، هناك مشكلة في البيانات.

                    </p>
                    <p className="text-lg mb-8 text-mainColor">
                        فرق الدعم لدينا يعمل على حل المشكلة بأسرع وقت. شكراً لصبرك!
                    </p>
                </div>

                {/* زر العودة */}
                <button
                    onClick={() => navigate("/")}
                    className="px-8 py-4 text-xl font-semibold bg-white text-mainColor rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:bg-blue-200 hover:scale-105"
                >
                    العودة إلى الصفحة الرئيسية
                </button>
            </div>
        </div>
    );
}

export default NotFound;
