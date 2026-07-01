// ============================================================
// 148. 规划兼职工作
// ============================================================
// LeetCode 1235. Maximum Profit in Job Scheduling
// 给定 startTime、endTime、profit 三个数组，选择若干不重叠的工作，使总利润最大。

interface Job {
  start: number;
  end: number;
  profit: number;
}

// 方法1：按结束时间排序 + 动态规划 + 二分查找（推荐，O(n log n)）
// dp[i] 表示考虑前 i 个工作（按 end 排序）能获得的最大利润。
// 对于第 i 个工作，要么不做 dp[i-1]，要么做：找到最后一个结束时间 <= 当前开始时间的工作 k，
// 利润为 dp[k+1] + profit，取较大值。
function jobScheduling(
  startTime: number[],
  endTime: number[],
  profit: number[]
): number {
  const n: number = startTime.length;
  const jobs: Job[] = Array.from({ length: n }, (_, i) => ({
    start: startTime[i],
    end: endTime[i],
    profit: profit[i],
  }));
  jobs.sort((a, b) => a.end - b.end);

  // dp[i] 表示前 i 个工作（jobs[0..i-1]）的最大利润
  const dp: number[] = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    const job: Job = jobs[i - 1];
    // 在 [0, i-1) 范围内找第一个 end > job.start 的下标 lo，则 k = lo - 1
    let lo: number = 0;
    let hi: number = i - 1;
    while (lo < hi) {
      const mid: number = (lo + hi) >> 1;
      if (jobs[mid].end <= job.start) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    const k: number = lo - 1; // 最后一个 end <= job.start 的工作下标，可能为 -1
    const prevProfit: number = k >= 0 ? dp[k + 1] : 0;
    dp[i] = Math.max(dp[i - 1], prevProfit + job.profit);
  }
  return dp[n];
}

// 方法2：按开始时间排序 + 记忆化搜索 + 二分（O(n log n)）
// 从左到右递归：对每个工作选或不选，选则跳到下一个开始时间 >= 当前结束时间的工作。
function jobScheduling2(
  startTime: number[],
  endTime: number[],
  profit: number[]
): number {
  const n: number = startTime.length;
  const jobs: Job[] = Array.from({ length: n }, (_, i) => ({
    start: startTime[i],
    end: endTime[i],
    profit: profit[i],
  }));
  jobs.sort((a, b) => a.start - b.start);

  const memo: Map<number, number> = new Map();

  // 从第 idx 个工作开始考虑的最大利润
  const dfs = (idx: number): number => {
    if (idx >= n) return 0;
    if (memo.has(idx)) return memo.get(idx)!;

    // 不选当前工作
    const skip: number = dfs(idx + 1);
    // 选当前工作，找下一个 start >= jobs[idx].end 的工作
    let lo: number = idx + 1;
    let hi: number = n;
    while (lo < hi) {
      const mid: number = (lo + hi) >> 1;
      if (jobs[mid].start < jobs[idx].end) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    const take: number = jobs[idx].profit + dfs(lo);
    const ans: number = Math.max(skip, take);
    memo.set(idx, ans);
    return ans;
  };

  return dfs(0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 148. 规划兼职工作 =====");
console.log(
  "方法1:",
  jobScheduling([1, 2, 3, 3], [3, 4, 5, 6], [50, 10, 40, 70])
); // 期望: 120
console.log(
  "方法1:",
  jobScheduling([1, 2, 3, 4, 6], [3, 5, 10, 6, 9], [20, 20, 100, 70, 60])
); // 期望: 150
console.log(
  "方法1:",
  jobScheduling([1, 1, 1], [2, 3, 4], [5, 6, 4])
); // 期望: 6
console.log(
  "方法2:",
  jobScheduling2([1, 2, 3, 3], [3, 4, 5, 6], [50, 10, 40, 70])
); // 期望: 120

export {};
