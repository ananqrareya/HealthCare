import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

let echo = null; // الاحتفاظ بمثيل Echo واحد

export const initializePusher = () => {
    if (!echo) {
        // تهيئة Pusher مرة واحدة فقط
        window.Pusher = Pusher;

        echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true,
        });

        console.log('Pusher has been initialized.');
    }
};

export const subscribeToChannel = (channelName, onNotification) => {
    if (!echo) {
        console.error('Pusher is not initialized. Please call initializePusher first.');
        return;
    }

    const channel = echo.channel(channelName);
    console.log(`Subscribed to channel: ${channelName}`);

    // استماع للإشعارات
    channel.notification((notification) => {
        console.log('Notification received:', notification);
        if (onNotification) {
            onNotification(notification);
        }
    });

    return channel; // يمكن الاحتفاظ به إذا كان هناك حاجة لإلغاء الاشتراك لاحقًا
};

export const unsubscribeFromChannel = (channelName) => {
    if (echo) {
        echo.leaveChannel(channelName);
        console.log(`Unsubscribed from channel: ${channelName}`);
    }
};
