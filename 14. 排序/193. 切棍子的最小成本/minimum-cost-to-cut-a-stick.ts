// ============================================================
// 193. 切棍子的最小成本
// ============================================================
// LeetCode 1547. Minimum Cost to Cut a Stick
// 长度为 n 的棍子，cuts 给定可切割位置。每次切割成本等于当前被切棍子长度。
// 求按最优顺序切完所有 cuts 的最小总成本。

// 方法1：区间 DP 自底向上（O(m^3)，m = cuts.length + 2）
function minCost(n: number, cuts: number[]): number {
  const arr = [0, ...cuts, n].sort((a, b) => a - b);
  const m = arr.length;
  // dp[i][j] = 切断点 arr[i]..arr[j] 之间的最小成本
  const dp: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
  // 按区间长度递增
  for (let len = 2; len < m; len++) {
    for (let i = 0; i + len < m; i++) {
      const j = i + len;
      dp[i][j] = Infinity;
      for (let k = i + 1; k < j; k++) {
        const cost = arr[j] - arr[i] + dp[i][k] + dp[k][j];
        if (cost < dp[i][j]) dp[i][j] = cost;
      }
      if (dp[i][j] === Infinity) dp[i][j] = 0; // 中间无切点
    }
  }
  return dp[0][m - 1];
}

// 方法2：区间 DP + 记忆化递归（O(m^3)）
function minCost2(n: number, cuts: number[]): number {
  const arr = [0, ...cuts, n].sort((a, b) => a - b);
  const m = arr.length;
  const memo = new Map<string, number>();

  const solve = (i: number, j: number): number => {
    if (i + 1 === j) return 0; // 相邻，无切点
    const key = `${i},${j}`;
    if (memo.has(key)) return memo.get(key)!;
    let best = Infinity;
    for (let k = i + 1; k < j; k++) {
      const cost = arr[j] - arr[i] + solve(i, k) + solve(k, j);
      if (cost < best) best = cost;
    }
    const result = best === Infinity ? 0 : best;
    memo.set(key, result);
    return result;
  };

  return solve(0, m - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 193. 切棍子的最小成本 =====");
console.log("方法1 n=7, cuts=[1,3,4,5]:", minCost(7, [1, 3, 4, 5])); // 16
console.log("方法1 n=9, cuts=[5,6,1,4,2]:", minCost(9, [5, 6, 1, 4, 2])); // 22
console.log("方法1 n=2, cuts=[1]:", minCost(2, [1])); // 2
console.log("方法2 n=7, cuts=[1,3,4,5]:", minCost2(7, [1, 3, 4, 5])); // 16
console.log("方法2 n=9, cuts=[5,6,1,4,2]:", minCost2(9, [5, 6, 1, 4, 2])); // 22
console.log("方法2 n=2, cuts=[1]:", minCost2(2, [1])); // 2

export {};
