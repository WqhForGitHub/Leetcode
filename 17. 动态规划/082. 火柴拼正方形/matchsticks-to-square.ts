// ============================================================
// 082. 火柴拼正方形
// ============================================================
// LeetCode 473. Matchsticks to Square
// 给定火柴长度数组，判断能否用所有火柴拼成正方形（不能折断）
// 时间复杂度：方法1 O(4^n)，方法2 O(n * 2^n)

// 方法1：DFS + 剪枝（推荐）
// 将火柴从大到小排序，尝试将每根火柴放入四条边
// 剪枝：超过边长则跳过；当前边与上一条边长度相同时跳过避免重复
// 时间复杂度 O(4^n)，空间复杂度 O(n)
function makesquare(matchsticks: number[]): boolean {
  const n: number = matchsticks.length;
  if (n < 4) return false;

  const sum: number = matchsticks.reduce((a: number, b: number) => a + b, 0);
  if (sum % 4 !== 0) return false;

  const target: number = sum / 4;
  // 从大到小排序，大数先放便于尽早剪枝
  matchsticks.sort((a: number, b: number) => b - a);
  if (matchsticks[0] > target) return false;

  const sides: number[] = [0, 0, 0, 0];
  return dfsMatch(matchsticks, 0, sides, target);
}

// DFS：尝试将第 index 根火柴放入四条边之一
function dfsMatch(matchsticks: number[], index: number, sides: number[], target: number): boolean {
  if (index === matchsticks.length) {
    // 所有火柴已放置，每条边恰好等于 target
    return true;
  }

  for (let i: number = 0; i < 4; i++) {
    // 剪枝1：放入后超过边长
    if (sides[i] + matchsticks[index] > target) continue;
    // 剪枝2：当前边与前一条边长度相同，放入结果相同，跳过避免重复
    if (i > 0 && sides[i] === sides[i - 1]) continue;

    sides[i] += matchsticks[index];
    if (dfsMatch(matchsticks, index + 1, sides, target)) return true;
    sides[i] -= matchsticks[index];
  }
  return false;
}

// 方法2：DP + 位掩码
// dp[state] 表示已用火柴集合 state 后，当前边的已填充长度（= 总和 % target）
// 若 dp[state] == -1 表示该状态不可达
// 时间复杂度 O(n * 2^n)，空间复杂度 O(2^n)
function makesquareDP(matchsticks: number[]): boolean {
  const n: number = matchsticks.length;
  if (n < 4) return false;

  const sum: number = matchsticks.reduce((a: number, b: number) => a + b, 0);
  if (sum % 4 !== 0) return false;

  const target: number = sum / 4;
  // 检查是否有火柴超过边长
  for (let i: number = 0; i < n; i++) {
    if (matchsticks[i] > target) return false;
  }

  const full: number = (1 << n) - 1;
  // dp[state] = 当前边的已填充长度（总和 % target），-1 表示不可达
  const dp: number[] = new Array(1 << n).fill(-1);
  dp[0] = 0;

  for (let state: number = 0; state <= full; state++) {
    if (dp[state] === -1) continue;
    for (let i: number = 0; i < n; i++) {
      // 火柴 i 已使用
      if ((state & (1 << i)) !== 0) continue;
      const next: number = state | (1 << i);
      // 当前边剩余空间不足
      if (dp[state] + matchsticks[i] > target) continue;
      // 状态转移：新边的填充长度 = (当前 + 火柴i) % target
      const filled: number = (dp[state] + matchsticks[i]) % target;
      if (dp[next] === -1) {
        dp[next] = filled;
      }
    }
  }

  // 所有火柴用完且当前边恰好填满（余量为0）
  return dp[full] === 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 082. 火柴拼正方形 =====");
console.log(makesquare([1, 1, 2, 2, 2])); // 期望结果: true
console.log(makesquare([3, 3, 3, 3, 4])); // 期望结果: false
console.log(makesquare([5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3])); // 期望结果: true

console.log(makesquareDP([1, 1, 2, 2, 2])); // 期望结果: true
console.log(makesquareDP([3, 3, 3, 3, 4])); // 期望结果: false
console.log(makesquareDP([5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3])); // 期望结果: true

export {};
