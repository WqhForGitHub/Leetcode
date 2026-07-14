// ============================================================
// 009. N 皇后 II
// ============================================================
// LeetCode 52. N-Queens II
// 返回 n 皇后问题的不同解的数目（不返回棋盘）。
// 时间复杂度：O(n!)

// 方法1：回溯 + 集合（推荐）
// 用集合记录已占用的列和对角线，回溯计数
// 时间复杂度 O(n!)，空间复杂度 O(n)
function totalNQueens(n: number): number {
  let count: number = 0;
  const cols: Set<number> = new Set();
  const diag1: Set<number> = new Set();
  const diag2: Set<number> = new Set();

  const backtrack = (row: number): void => {
    if (row === n) {
      count++;
      return;
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
        continue;
      }
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      backtrack(row + 1);
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  };

  backtrack(0);
  return count;
}

// 方法2：回溯 + 位运算
// 用位掩码记录占用状态，效率更高
// 时间复杂度 O(n!)，空间复杂度 O(n) 递归栈
function totalNQueensBit(n: number): number {
  let count: number = 0;
  const full: number = (1 << n) - 1;

  // cols: 列占用，d1: 主对角线占用，d2: 副对角线占用
  const backtrack = (row: number, cols: number, d1: number, d2: number): void => {
    if (row === n) {
      count++;
      return;
    }
    // 当前可用列
    const available: number = full & ~(cols | d1 | d2);
    let bits: number = available;
    while (bits !== 0) {
      // 取最低位的 1 作为放置位置
      const pick: number = bits & -bits;
      backtrack(row + 1, cols | pick, (d1 | pick) >> 1, (d2 | pick) << 1);
      // 清除最低位
      bits &= bits - 1;
    }
  };

  backtrack(0, 0, 0, 0);
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 009. N 皇后 II =====");
console.log(totalNQueens(4)); // 期望结果: 2
console.log(totalNQueens(1)); // 期望结果: 1
console.log(totalNQueens(8)); // 期望结果: 92
console.log(totalNQueensBit(4)); // 期望结果: 2
console.log(totalNQueensBit(1)); // 期望结果: 1
console.log(totalNQueensBit(8)); // 期望结果: 92

export {};
