import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveBestTime, getBestTime } from './storage';
import type { Difficulty } from '../features/sudoku/types';

// Мок localStorage для тестовой среды Node.js
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string): string | null {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    clear() {
      store = {};
    },
    removeItem(key: string) {
      delete store[key];
    },
  };
})();

describe('storage', () => {
  beforeEach(() => {
    // Заменяем глобальный localStorage на мок
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
    // Очищаем localStorage перед каждым тестом
    localStorage.clear();
    // Мокаем console.error, чтобы не засорять вывод тестов
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('saveBestTime и getBestTime', () => {
    it('сохраняет время, getBestTime его возвращает', () => {
      const difficulty: Difficulty = 'easy';
      const seconds = 120;
      
      saveBestTime(difficulty, seconds);
      const retrieved = getBestTime(difficulty);

      expect(retrieved).toBe(seconds);
    });

    it('не перезаписывает рекорд худшим временем', () => {
      const difficulty: Difficulty = 'medium';
      const bestTime = 90;
      const worseTime = 150;

      // Сохраняем лучшее время
      saveBestTime(difficulty, bestTime);
      // Пытаемся сохранить худшее время
      saveBestTime(difficulty, worseTime);

      const retrieved = getBestTime(difficulty);
      expect(retrieved).toBe(bestTime); // Осталось лучшее время
    });
    
    it('возвращает null, если рекорда нет', () => {
      const difficulty: Difficulty = 'hard';
      const retrieved = getBestTime(difficulty);
      expect(retrieved).toBeNull();
    });

    // Дополнительные тесты для проверки edge cases
    it('сохраняет лучшее время для разных уровней сложности независимо', () => {
      saveBestTime('easy', 100);
      saveBestTime('medium', 200);
      saveBestTime('hard', 300);

      expect(getBestTime('easy')).toBe(100);
      expect(getBestTime('medium')).toBe(200);
      expect(getBestTime('hard')).toBe(300);
    });
    
    it('перезаписывает рекорд, если новое время лучше', () => {
      const difficulty: Difficulty = 'easy';
      saveBestTime(difficulty, 200);
      saveBestTime(difficulty, 150); // Лучшее время
      
      expect(getBestTime(difficulty)).toBe(150);
    });
    
    it('обрабатывает ошибку localStorage (возвращает null)', () => {
      // Симулируем ошибку при чтении localStorage
      const getItemSpy = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Mocked error');
      });

      const result = getBestTime('easy');
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
      
      getItemSpy.mockRestore();
    });
  });
});