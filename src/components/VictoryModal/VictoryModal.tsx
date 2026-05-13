import './VictoryModal.css';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  time: string;
}

const VictoryModal = ({ isOpen, onClose, time }: VictoryModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close" onClick={onClose}>✖</div>
        <div className="modal-emoji">🌸🎉🌸</div>
        <h2 className="modal-title">Поздравляем!</h2>
        <p className="modal-message">Вы решили судоку!</p>
        <div className="modal-time">
          <span className="time-label">Время решения:</span>
          <span className="time-value">{time}</span>
        </div>
        <button className="modal-button" onClick={onClose}>
          Продолжить
        </button>
        <div className="modal-sakura">✿ 桜 ✿</div>
      </div>
    </div>
  );
};

export default VictoryModal;