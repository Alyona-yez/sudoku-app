import { useEffect, useState } from 'react';
import './Confetti.css';

interface ConfettiProps {
  active: boolean;
  duration?: number; // длительность анимации в миллисекундах
}

interface Particle {
  id: number;
  x: number; // процент от ширины экрана
  y: number; // начальная позиция
  size: number; // размер в пикселях
  color: string;
  rotation: number;
  rotationSpeed: number;
  fallSpeed: number;
  sway: number;
  swaySpeed: number;
}

const Confetti = ({ active, duration = 5000 }: ConfettiProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Цвета лепестков сакуры (розовые оттенки)
  const colors = [
    '#ffb6c1', // LightPink
    '#ff69b4', // HotPink
    '#db7093', // PaleVioletRed
    '#ffc0cb', // Pink
    '#ff1493', // DeepPink
    '#ff9ebb', // Lighter pink
    '#ff77aa', // Medium pink
  ];

  // Создание частиц при активации
  useEffect(() => {
    if (!active) {
      // Очистить частицы через некоторое время после завершения анимации
      const timer = setTimeout(() => setParticles([]), duration + 1000);
      return () => clearTimeout(timer);
    }

    // Количество частиц
    const particleCount = 150;
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100, // 0-100%
        y: -10 - Math.random() * 20, // начинают выше экрана
        size: 8 + Math.random() * 12, // 8-20px
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        fallSpeed: 0.5 + Math.random() * 1.5, // скорость падения
        sway: Math.random() * 10,
        swaySpeed: 0.5 + Math.random() * 1,
      });
    }

    setParticles(newParticles);

    // Автоматическое отключение через duration
    const timeout = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timeout);
  }, [active, duration]);

  if (!active && particles.length === 0) {
    return null;
  }

  return (
    <div className="confetti-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animationDuration: `${3 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 0.5}s`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;