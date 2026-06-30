// ============================================================
// 092. 使矩阵中的 1 互不相邻的最小操作数
// ============================================================
// LeetCode 2174. Remove All Ones With Row and Column Flips
// m×n 01 矩阵，每次操作可翻转某行或某列所有值。求最少操作数使所有 1 变为 0（若可行）。
// 关键观察：行翻转与列翻转可交换且每行/每列至多翻转一次。
// 时间复杂度：O(mn)，空间复杂度：O(m+n)

// 方法1：贪心（先按行使每行首列为 1，再按列使首行为 0，校验全 0）
// 返回操作序列：rows 为翻转的行号，cols 为翻转的列号。若不可行返回 null。
function removeOnesOps(grid: number[][]): { rows: number[]; cols: number[] } | null {
  const m = grid.length;
  const n = grid[0].length;
  // 复制避免修改输入
  const g = grid.map((row) => row.slice());
  const rows: number[] = [];
  const cols: number[] = [];

  // 第一步：对每行，若 grid[i][0] === 0 则翻转该行（让首列全为 1）
  for (let i = 0; i < m; i++) {
    if (g[i][0] === 0) {
      rows.push(i);
      for (let j = 0; j < n; j++) g[i][j] ^= 1;
    }
  }
  // 第二步：对每列（除第 0 列），若 g[0][j] === 1 则翻转该列
  for (let j = 1; j < n; j++) {
    if (g[0][j] === 1) {
      cols.push(j);
      for (let i = 0; i < m; i++) g[i][j] ^= 1;
    }
  }
  // 第三步：翻转第 0 列（此时 g[i][0] 全 1）
  cols.push(0);
  for (let i = 0; i < m; i++) g[i][0] ^= 1;

  // 校验：所有格子必须为 0
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (g[i][j] !== 0) return null;
    }
  }
  return { rows, cols };
}

// 方法2：返回最少操作数（行翻转 + 列翻转总次数）
function removeOnesCount(grid: number[][]): number {
  const res = removeOnesOps(grid);
  if (res === null) return -1;
  return res.rows.length + res.cols.length;
}

// 方法3：存在性判定
// 对于任意两行 i, i'：若 grid[i][j] ⊕ grid[i'][j] 在不同 j 处不一致则无解。
// 即所有行经过"以第一行为基准的列翻转"后必须全 0 或全 1。
function canRemoveAllOnes(grid: number[][]): boolean {
  const m = grid.length;
  const n = grid[0].length;
  for (let i = 1; i < m; i++) {
    // 与第 0 行比较：要么完全相同，要么完全相反
    const same = grid[i][0] === grid[0][0];
    for (let j = 1; j < n; j++) {
      const cur = grid[i][j] === grid[0][j];
      if (cur !== same) return false;
    }
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 092. 使矩阵中的 1 互不相邻的最小操作数 =====");
console.log(removeOnesOps([[0, 1, 0], [1, 0, 1], [0, 1, 0]])); // 期望: 可行方案
console.log(removeOnesCount([[0, 1, 0], [1, 0, 1], [0, 1, 0]])); // 期望: 行列翻转总数
console.log(canRemoveAllOnes([[0, 1, 0], [1, 0, 1], [0, 1, 0]])); // 期望: true
console.log(canRemoveAllOnes([[1, 0, 1], [0, 1, 0], [1, 1, 0]])); // 期望: false（不可行）
console.log(removeOnesOps([[1, 1, 1], [1, 1, 1]])); // 期望: 仅翻转行或列
console.log(removeOnesCount([[1, 1, 1], [1, 1, 1]])); // 期望: 1 或 2

export {};
