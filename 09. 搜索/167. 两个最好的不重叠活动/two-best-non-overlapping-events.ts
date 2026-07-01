// ============================================================
// 167. 两个最好的不重叠活动
// ============================================================
// LeetCode 2054. Two Best Non-Overlapping Events
// 每个活动有 [startTime, endTime, value]，最多选两个不重叠活动，求最大价值和。

// 方法1：排序 + 二分查找 + DP
function maxTwoEvents(events: number[][]): number {
  // 按结束时间排序
  events.sort((a, b) => a[1] - b[1]);
  const n = events.length;
  // dp[i] = 前 i 个活动中选 1 个的最大价值
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = Math.max(dp[i - 1], events[i - 1][2]);
  }
  let result = 0;
  for (let i = 0; i < n; i++) {
    // 选当前活动 events[i]，再找一个结束时间 < events[i][0] 的活动
    const startTime = events[i][0];
    let lo = 0;
    let hi = i;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (events[mid][1] < startTime) lo = mid + 1;
      else hi = mid;
    }
    // events[0..lo-1] 的结束时间都 < startTime
    const best = lo > 0 ? dp[lo] : 0;
    result = Math.max(result, events[i][2] + best);
  }
  return result;
}

// 方法2：按开始时间排序 + 二分查找
function maxTwoEventsByStart(events: number[][]): number {
  events.sort((a, b) => a[0] - b[0]);
  const n = events.length;
  // suffix[i] = 从第 i 个活动开始的最大价值
  const suffix = new Array(n + 1).fill(0);
  suffix[n] = 0;
  for (let i = n - 1; i >= 0; i--) {
    suffix[i] = Math.max(suffix[i + 1], events[i][2]);
  }
  let result = 0;
  for (let i = 0; i < n; i++) {
    // 选当前活动，找下一个开始时间 > events[i][1] 的活动
    const endTime = events[i][1];
    let lo = i + 1;
    let hi = n;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (events[mid][0] > endTime) hi = mid;
      else lo = mid + 1;
    }
    result = Math.max(result, events[i][2] + suffix[lo]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 167. 两个最好的不重叠活动 =====");
console.log("二分 [[1,3,2],[4,5,2],[2,4,3]]:", maxTwoEvents([[1, 3, 2], [4, 5, 2], [2, 4, 3]])); // 4
console.log("二分 [[1,3,2],[4,5,2],[1,5,5]]:", maxTwoEvents([[1, 3, 2], [4, 5, 2], [1, 5, 5]])); // 5
console.log("二分 [[1,5,3],[1,5,1],[6,6,5]]:", maxTwoEvents([[1, 5, 3], [1, 5, 1], [6, 6, 5]])); // 8
console.log("后缀 [[1,3,2],[4,5,2],[2,4,3]]:", maxTwoEventsByStart([[1, 3, 2], [4, 5, 2], [2, 4, 3]])); // 4

export {};
