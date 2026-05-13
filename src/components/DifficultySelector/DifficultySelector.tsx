import './DifficultySelector.css';

export type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

const DifficultySelector = ({ currentDifficulty, onDifficultyChange }: DifficultySelectorProps) => {
  const difficulties: { value: Difficulty; label: string; emoji: string }[] = [
    { value: 'easy', label: 'Лёгкая', emoji: '🌱' },
    { value: 'medium', label: 'Средняя', emoji: '🌸' },
    { value: 'hard', label: 'Сложная', emoji: '🍂' },
  ];

  return (
    <div className="difficulty-selector">
      {difficulties.map((diff) => (
        <button
          key={diff.value}
          className={`difficulty-btn ${currentDifficulty === diff.value ? 'active' : ''}`}
          onClick={() => onDifficultyChange(diff.value)}
        >
          <span className="difficulty-emoji">{diff.emoji}</span>
          <span className="difficulty-label">{diff.label}</span>
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;