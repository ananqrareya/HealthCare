import React, { useContext, useEffect, useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  Activity,
  DollarSign
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { DoctorLayoutContext } from '../context/DoctorLayoutContext';
import { formatMonthToArabic } from '../utils/formatDateAndTime';



const COLORS = ["#4CAF50", "#F44336", "#FF9800"]; // أخضر، أحمر، برتقالي
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill={"#E2E8F0"}  // تغيير اللون حسب الوضع
      textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};
export default function Dashboard() {
  const { preferences, infoDashboard } = useContext(DoctorLayoutContext);
  console.log("infoDashboard", infoDashboard);
  const visitData = infoDashboard?.appointments_per_month?.map(item => ({
    name: formatMonthToArabic(item.month),
    visits: item.total_appointments
  })) || [];  // إذا كان undefined، استخدم مصفوفة فارغة

  console.log(visitData);


  const appointmentStats = [
    { name: "المواعيد المكتملة", value: infoDashboard?.completed_appointment_count || 0 },
    { name: "المواعيد الملغاة", value: infoDashboard?.canceled_appointment_count || 0 },
    { name: "المواعيد في الانتظار", value: infoDashboard?.pending_appointment_count || 0 }
  ];



  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* إجمالي المرضى */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">إجمالي المرضى</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{infoDashboard.patients_count}</h3>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">جميع المرضى</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
              <Users className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
          </div>
        </div>

        {/* المواعيد القادمة */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">المواعيد القادمة</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{infoDashboard.pending_appointment_count}</h3>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">جميع الحالات</p>
            </div>
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Calendar className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>

        {/* وقت الانتظار إلكترونياً */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">وقت الانتظار إلكترونياً</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{preferences.waitingTime} دقيقة</h3>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">+2 دقائق عن المتوسط</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
          </div>
        </div>

        {/* إجمالي الأرباح لآخر شهر */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">إجمالي الأرباح لآخر شهر</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">₪{infoDashboard.salary_for_last_month}</h3>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">إجمالي الأرباح الشهرية</p>
            </div>
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>
      </div>


      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">عدد الزيارات الشهرية</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="name" stroke="#ddd" />
                <YAxis stroke="#ddd" />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#4F46E5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          {/* العنوان والتنسيق */}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center mb-4">
            إحصائيات المواعيد
          </h3>

          {/* المخطط الدائري */}
          <div className="h-80 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appointmentStats.filter((entry) => entry.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={renderCustomizedLabel} // استخدام دالة التسمية المخصصة
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentStats
                    .filter((entry) => entry.value > 0) // تجاهل القيم الصفرية
                    .map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend align="center" verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* رسالة عندما تكون المواعيد الملغاة صفرًا */}
          {appointmentStats.find((entry) => entry.name === "المواعيد الملغاة" && entry.value === 0) && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              لا توجد مواعيد ملغاة.
            </p>
          )}
        </div>
      </div>
    </div>


  );
}