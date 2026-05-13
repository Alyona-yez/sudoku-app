import { useState, useEffect, useCallback } from 'react';
import { saveBestTime, saveGameResult } from '../utils/storage';
import type { Difficulty } from '../features/sudoku/types';

// Головоломки для разных уровней сложности
const PUZZLES = {
  easy: [
    [5, 3, null, null, 7, null, 9, null, 2],
    [6, null, null, 1, 9, 5, null, 4, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, 9, null, 6, null, 4, null, 3],
    [4, null, 6, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, 5, 6],
    [null, 6, null, 5, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [3, null, 5, null, 8, null, null, 7, 9],
  ],
  medium: [
    [null, 2, null, 6, null, 8, null, null, null],
    [5, 8, null, null, null, 9, 7, null, null],
    [null, 7, null, null, 4, null, null, null, 6],
    [null, null, null, null, null, 3, null, 1, 8],
    [9, null, 2, null, 5, null, 3, null, 7],
    [1, 3, null, 7, null, null, null, null, null],
    [2, null, null, null, 9, null, null, 4, null],
    [null, null, 7, 4, null, null, null, 2, 5],
    [null, null, null, 2, null, 1, null, 9, null],
  ],
  hard: [
    [null, 6, null, null, null, null, 9, null, null],
    [null, null, 5, null, 2, null, null, 7, null],
    [null, null, null, 9, null, 7, null, null, 4],
    [null, null, 6, null, null, null, 2, null, 1],
    [8, null, null, 3, null, 5, null, null, 9],
    [3, null, 2, null, null, null, 6, null, null],
    [1, null, null, 6, null, 4, null, null, null],
    [null, 3, null, null, 9, null, 7, null, null],
    [null, null, 7, null, null, null, null, 5, null],
  ],
};

/**
 * Проверяет, вызывает ли размещение числа в указанной ячейке конфликт.
 * Проверяет строку, столбец и блок 3x3 на наличие того же числа.
 * @param board - Двумерный массив 9x9, представляющий текущее состояние доски.
 * @param row - Индекс строки (0-8).
 * @param col - Индекс столбца (0-8).
 * @param value - Число для проверки (1-9).
 * @returns true, если число уже присутствует в строке, столбце или блоке 3x3, иначе false.
 */
const checkConflicts = (
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
 * Вычисляет матрицу конфликтов для всей доски.
 * Для каждой заполненной ячейки проверяет, вызывает ли её значение конфликт.
 * @param board - Двумерный массив 9x9, представляющий текущее состояние доски.
 * @returns Матрицу 9x9 булевых значений, где true означает конфликт в соответствующей ячейке.
 */
const getAllConflicts = (board: (number | null)[][]): boolean[][] => {
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
 * Проверяет, выполнены ли условия победы в судоку.
 * Победа достигается, когда все ячейки заполнены и нет конфликтов.
 * @param board - Двумерный массив 9x9, представляющий текущее состояние доски.
 * @param conflicts - Матрица 9x9 булевых значений, указывающая на конфликты в ячейках.
 * @returns true, если все ячейки заполнены и нет конфликтов, иначе false.
 */
const checkWin = (board: (number | null)[][], conflicts: boolean[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) return false;
      if (conflicts[row][col]) return false;
    }
  }
  return true;
};

export const useSudokuGame = (onError?: (message: string) => void) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [board, setBoard] = useState<(number | null)[][]>(() =>
    JSON.parse(JSON.stringify(PUZZLES.easy))
  );
  const [conflicts, setConflicts] = useState<boolean[][]>(() =>
    getAllConflicts(PUZZLES.easy)
  );
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerResetTrigger, setTimerResetTrigger] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [finalSeconds, setFinalSeconds] = useState<number | null>(null);

  const initialBoard: boolean[][] = board.map((row) =>
    row.map((cell) => cell !== null)
  );

  /**
   * Загружает головоломку выбранной сложности и сбрасывает состояние игры.
   * Обновляет доску, конфликты, выбранную ячейку, таймер и флаги победы/старта.
   * @param diff - Уровень сложности ('easy', 'medium', 'hard').
   * @returns Ничего не возвращает.
   */
  const loadPuzzle = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    const newBoard = JSON.parse(JSON.stringify(PUZZLES[diff]));
    setBoard(newBoard);
    setConflicts(getAllConflicts(newBoard));
    setSelectedCell(null);
    setIsGameWon(false);
    setHasStarted(false);
    setIsTimerRunning(false);
    setTimerResetTrigger(prev => prev + 1);
    setFinalSeconds(null);
  }, []);

  /**
   * Обрабатывает изменение сложности игры.
   * Вызывает загрузку новой головоломки с указанной сложностью.
   * @param diff - Уровень сложности ('easy', 'medium', 'hard').
   * @returns Ничего не возвращает.
   */
  const handleDifficultyChange = useCallback((diff: Difficulty) => {
    loadPuzzle(diff);
  }, [loadPuzzle]);

  /**
   * Завершает игру, сохраняя лучший результат и историю игры.
   * Вызывается только в случае победы (isGameWon === true).
   * @param seconds - Время завершения игры в секундах.
   * @returns Ничего не возвращает.
   */
  const finishGame = (seconds: number) => {
    if (!isGameWon) return;
    saveBestTime(difficulty, seconds);
    saveGameResult(difficulty, seconds);
  };

  /**
   * Устанавливает значение в указанную ячейку доски.
   * Проверяет, можно ли изменить ячейку (не исходная, игра не завершена).
   * Проверяет конфликты, запускает таймер при первом ходе, обновляет доску и конфликты.
   * Если после установки достигается победа, помечает игру как выигранную и останавливает таймер.
   * @param row - Индекс строки (0-8).
   * @param col - Индекс столбца (0-8).
   * @param num - Число для установки (1-9) или null для очистки ячейки.
   * @returns Ничего не возвращает.
   */
  const setValue = (row: number, col: number, num: number | null) => {
    if (isGameWon) return;
    if (initialBoard[row][col]) return;

    // Проверка конфликта перед установкой числа
    if (num !== null && checkConflicts(board, row, col, num)) {
      if (onError) {
        onError('Число уже есть в строке, столбце или блоке 3x3');
      }
      return;
    }

    if (!hasStarted) {
      setHasStarted(true);
      setIsTimerRunning(true);
    }

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);
    
    const newConflicts = getAllConflicts(newBoard);
    setConflicts(newConflicts);

    if (checkWin(newBoard, newConflicts)) {
      setIsGameWon(true);
      setIsTimerRunning(false);
    }
  };

  /**
   * Обрабатывает клик по ячейке доски.
   * Выбирает ячейку для последующего ввода числа, если игра не завершена и ячейка не является исходной.
   * @param row - Индекс строки (0-8).
   * @param col - Индекс столбца (0-8).
   * @returns Ничего не возвращает.
   */
  const handleCellClick = useCallback((row: number, col: number) => {
    if (isGameWon) return;
    if (initialBoard[row][col]) return;
    setSelectedCell({ row, col });
  }, [isGameWon, board]);

  const updateFinalSeconds = (seconds: number) => {
    setFinalSeconds(seconds);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const key = e.key;
      const num = parseInt(key);

      if (!isNaN(num) && num >= 1 && num <= 9) {
        setValue(selectedCell.row, selectedCell.col, num);
        setSelectedCell(null);
      } else if (key === 'Delete' || key === 'Backspace') {
        setValue(selectedCell.row, selectedCell.col, null);
        setSelectedCell(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell]);

  /**
   * Сбрасывает текущую игру, загружая головоломку той же сложности.
   * Восстанавливает исходное состояние доски, конфликтов, таймера и флагов.
   * @returns Ничего не возвращает.
   */
  const resetGame = useCallback(() => {
    loadPuzzle(difficulty);
  }, [loadPuzzle, difficulty]);

  return {
    board,
    conflicts,
    selectedCell,
    initialBoard,
    isGameWon,
    isTimerRunning,
    timerResetTrigger,
    difficulty,
    finalSeconds,
    handleCellClick,
    setValue,
    resetGame,
    handleDifficultyChange,
    finishGame,
    updateFinalSeconds,
  };
};