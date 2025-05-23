import React from 'react';
import Notification from './Notification';
import '../css/Notification.css';

function NotificationList({ notifications, onClose }) {
  return (
    <div className="notification-list">
      {notifications.map((n) => (
        <Notification
          key={n.id}
          id={n.id}
          message={n.message}
          onClose={onClose}
        />
      ))}
    </div>
  );
}

export default NotificationList;
