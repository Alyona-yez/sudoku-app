import './App.css';
import GameBoard from './components/GameBoard/GameBoard';
import Timer from './components/Timer/Timer';
import DifficultySelector from './components/DifficultySelector/DifficultySelector';
import VictoryModal from './components/VictoryModal/VictoryModal';
import ToastNotification from './components/Toast/Toast';
import Confetti from './components/Confetti/Confetti';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import { useSudokuGame } from './hooks/useSudokuGame';
import { getBestTime } from './utils/storage';
import { useState, useEffect } from 'react';

function App() {
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Добавление/удаление класса dark-theme на body
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    // Очистка при размонтировании
    return () => {
      document.body.classList.remove('dark-theme');
    };
  }, [isDarkTheme]);

  const handleError = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const {
    board,
    conflicts,
    selectedCell,
    initialBoard,
    isGameWon,
    isTimerRunning,
    timerResetTrigger,
    difficulty,
    handleCellClick,
    resetGame,
    handleDifficultyChange,
    finishGame,
  } = useSudokuGame(handleError);

  // Функция обновления лучшего времени
  const updateBestTime = () => {
    const time = getBestTime(difficulty);
    setBestTime(time && time > 0 ? time : null);
  };

  // Обновление лучшего времени при смене сложности
  useEffect(() => {
    updateBestTime();
  }, [difficulty]);

  // Показ модального окна и конфетти при победе
  useEffect(() => {
    if (isGameWon && currentSeconds > 0) {
      finishGame(currentSeconds);
      setShowVictoryModal(true);
      setShowConfetti(true);
      // Обновляем лучшее время после победы
      setTimeout(() => updateBestTime(), 100);
    }
  }, [isGameWon, currentSeconds]);

  const handleCloseModal = () => {
    setShowVictoryModal(false);
    setShowConfetti(false);
    resetGame();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app">
      <ThemeToggle isDark={isDarkTheme} onToggle={toggleTheme} />
      <div className="game-container">
        <h1 className="game-title">Судоку</h1>
        <div className="subtitle">✦ 数 独 ✦</div>

        <DifficultySelector
          currentDifficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
        />

        <Timer
          key={timerResetTrigger}
          isRunning={isTimerRunning && !isGameWon}
          onReset={resetGame}
          onTimeUpdate={(seconds) => setCurrentSeconds(seconds)}
        />

        {bestTime !== null && (
          <div className="best-time">
            🏆 Лучшее время: {formatTime(bestTime)}
          </div>
        )}

        <GameBoard
          board={board}
          onCellClick={handleCellClick}
          conflicts={conflicts}
          selectedCell={selectedCell}
          initialBoard={initialBoard}
        />

        <div className="controls">
          <button className="new-game-btn" onClick={resetGame}>
            🌸 Новая игра 🌸
          </button>
        </div>

        <VictoryModal
          isOpen={showVictoryModal}
          onClose={handleCloseModal}
          time={formatTime(currentSeconds)}
        />

        {toastMessage && (
          <ToastNotification
            message={toastMessage}
            duration={2000}
            onClose={() => setToastMessage(null)}
          />
        )}

        <Confetti active={showConfetti} duration={8000} />
      </div>
    </div>
  );
}

export default App;