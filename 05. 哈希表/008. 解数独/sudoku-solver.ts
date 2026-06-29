// ============================================================
// 008. 解数独
// ============================================================
// LeetCode 37. Sudoku Solver
// 解数独，在空格中填入数字使数独有效。
// 回溯 + 哈希集合记录行列宫。
// 时间复杂度：指数级，空间复杂度：O(81)

function solveSudoku(board: string[][]): void {
  const rows = Array.from({ length: 9 }, () => new Set<string>());
  const cols = Array.from({ length: 9 }, () => new Set<string>());
  const boxes = Array.from({ length: 9 }, () => new Set<string>());
  const empties: [number, number][] = [];

  // 初始化：记录已有数字，收集空格位置
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const ch = board[r][c];
      if (ch === ".") {
        empties.push([r, c]);
      } else {
        const boxIndex = Math.floor(r / 3) * 3 + Math.floor(c / 3);
        rows[r].add(ch);
        cols[c].add(ch);
        boxes[boxIndex].add(ch);
      }
    }
  }

  const backtrack = (index: number): boolean => {
    if (index === empties.length) return true;
    const [r, c] = empties[index];
    const boxIndex = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    for (let num = 1; num <= 9; num++) {
      const ch = String(num);
      if (rows[r].has(ch) || cols[c].has(ch) || boxes[boxIndex].has(ch)) continue;
      board[r][c] = ch;
      rows[r].add(ch);
      cols[c].add(ch);
      boxes[boxIndex].add(ch);
      if (backtrack(index + 1)) return true;
      // 回溯
      board[r][c] = ".";
      rows[r].delete(ch);
      cols[c].delete(ch);
      boxes[boxIndex].delete(ch);
    }
    return false;
  };

  backtrack(0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 008. 解数独 =====");
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
console.log("测试1:");
board1.forEach((row) => console.log(row.join(" ")));
// 预期: 完整解出的数独

const board2: string[][] = [
  [".", ".", "9", "7", "4", "8", ".", ".", "."],
  ["7", ".", ".", ".", ".", ".", ".", ".", "."],
  [".", "2", ".", "1", ".", "9", ".", ".", "."],
  [".", ".", "7", ".", ".", ".", "2", "4", "."],
  [".", "6", "4", ".", "1", ".", "5", "9", "."],
  [".", "9", "8", ".", ".", ".", "3", ".", "."],
  [".", ".", ".", "8", ".", "3", ".", "2", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "6"],
  [".", ".", ".", "2", "7", "5", "9", ".", "."],
];
solveSudoku(board2);
console.log("测试2:");
board2.forEach((row) => console.log(row.join(" ")));
// 预期: 完整解出的数独

export {};
