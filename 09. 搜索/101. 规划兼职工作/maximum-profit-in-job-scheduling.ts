// ============================================================
// 101. 规划兼职工作
// ============================================================
// LeetCode 1235. Maximum Profit in Job Scheduling
// 给定工作开始时间、结束时间、利润，求不重叠工作的最大利润。

// 方法1：排序 + 动态规划 + 二分查找
function jobScheduling(startTime: number[], endTime: number[], profit: number[]): number {
  const n = startTime.length;
  const jobs = startTime
    .map((s, i) => ({ s, e: endTime[i], p: profit[i] }))
    .sort((a, b) => a.e - b.e);
  // dp[i] = 前 i 个工作的最大利润
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    const job = jobs[i - 1];
    // 二分找最后一个结束时间 <= job.s 的工作
    let lo = 0;
    let hi = i - 1;
    let lastNonOverlap = 0;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (jobs[mid].e <= job.s) {
        lastNonOverlap = mid + 1;
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    dp[i] = Math.max(dp[i - 1], dp[lastNonOverlap] + job.p);
  }
  return dp[n];
}

// 方法2：排序 + 递归 + 记忆化
function jobSchedulingMemo(startTime: number[], endTime: number[], profit: number[]): number {
  const n = startTime.length;
  const jobs = startTime
    .map((s, i) => ({ s, e: endTime[i], p: profit[i] }))
    .sort((a, b) => a.s - b.s);
  const memo = new Map<number, number>();

  function dfs(idx: number): number {
    if (idx >= n) return 0;
    if (memo.has(idx)) return memo.get(idx)!;
    // 不选当前工作
    const skip = dfs(idx + 1);
    // 选当前工作，找下一个不重叠的工作
    let lo = idx + 1;
    let hi = n;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (jobs[mid].s >= jobs[idx].e) hi = mid;
      else lo = mid + 1;
    }
    const take = jobs[idx].p + dfs(lo);
    const result = Math.max(skip, take);
    memo.set(idx, result);
    return result;
  }

  return dfs(0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 101. 规划兼职工作 =====");
console.log(
  "DP [1,2,3,3],[3,4,5,6],[50,10,40,70]:",
  jobScheduling([1, 2, 3, 3], [3, 4, 5, 6], [50, 10, 40, 70]),
); // 120
console.log(
  "DP [1,2,3,4,6],[3,5,10,6,9],[20,20,100,70,60]:",
  jobScheduling([1, 2, 3, 4, 6], [3, 5, 10, 6, 9], [20, 20, 100, 70, 60]),
); // 150

export {};
