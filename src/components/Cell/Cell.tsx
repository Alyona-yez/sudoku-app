import './Cell.css';

interface CellProps {
  value: number | null;
  isInitial: boolean;
  isValid: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: (row: number, col: number) => void;
  row: number;
  col: number;
}

const Cell = ({
  value,
  isInitial,
  isValid,
  isSelected,
  isHighlighted,
  onClick,
  row,
  col,
}: CellProps) => {
  const handleClick = () => {
    if (!isInitial) {
      onClick(row, col);
    }
  };

  // Формируем классы
  let cellClass = 'cell';
  if (isInitial) cellClass += ' cell-initial';
  if (!isValid) cellClass += ' cell-invalid';
  if (isSelected) cellClass += ' cell-selected';
  if (isHighlighted) cellClass += ' cell-highlighted';

  return (
    <div className={cellClass} onClick={handleClick}>
      {value !== null ? value : ''}
    </div>
  );
};

export default Cell;