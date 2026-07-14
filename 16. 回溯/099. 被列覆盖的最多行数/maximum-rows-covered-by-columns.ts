// ============================================================
// 099. 被列覆盖的最多行数
// ============================================================
// LeetCode 2397. Maximum Rows Covered by Columns
// 给定 0/1 矩阵和 numSelect，选 numSelect 列；若某行所有 1 都在选中列中则该行被覆盖，求最多覆盖行数
// 时间复杂度：O(C(n,numSelect) * m * n), 空间复杂度：O(n)

// 方法1：回溯(组合选列) (推荐)
// 枚举所有 numSelect 列的组合，对每个组合统计被覆盖行数，取最大值
function maximumRows(matrix: number[][], numSelect: number): number {
  const m = matrix.length;
  const n = matrix[0].length;
  let result = 0;
  const selected: number[] = [];

  // 统计当前列选择方案下被覆盖的行数
  const countCovered = (): number => {
    let cnt = 0;
    for (let i = 0; i < m; i++) {
      let covered = true;
      for (let j = 0; j < n; j++) {
        if (matrix[i][j] === 1 && !selected.includes(j)) {
          covered = false;
          break;
        }
      }
      if (covered) cnt++;
    }
    return cnt;
  };

  // 从 start 开始选列，组合回溯
  const backtrack = (start: number): void => {
    if (selected.length === numSelect) {
      result = Math.max(result, countCovered());
      return;
    }
    for (let j = start; j < n; j++) {
      selected.push(j);
      backtrack(j + 1);
      selected.pop();
    }
  };

  backtrack(0);
  return result;
}

// 方法2：位掩码枚举
// 每行转为位掩码；枚举所有列选择掩码，仅保留 popcount==numSelect 的方案并统计
function maximumRows2(matrix: number[][], numSelect: number): number {
  const m = matrix.length;
  const n = matrix[0].length;
  const rowMasks: number[] = matrix.map((row: number[]): number => {
    let mask = 0;
    for (let j = 0; j < n; j++) {
      if (row[j] === 1) mask |= 1 << j;
    }
    return mask;
  });

  const popcount = (x: number): number => {
    let bits = 0;
    while (x > 0) {
      bits += x & 1;
      x >>= 1;
    }
    return bits;
  };

  let result = 0;
  for (let cols = 0; cols < 1 << n; cols++) {
    if (popcount(cols) !== numSelect) continue;
    let cnt = 0;
    for (let i = 0; i < m; i++) {
      // 行的所有 1 都在选中列中 => (rowMask & cols) == rowMask
      if ((rowMasks[i] & cols) === rowMasks[i]) cnt++;
    }
    result = Math.max(result, cnt);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 099. 被列覆盖的最多行数 =====");
console.log(
  maximumRows(
    [
      [0, 0, 0],
      [1, 0, 1],
      [0, 1, 1],
      [0, 0, 1],
    ],
    2,
  ),
); // 期望结果: 3
console.log("--- 方法2测试 ---");
console.log(
  maximumRows2(
    [
      [0, 0, 0],
      [1, 0, 1],
      [0, 1, 1],
      [0, 0, 1],
    ],
    2,
  ),
); // 期望结果: 3

export {};
