// ============================================================
// 221. 最多可以参加的会议数目 II
// ============================================================
// LeetCode 1751. Maximum Number of Events That Can Be Attended II
// 给定 events[i] = [startDay, endDay, value]，最多参加 k 个互不重叠的会议，
// 求能获得的最大价值之和。两个会议不重叠指一个 endDay < 另一个 startDay。

// 方法1：按结束时间排序 + 二维 DP + 二分查找上一个不重叠会议（O(n log n + n*k)）
// dp[i][j] 表示考虑前 i 个会议（按 endDay 升序）、参加 j 个时的最大价值。
// 转移：不选第 i 个 -> dp[i-1][j]；选第 i 个 -> value + dp[p+1][j-1]，
// 其中 p 为 endDay < 当前 startDay 的最后一个会议下标（二分求得）。
function maxValue1(events: number[][], k: number): number {
  const n = events.length;
  events.sort((a, b) => a[1] - b[1]);

  // 在 [0, idx) 中找最大的下标 p 使得 events[p].end < events[idx].start
  const findPrev = (idx: number): number => {
    const start = events[idx][0];
    let lo = 0;
    let hi = idx;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (events[mid][1] < start) lo = mid + 1;
      else hi = mid;
    }
    return lo - 1;
  };

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(k + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    const v = events[i - 1][2];
    const prev = findPrev(i - 1);
    for (let j = 0; j <= k; j++) {
      dp[i][j] = dp[i - 1][j];
      if (j > 0) {
        const take = v + (prev >= 0 ? dp[prev + 1][j - 1] : 0);
        if (take > dp[i][j]) dp[i][j] = take;
      }
    }
  }
  return dp[n][k];
}

// 方法2：按开始时间排序 + 记忆化搜索 + 二分查找下一个不重叠会议（O(n log n + n*k)）
// solve(i, rem) 表示从下标 i 开始、还能参加 rem 个会议的最大价值。
// 转移：跳过 i，或选 i 后跳到 findNext(i)。用 Map 记忆化。
function maxValue2(events: number[][], k: number): number {
  const n = events.length;
  events.sort((a, b) => a[0] - b[0]);

  // 在 (idx, n) 中找最小的下标 i 使得 events[i].start > events[idx].end
  const findNext = (idx: number): number => {
    const end = events[idx][1];
    let lo = idx + 1;
    let hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (events[mid][0] > end) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  };

  const memo = new Map<string, number>();
  const solve = (i: number, rem: number): number => {
    if (i >= n || rem === 0) return 0;
    const key = i + "," + rem;
    const cached = memo.get(key);
    if (cached !== undefined) return cached;
    let best = solve(i + 1, rem);
    const next = findNext(i);
    const take = events[i][2] + solve(next, rem - 1);
    if (take > best) best = take;
    memo.set(key, best);
    return best;
  };
  return solve(0, k);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 221. 最多可以参加的会议数目 II =====");
const events1 = [
  [1, 2, 4],
  [3, 4, 3],
  [2, 3, 1],
];
console.log(
  "方法1 events1 k=2:",
  maxValue1(
    events1.map((e) => [...e]),
    2,
  ),
); // 7
console.log(
  "方法2 events1 k=2:",
  maxValue2(
    events1.map((e) => [...e]),
    2,
  ),
); // 7

const events2 = [
  [1, 2, 4],
  [3, 4, 3],
  [2, 3, 10],
];
console.log(
  "方法1 events2 k=2:",
  maxValue1(
    events2.map((e) => [...e]),
    2,
  ),
); // 10
console.log(
  "方法2 events2 k=2:",
  maxValue2(
    events2.map((e) => [...e]),
    2,
  ),
); // 10

const events3 = [
  [1, 1, 1],
  [2, 2, 2],
  [3, 3, 3],
  [4, 4, 4],
];
console.log(
  "方法1 events3 k=3:",
  maxValue1(
    events3.map((e) => [...e]),
    3,
  ),
); // 9
console.log(
  "方法2 events3 k=3:",
  maxValue2(
    events3.map((e) => [...e]),
    3,
  ),
); // 9

export {};
