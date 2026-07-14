// ============================================================
// 173. 做菜顺序
// ============================================================
// LeetCode 1402. Reducing Dishes
// 厨师有 satisfaction[i] 道菜，可以选任意子集按任意顺序做。
// like-time 系数 = sum(satisfaction[j] * (j+1))（j 从 0 开始）。
// 求最大 like-time 系数（可一道都不做，返回 0）。

// 方法1：降序排序 + 贪心前缀和（O(n log n)）
// 降序后，每加入一道菜，原有菜的系数都 +1，新增菜系数为 1。
// 当累计前缀和 <= 0 时停止（继续加入会减少总收益）。
function maxSatisfaction(satisfaction: number[]): number {
  satisfaction.sort((a, b) => b - a);
  let total = 0;
  let prefix = 0;
  for (const s of satisfaction) {
    prefix += s;
    if (prefix < 0) break;
    total += prefix;
  }
  return total;
}

// 方法2：升序排序 + 动态规划（O(n^2)）
// dp[i][j] 表示处理完第 i 道菜后，已做 j 道菜的最大系数。
function maxSatisfaction2(satisfaction: number[]): number {
  satisfaction.sort((a, b) => a - b);
  const n = satisfaction.length;
  // dp[j] = 处理当前及之后菜品，下一道菜时间为 j 时的最大系数
  let dp: number[] = new Array(n + 2).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    const newDp: number[] = new Array(n + 2).fill(0);
    for (let j = 1; j <= n; j++) {
      // 跳过第 i 道菜：dp[j]（保持时间 j）
      // 做第 i 道菜：satisfaction[i]*j + dp[j+1]（时间 +1）
      newDp[j] = Math.max(dp[j], satisfaction[i] * j + dp[j + 1]);
    }
    dp = newDp;
  }
  return dp[1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 173. 做菜顺序 =====");
console.log("方法1 [-1,-8,0,5,-9]:", maxSatisfaction([-1, -8, 0, 5, -9])); // 14
console.log("方法1 [4,3,2]:", maxSatisfaction([4, 3, 2])); // 20
console.log("方法1 [-1,-4,-5]:", maxSatisfaction([-1, -4, -5])); // 0
console.log("方法2 [-1,-8,0,5,-9]:", maxSatisfaction2([-1, -8, 0, 5, -9])); // 14
console.log("方法2 [4,3,2]:", maxSatisfaction2([4, 3, 2])); // 20
console.log("方法2 [-1,-4,-5]:", maxSatisfaction2([-1, -4, -5])); // 0

export {};
