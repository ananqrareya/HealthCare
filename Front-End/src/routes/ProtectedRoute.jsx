import { Navigate } from 'react-router-dom';
import { decryptData } from './encryption';
 

const ProtectedRoute = ({ children, requiredRole }) => {
    try {
        // قراءة البيانات المشفرة من localStorage
        const encryptedData = localStorage.getItem('userData');

        if (!encryptedData) {
            console.warn("No user data found. Redirecting to login.");
            return <Navigate to="/login" replace />;
        }

        // فك تشفير البيانات
        const userData = decryptData(encryptedData);

        if (!userData || userData.role_id !== requiredRole) {
            console.warn("Access denied. Redirecting to home.");
            return <Navigate to="/" replace />;
        }

        // إذا كان المستخدم مصرحًا له بالدخول
        return children;
    } catch (error) {
        console.error("Error in ProtectedRoute:", error);
        // إذا حدث خطأ أثناء فك التشفير أو معالجة البيانات
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
