import { describe, it, expect } from 'vitest';

// Функция проверки конфликтов
function checkConflicts(
  board: (number | null)[][],
  row: number,
  col: number,
  value: number
): boolean {
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === value) return true;
  }
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === value) return true;
  }
  const blockRow = Math.floor(row / 3) * 3;
  const blockCol = Math.floor(col / 3) * 3;
  for (let r = blockRow; r < blockRow + 3; r++) {
    for (let c = blockCol; c < blockCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === value) return true;
    }
  }
  return false;
}

// Функция проверки победы
function checkWin(board: (number | null)[][], conflicts: boolean[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) return false;
      if (conflicts[row][col]) return false;
    }
  }
  return true;
}

describe('Sudoku Logic', () => {
  const board = [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9],
  ];

  it('должен отклонить число 3 в позиции (0,0) — конфликт в строке', () => {
    expect(checkConflicts(board, 0, 0, 3)).toBe(true);
  });

  it('должен принять число 4 в позиции (0,2) — конфликтов нет', () => {
    expect(checkConflicts(board, 0, 2, 4)).toBe(false);
  });
  
  it('должен вернуть false, если есть пустые ячейки', () => {
    const conflicts = Array(9).fill(null).map(() => Array(9).fill(false));
    expect(checkWin(board, conflicts)).toBe(false);
  });
});