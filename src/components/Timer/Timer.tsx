import { useState, useEffect, useCallback } from 'react';
import './Timer.css';

interface TimerProps {
  isRunning: boolean;
  onReset: () => void;
  onTimeUpdate?: (seconds: number) => void;
}

const Timer = ({ isRunning, onReset, onTimeUpdate }: TimerProps) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning) {
      interval = window.setInterval(() => {
        setSeconds(prev => {
          const updated = prev + 1;
          onTimeUpdate?.(updated);
          return updated;
        });
      }, 1000);
    }

    return () => {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
  }, [isRunning, onTimeUpdate]);

  const formatTime = useCallback((totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleReset = () => {
    setSeconds(0);
    onReset();
  };

  return (
    <div className="timer-container">
      <div className="timer-display">
        <span className="timer-label">ВРЕМЯ</span>
        <span className="timer-value">{formatTime(seconds)}</span>
      </div>
      <button className="timer-reset" onClick={handleReset}>
        Сброс
      </button>
    </div>
  );
};

export default Timer;