// ============================================================
// 136. 最多可以参加的会议数目 II
// ============================================================
// LeetCode 1751. Maximum Number of Events That Can Be Attended II
// 每个会议有开始、结束、价值，最多参加 k 个不重叠会议，求最大价值。

// 方法1：排序 + 动态规划 + 二分查找
function maxValue(events: number[][], k: number): number {
  events.sort((a, b) => a[1] - b[1]); // 按结束时间排序
  const n = events.length;
  // dp[i][j] = 前 i 个会议参加 j 个的最大价值
  const dp: number[][] = new Array(n + 1);
  for (let i = 0; i <= n; i++) {
    dp[i] = new Array(k + 1).fill(0);
  }
  for (let i = 1; i <= n; i++) {
    const [start, end, val] = events[i - 1];
    // 二分找最后一个结束时间 < start 的会议
    let lo = 0;
    let hi = i - 1;
    let lastNonOverlap = 0;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (events[mid][1] < start) {
        lastNonOverlap = mid + 1;
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    for (let j = 1; j <= k; j++) {
      dp[i][j] = Math.max(dp[i - 1][j], dp[lastNonOverlap][j - 1] + val);
    }
  }
  return dp[n][k];
}

// 方法2：递归 + 记忆化 + 二分查找
function maxValueMemo(events: number[][], k: number): number {
  events.sort((a, b) => a[0] - b[0]); // 按开始时间排序
  const n = events.length;
  const memo = new Map<string, number>();

  function dfs(idx: number, remaining: number): number {
    if (idx >= n || remaining === 0) return 0;
    const key = `${idx},${remaining}`;
    if (memo.has(key)) return memo.get(key)!;
    // 不选当前会议
    const skip = dfs(idx + 1, remaining);
    // 选当前会议
    const end = events[idx][1];
    let lo = idx + 1;
    let hi = n;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (events[mid][0] > end) hi = mid;
      else lo = mid + 1;
    }
    const take = events[idx][2] + dfs(lo, remaining - 1);
    const result = Math.max(skip, take);
    memo.set(key, result);
    return result;
  }

  return dfs(0, k);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 136. 最多可以参加的会议数目 II =====");
console.log(
  "DP [[1,2,4],[3,4,3],[2,3,1]],2:",
  maxValue(
    [
      [1, 2, 4],
      [3, 4, 3],
      [2, 3, 1],
    ],
    2,
  ),
); // 7
console.log(
  "DP [[1,2,4],[3,4,3],[2,3,10]],2:",
  maxValue(
    [
      [1, 2, 4],
      [3, 4, 3],
      [2, 3, 10],
    ],
    2,
  ),
); // 10
console.log(
  "记忆化 [[1,1,1],[2,2,2],[3,3,3],[4,4,4]],3:",
  maxValueMemo(
    [
      [1, 1, 1],
      [2, 2, 2],
      [3, 3, 3],
      [4, 4, 4],
    ],
    3,
  ),
); // 9

export {};
