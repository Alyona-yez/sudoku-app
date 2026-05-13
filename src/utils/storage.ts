export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameResult {
  date: string;
  time: number;
  difficulty: Difficulty;
}

const BEST_TIME_KEY = 'sudoku_best_time';
const HISTORY_KEY = 'sudoku_history';

/**
 * Сохраняет лучшее время для указанного уровня сложности, если новое время меньше текущего рекорда
 * @param difficulty - уровень сложности ('easy', 'medium', 'hard')
 * @param seconds - время в секундах
 * @returns void
 */
export const saveBestTime = (difficulty: Difficulty, seconds: number): void => {
  try {
    const bestTimes = getBestTimes();
    const currentBest = bestTimes[difficulty];

    if (!currentBest || seconds < currentBest) {
      bestTimes[difficulty] = seconds;
      localStorage.setItem(BEST_TIME_KEY, JSON.stringify(bestTimes));
    }
  } catch (e) {
    console.error('Ошибка сохранения лучшего времени:', e);
  }
};

/**
 * Возвращает лучшее время для указанного уровня сложности
 * @param difficulty - уровень сложности ('easy', 'medium', 'hard')
 * @returns время в секундах или null, если рекорда нет
 */
export const getBestTime = (difficulty: Difficulty): number | null => {
  try {
    const bestTimes = getBestTimes();
    return bestTimes[difficulty] ?? null;
  } catch (e) {
    console.error('Ошибка получения лучшего времени:', e);
    return null;
  }
};

/**
 * Возвращает все лучшие времена для всех уровней сложности
 * @returns объект с полями easy, medium, hard, содержащими время в секундах (0, если рекорда нет)
 */
export const getBestTimes = (): Record<Difficulty, number> => {
  try {
    const raw = localStorage.getItem(BEST_TIME_KEY);
    return raw ? JSON.parse(raw) : { easy: 0, medium: 0, hard: 0 };
  } catch (e) {
    console.error('Ошибка получения всех лучших времён:', e);
    return { easy: 0, medium: 0, hard: 0 };
  }
};

/**
 * Сохраняет результат завершённой игры в историю (максимум 10 последних записей)
 * @param difficulty - уровень сложности ('easy', 'medium', 'hard')
 * @param seconds - время завершения игры в секундах
 * @returns void
 */
export const saveGameResult = (difficulty: Difficulty, seconds: number): void => {
  try {
    const history = getGameHistory();
    history.unshift({
      date: new Date().toLocaleString(),
      time: seconds,
      difficulty,
    });
    const trimmed = history.slice(0, 10);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Ошибка сохранения истории:', e);
  }
};

/**
 * Возвращает историю игр (последние 10 завершённых игр)
 * @returns массив объектов GameResult, отсортированный от новых к старым
 */
export const getGameHistory = (): GameResult[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Ошибка получения истории:', e);
    return [];
  }
};