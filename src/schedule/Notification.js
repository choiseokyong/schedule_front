import React, { useEffect, useState } from 'react';
import '../css/Notification.css';

function Notification({ id, message, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose(id);
    }, 3000); // 3초 후 자동 제거

    return () => clearTimeout(timer);
  }, [id, onClose]);

  if (!visible) return null;

  return (
    <div className="toast">
      <span>{message}</span>
      <button className="close-btn" onClick={() => {
        setVisible(false);
        onClose(id);
      }}>×</button>
    </div>
  );
}

export default Notification;
