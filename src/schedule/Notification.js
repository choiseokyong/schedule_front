import React, { useState } from 'react';
import '../css/Notification.css';

function Notification({ message }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="notification-banner">
      <div className="notification-content">
        <span className="notification-message">{message}</span>
        <button
          className="notification-close"
          onClick={() => setVisible(false)}
          aria-label="닫기"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Notification;
