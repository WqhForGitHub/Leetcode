// ============================================================
// 008. N 皇后
// ============================================================
// LeetCode 51. N-Queens
// 在 n×n 棋盘上放置 n 个皇后，使其互不攻击（不同行、不同列、不同对角线）。
// 返回所有不同的棋盘解。
// 时间复杂度：O(n!)，逐行放置，每行可选列数递减

// 方法1：回溯 + 集合验证列/对角线（推荐）
// 逐行放置皇后，用集合记录已被占用的列、主对角线、副对角线
// 主对角线：row - col 相同；副对角线：row + col 相同
// 时间复杂度 O(n!)，空间复杂度 O(n)
function solveNQueens(n: number): string[][] {
  const result: string[][] = [];
  // queens[i] 表示第 i 行皇后所在的列
  const queens: number[] = new Array(n).fill(-1);
  // 已占用的列、主对角线(row-col)、副对角线(row+col)
  const cols: Set<number> = new Set();
  const diag1: Set<number> = new Set();
  const diag2: Set<number> = new Set();

  // 生成棋盘字符串
  const generateBoard = (): string[] => {
    const board: string[] = [];
    for (let i = 0; i < n; i++) {
      const row: string[] = new Array(n).fill(".");
      row[queens[i]] = "Q";
      board.push(row.join(""));
    }
    return board;
  };

  const backtrack = (row: number): void => {
    // 所有行都已放置，收集结果
    if (row === n) {
      result.push(generateBoard());
      return;
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
        continue;
      }
      // 放置皇后
      queens[row] = col;
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      backtrack(row + 1);
      // 回溯
      queens[row] = -1;
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  };

  backtrack(0);
  return result;
}

// 方法2：回溯 + 位运算优化
// 用整数的二进制位记录已被占用的列、主对角线、副对角线
// 时间复杂度 O(n!)，空间复杂度更优
function solveNQueensBit(n: number): string[][] {
  const result: string[][] = [];
  const queens: number[] = new Array(n).fill(-1);
  // mask 的低 n 位表示可用的列
  const full: number = (1 << n) - 1;

  const generateBoard = (): string[] => {
    const board: string[] = [];
    for (let i = 0; i < n; i++) {
      const row: string[] = new Array(n).fill(".");
      row[queens[i]] = "Q";
      board.push(row.join(""));
    }
    return board;
  };

  // cols: 已占用列，d1: 主对角线占用，d2: 副对角线占用
  const backtrack = (row: number, cols: number, d1: number, d2: number): void => {
    if (row === n) {
      result.push(generateBoard());
      return;
    }
    // 当前可用的列 = 全部列 去掉 已占用列、主对角线、副对角线
    // d1 向右移（下一行主对角线偏移），d2 向左移
    const available: number = full & ~(cols | d1 | d2);
    let bits: number = available;
    while (bits !== 0) {
      // 取最低位的 1
      const pick: number = bits & -bits;
      const col: number = Math.log2(pick);
      queens[row] = col;
      // 下一行：cols 加入 pick，d1 右移加入 pick，d2 左移加入 pick
      backtrack(row + 1, cols | pick, (d1 | pick) >> 1, (d2 | pick) << 1);
      queens[row] = -1;
      // 清除最低位的 1
      bits &= bits - 1;
    }
  };

  backtrack(0, 0, 0, 0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 008. N 皇后 =====");
console.log(solveNQueens(4)); // 期望结果: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
console.log(solveNQueens(1)); // 期望结果: [["Q"]]
console.log(solveNQueensBit(4)); // 期望结果: 2 个解
console.log(solveNQueensBit(1)); // 期望结果: [["Q"]]

export {};
