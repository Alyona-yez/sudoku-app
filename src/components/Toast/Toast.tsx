import { useEffect, useState } from 'react';
import './Toast.css';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const ToastNotification = ({ message, duration = 2000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Плавное появление
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    // Автоматическое скрытие через duration
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // даём время на анимацию исчезновения
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  return (
    <div className={`toast-container ${isVisible ? 'toast-visible' : ''}`}>
      <div className="toast">
        <div className="toast-icon">
          {/* Иконка сакуры или предупреждения */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="toast-message">{message}</div>
      </div>
    </div>
  );
};

export default ToastNotification;