// ============================================================
// 003. 解数独
// ============================================================
// LeetCode 37. Sudoku Solver
// 给定一个 9x9 的数独棋盘（空格用 '.' 表示），编写程序求解数独。
// 每行、每列、每个 3x3 宫格内 1-9 不能重复。
// 时间复杂度：O(9^m)，m 为空格数量

// 方法1：回溯 + 集合验证（推荐）
// 使用集合记录每行、每列、每宫已使用的数字，回溯填入空格
// 时间复杂度 O(9^m)，空间复杂度 O(m) 递归 + O(81) 集合
function solveSudoku(board: string[][]): void {
  // 行、列、宫已使用的数字集合
  const rows: Set<string>[] = Array.from({ length: 9 }, () => new Set<string>());
  const cols: Set<string>[] = Array.from({ length: 9 }, () => new Set<string>());
  const boxes: Set<string>[] = Array.from({ length: 9 }, () => new Set<string>());

  // 计算宫格索引
  const boxIndex = (r: number, c: number): number => Math.floor(r / 3) * 3 + Math.floor(c / 3);

  // 初始化集合
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const ch: string = board[r][c];
      if (ch !== ".") {
        rows[r].add(ch);
        cols[c].add(ch);
        boxes[boxIndex(r, c)].add(ch);
      }
    }
  }

  // 回溯函数：从位置 pos 开始尝试填充
  const backtrack = (pos: number): boolean => {
    if (pos === 81) {
      return true; // 所有格子已填完
    }
    const r: number = Math.floor(pos / 9);
    const c: number = pos % 9;
    // 已填数字直接跳到下一格
    if (board[r][c] !== ".") {
      return backtrack(pos + 1);
    }
    const bIdx: number = boxIndex(r, c);
    for (let num = 1; num <= 9; num++) {
      const ch: string = String(num);
      // 检查是否冲突
      if (rows[r].has(ch) || cols[c].has(ch) || boxes[bIdx].has(ch)) {
        continue;
      }
      // 尝试填入
      board[r][c] = ch;
      rows[r].add(ch);
      cols[c].add(ch);
      boxes[bIdx].add(ch);
      if (backtrack(pos + 1)) {
        return true;
      }
      // 回溯
      board[r][c] = ".";
      rows[r].delete(ch);
      cols[c].delete(ch);
      boxes[bIdx].delete(ch);
    }
    return false;
  };

  backtrack(0);
}

// 方法2：回溯 + 位运算优化
// 用整数的二进制位记录已使用的数字，用位运算快速判断冲突
// 时间复杂度 O(9^m)，空间复杂度更优（位运算紧凑存储）
function solveSudokuBit(board: string[][]): void {
  // rows[i], cols[i], boxes[i] 各用 9 位记录数字 1-9 是否已使用
  const rows: number[] = new Array(9).fill(0);
  const cols: number[] = new Array(9).fill(0);
  const boxes: number[] = new Array(9).fill(0);

  const boxIndex = (r: number, c: number): number => Math.floor(r / 3) * 3 + Math.floor(c / 3);

  // 初始化位掩码
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const ch: string = board[r][c];
      if (ch !== ".") {
        const bit: number = 1 << (Number(ch) - 1);
        rows[r] |= bit;
        cols[c] |= bit;
        boxes[boxIndex(r, c)] |= bit;
      }
    }
  }

  const backtrack = (pos: number): boolean => {
    if (pos === 81) {
      return true;
    }
    const r: number = Math.floor(pos / 9);
    const c: number = pos % 9;
    if (board[r][c] !== ".") {
      return backtrack(pos + 1);
    }
    const bIdx: number = boxIndex(r, c);
    // 已使用的数字位
    const used: number = rows[r] | cols[c] | boxes[bIdx];
    for (let num = 1; num <= 9; num++) {
      const bit: number = 1 << (num - 1);
      if ((used & bit) !== 0) {
        continue; // 该数字已被使用
      }
      board[r][c] = String(num);
      rows[r] |= bit;
      cols[c] |= bit;
      boxes[bIdx] |= bit;
      if (backtrack(pos + 1)) {
        return true;
      }
      // 回溯
      board[r][c] = ".";
      rows[r] &= ~bit;
      cols[c] &= ~bit;
      boxes[bIdx] &= ~bit;
    }
    return false;
  };

  backtrack(0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 003. 解数独 =====");
const board1: string[][] = [
  ["5", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"],
];
solveSudoku(board1);
console.log(board1);

const board2: string[][] = [
  ["5", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"],
];
solveSudokuBit(board2);
console.log(board2);

export {};
