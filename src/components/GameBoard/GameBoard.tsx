import Cell from '../Cell/Cell';
import './GameBoard.css';

interface GameBoardProps {
  board: (number | null)[][];
  onCellClick: (row: number, col: number) => void;
  conflicts: boolean[][];
  selectedCell: { row: number; col: number } | null;
  initialBoard: boolean[][];
}

const GameBoard = ({
  board,
  onCellClick,
  conflicts,
  selectedCell,
  initialBoard,
}: GameBoardProps) => {
  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((value, colIndex) => {
            const isSelected =
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            const isInitial = initialBoard[rowIndex][colIndex];
            const isValid = !conflicts[rowIndex][colIndex];

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                value={value}
                isInitial={isInitial}
                isValid={isValid}
                isSelected={isSelected}
                isHighlighted={false}
                onClick={onCellClick}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;