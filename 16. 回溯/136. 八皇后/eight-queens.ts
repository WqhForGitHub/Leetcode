// ============================================================
// 136. 八皇后
// ============================================================
// 面试金典 CCI 08.12. 八皇后
// 在 8×8 棋盘上放置 8 个皇后，使其互不攻击。返回所有不同摆法。
// 每种解以列位置数组表示：solutions[i] 表示第 i 行皇后所在列。
// 时间复杂度：O(N!), 空间复杂度：O(N)

// 方法1：回溯+集合验证 (推荐)
// 逐行放置皇后，用集合记录已占用的列、主对角线(row-col)、副对角线(row+col)。
// 时间复杂度 O(N!), 空间复杂度 O(N)
function solveEightQueens(n: number = 8): number[][] {
  const result: number[][] = [];
  const queens: number[] = []; // queens[row] = col
  const cols: Set<number> = new Set();
  const diag1: Set<number> = new Set(); // row - col
  const diag2: Set<number> = new Set(); // row + col

  const backtrack = (row: number): void => {
    if (row === n) {
      result.push([...queens]);
      return;
    }
    for (let col: number = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
        continue;
      }
      // 放置皇后
      queens.push(col);
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      backtrack(row + 1);
      // 回溯
      queens.pop();
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  };

  backtrack(0);
  return result;
}

// 方法2：回溯+位运算
// 用整数的二进制位表示已占用的列与两条对角线，利用位运算快速求可用位置。
// 时间复杂度 O(N!), 空间复杂度 O(N)
function solveEightQueensBit(n: number = 8): number[][] {
  const result: number[][] = [];
  const queens: number[] = [];
  const mask: number = (1 << n) - 1;

  // columns: 列占用, diag1: 主对角线占用, diag2: 副对角线占用
  const backtrack = (row: number, columns: number, diag1: number, diag2: number): void => {
    if (row === n) {
      result.push([...queens]);
      return;
    }
    // 可用位置：未被任何占用位影响
    let available: number = mask & ~(columns | diag1 | diag2);
    while (available !== 0) {
      // 取最低位的 1
      const pos: number = available & -available;
      // 该位对应的列号（整数安全的位位置计算）
      const col: number = 31 - Math.clz32(pos);
      queens.push(col);
      // 更新占用：diag1 左移（下一行 row-col 增大需左移1），diag2 右移
      backtrack(row + 1, columns | pos, (diag1 | pos) << 1, (diag2 | pos) >>> 1);
      queens.pop();
      // 清除该位
      available &= available - 1;
    }
  };

  backtrack(0, 0, 0, 0);
  return result;
}

// 将列位置解转换为棋盘字符串形式（便于查看）
function formatBoard(queens: number[]): string[] {
  const n: number = queens.length;
  return queens.map((col) => ".".repeat(col) + "Q" + ".".repeat(n - col - 1));
}

// ============================================================
// 测试
// ============================================================
console.log("===== 136. 八皇后 =====");
const solutions1: number[][] = solveEightQueens(8);
console.log("8 皇后解的数量 (方法1):", solutions1.length); // 期望结果: 92
const solutions2: number[][] = solveEightQueensBit(8);
console.log("8 皇后解的数量 (方法2):", solutions2.length); // 期望结果: 92
console.log("4 皇后解的数量:", solveEightQueens(4).length); // 期望结果: 2
console.log("第一个 4 皇后解:", formatBoard(solveEightQueens(4)[0]));
// 期望结果类似: [".Q..","...Q","Q...","..Q."]

export {};
