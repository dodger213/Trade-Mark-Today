import { useEffect } from 'react';

const NotificationComponent = ({ msg }: { msg: string }) => {
  // useEffect(() => {
  //   Notification.requestPermission();    
  // }, []);
  useEffect(() => {
    if (!msg) return;
    (async () => {
      await Notification.requestPermission();
      if (Notification.permission === 'granted') {
        (new Notification(msg, {
          icon: '/trademarktoday.png',
          badge: '/dollar.png',
          // tag: 'message-notification',
          // data: { messageId: Math.random() * 100 },
          requireInteraction: false,
          silent: false,
          // actions: [
          //     { action: 'reply', title: 'Reply' },
          //     { action: 'dismiss', title: 'Dismiss' },
          // ],
        })).onclick = () => {
          window.focus();
          // let link:any = document.querySelector("link[rel~='icon']");
          // if (!link) {
          //   // Create a new link element if it doesn't exist
          //   link = document.createElement('link');
          //   link.rel = 'icon';
          //   document.head.appendChild(link);
          // }
          // link.href = '/fav.ico';
        };
      }
    })();
  }, [msg])
  return null;
};

export default NotificationComponent;
