import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { decryptData } from "../routes/encryption";
import { initializePusher, subscribeToChannel, unsubscribeFromChannel } from "../user/utils/pusherService";
import { UserContext } from "./UserContextProvider";

const apiUrl = import.meta.env.VITE_APP_KEY;

const fetchNotificationsFromAPI = async () => {
    try {
        const response = await axios.get(`${apiUrl}/api/notifications`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
        });

        if (Array.isArray(response.data.data)) {
            return response.data.data.map((notification) => ({
                id: notification.id,
                message: notification.data?.message || "إشعار جديد",
                source: "pusher",
                created_at: notification.created_at,
                read: notification.read_at !== null,
                type: notification.type.includes("Reminder") ? "reminder" :
                    notification.type.includes("MissingPatient") ? "missing_patient" :
                        notification.type.includes("CompleteAppointment") ? "rating" : "general",
                sender: notification.data?.sender || null,
                patient_id: notification.data?.patient_id || null,
                doctor_name: notification.data?.doctor_name || null,
                doctor_id: notification.data?.doctor_id || null,
            }));
        }

        return [];
    } catch (error) {
        console.error("❌ خطأ في جلب الإشعارات:", error);
        return [];
    }
};

const markNotificationAsRead = async (notificationId, setNotifications) => {
    setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );

    try {
        await axios.patch(`${apiUrl}/api/notifications/${notificationId}/makeRead`, { read: true }, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
        });
    } catch (error) {
        console.error("❌ خطأ في تحديث الإشعار كمقروء:", error);
    }
};

const markAllNotificationsAsRead = async (setNotifications) => {
    try {
        await axios.patch(`${apiUrl}/api/notifications`, {}, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
        });

        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
        console.error("❌ خطأ في تحديث جميع الإشعارات:", error);
    }
};

export const RealTimeContext = createContext();

const RealTimeContextProvider = ({ children }) => {
    const { isLoggedIn } = useContext(UserContext);
    const [userId, setUserId] = useState(localStorage.getItem("currentUserId"));
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const userData = decryptData(localStorage.getItem("userData"));
    console.log("data real", userData);
    useEffect(() => {
        if (isLoggedIn) {
            setUserId(localStorage.getItem("currentUserId"));
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            const apiNotifications = await fetchNotificationsFromAPI();
            setNotifications(apiNotifications);
            setUnreadCount(apiNotifications.filter((n) => !n.read).length);
        };

        fetchData();
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        initializePusher();
        let channels = [];
        if (userData && userData.role_id === 2) {
            channels = [
                {
                    name: `appointment.reminder.${userId}`,
                    handler: (data) => {

                        const newNotification = {
                            id: data.id,
                            message: data.message,
                            sender: data.sender,
                            source: "pusher",
                            type: "reminder",
                            read: false,
                        };
                        setNotifications((prev) => [...prev, newNotification]);
                    },
                },
                {
                    name: `appointment.missing.patient.${userId}`,
                    handler: (data) => {

                        const newNotification = {
                            id: data.id,
                            message: data.message,
                            sender: data.sender,
                            source: "pusher",
                            type: "general",
                            read: false,
                        };
                        setNotifications((prev) => [...prev, newNotification]);
                    },
                },
                {
                    name: `appointment.rating.${userId}`,
                    handler: (data) => {
                        const newNotification = {
                            id: data.id,
                            message: data.message,
                            patient_id: data.patient_id,
                            doctor_name: data.doctor_name,
                            doctor_id: data.doctor_id,
                            source: "pusher",
                            created_at: new Date().toISOString(),
                            read: false,
                            type: "rating",
                        };
                        setNotifications((prev) => [...prev, newNotification]);
                    },
                },
            ];

        } else if (userData && userData.role_id === 3) {
            // إذا كانت role_id 3، على سبيل المثال
            channels = [
                {
                    name: `appointment.reminder.doctor.${userId}`,
                    handler: (data) => {
                        const newNotification = {
                            id: data.id,
                            message: data.message,
                            sender: data.sender,
                            source: "pusher",
                            type: "general",
                            read: false,
                        };
                        setNotifications((prev) => [...prev, newNotification]);
                    },
                }, {
                    name: `appointment.to.doctor.${userId}`,
                    handler: (data) => {
                        const newNotification = {
                            id: data.id,
                            message: data.message,
                            sender: data.sender,
                            source: "pusher",
                            type: "general",
                            read: false,
                        };
                        setNotifications((prev) => [...prev, newNotification]);
                    },
                },

            ];
        }

        channels.forEach(({ name, handler }) => subscribeToChannel(name, handler));

        return () => channels.forEach(({ name }) => unsubscribeFromChannel(name));
    }, [userId]);

    useEffect(() => {
        setUnreadCount(notifications.filter((n) => !n.read).length);
    }, [notifications]);

    const contextValue = useMemo(() => ({
        notifications,
        unreadCount,
        markAllNotificationsAsRead: () => markAllNotificationsAsRead(setNotifications),
        markNotificationAsRead: (id) => markNotificationAsRead(id, setNotifications),
    }), [notifications, unreadCount]);

    return (
        <RealTimeContext.Provider value={contextValue}>
            {children}
        </RealTimeContext.Provider>
    );
};

export default RealTimeContextProvider;
