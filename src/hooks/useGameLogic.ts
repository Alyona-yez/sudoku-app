/**
 * Проверяет, конфликтует ли число с существующими в строке, столбце или блоке 3x3
 * @param board - текущее игровое поле 9x9
 * @param row - строка (0-8)
 * @param col - столбец (0-8)
 * @param value - проверяемое число (1-9)
 * @returns true - конфликт есть, false - конфликта нет
 */
export const checkConflicts = (
  board: (number | null)[][],
  row: number,
  col: number,
  value: number
): boolean => {
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
};

/**
 * Вычисляет конфликты для всех заполненных ячеек на поле
 * @param board - текущее игровое поле 9x9
 * @returns двумерный массив 9x9, где true означает конфликт в ячейке
 */
export const getAllConflicts = (board: (number | null)[][]): boolean[][] => {
  const conflicts: boolean[][] = Array(9).fill(null).map(() => Array(9).fill(false));
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];
      if (value !== null) {
        conflicts[row][col] = checkConflicts(board, row, col, value);
      }
    }
  }
  return conflicts;
};

/**
 * Проверяет, выполнены ли условия победы: все ячейки заполнены и нет конфликтов
 * @param board - текущее игровое поле 9x9
 * @param conflicts - массив конфликтов для каждой ячейки
 * @returns true - игра выиграна, false - игра не завершена
 */
export const checkWin = (board: (number | null)[][], conflicts: boolean[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) return false;
      if (conflicts[row][col]) return false;
    }
  }
  return true;
};