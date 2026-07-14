// ============================================================
// 073. 无重叠区间
// ============================================================
// LeetCode 435. Non-overlapping Intervals
// 给定区间集合，返回需要移除的最小区间数使剩余区间不重叠。
// 等价于求最大不重叠区间数，再用总数减去它。
// 时间复杂度 O(n log n) 或 O(n^2)

// 方法1：贪心 - 按右端点排序（推荐）
// 按右端点排序，每次选择右端点最小的区间（留更多空间给后续区间）。
// 遍历区间，若当前区间左端点 >= 上一个选中区间的右端点，则选中；否则移除。
// 时间复杂度 O(n log n)，空间复杂度 O(1)
function eraseOverlapIntervals(intervals: number[][]): number {
  const n: number = intervals.length;
  if (n === 0) return 0;
  // 按右端点升序排序
  intervals.sort((a: number[], b: number[]) => a[1] - b[1]);
  let count: number = 1; // 选中的区间数，第一个一定选
  let end: number = intervals[0][1]; // 上一个选中区间的右端点
  for (let i: number = 1; i < n; i++) {
    // 当前区间左端点 >= 上一个选中区间右端点，不重叠，选中
    if (intervals[i][0] >= end) {
      count++;
      end = intervals[i][1];
    }
    // 否则需要移除当前区间
  }
  // 需要移除的数量 = 总数 - 最大不重叠数
  return n - count;
}

// 方法2：DP - 按右端点排序后动态规划
// 排序后，dp[i] 表示前 i 个区间（排序后）的最大不重叠区间数。
// 状态转移：dp[i] = max(dp[i-1], dp[j] + 1)，其中 j 是最后一个与第 i 个区间不重叠的区间。
// 时间复杂度 O(n^2)，空间复杂度 O(n)
function eraseOverlapIntervalsDP(intervals: number[][]): number {
  const n: number = intervals.length;
  if (n === 0) return 0;
  // 按右端点升序排序
  intervals.sort((a: number[], b: number[]) => a[1] - b[1]);
  // dp[i] 表示前 i 个区间的最大不重叠区间数
  const dp: number[] = new Array(n + 1).fill(0);
  for (let i: number = 1; i <= n; i++) {
    // 不选第 i 个区间
    dp[i] = dp[i - 1];
    // 尝试选第 i 个区间，找最后一个不重叠的前驱区间 j
    let found: boolean = false;
    for (let j: number = i - 1; j >= 1; j--) {
      // intervals[j-1] 的右端点 <= intervals[i-1] 的左端点，说明不重叠
      if (intervals[j - 1][1] <= intervals[i - 1][0]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
        found = true;
        break; // 由于按右端点排序，第一个找到的就是最优的
      }
    }
    // 如果没有不重叠的前驱区间，只选自己
    if (!found) {
      dp[i] = Math.max(dp[i], 1);
    }
  }
  // 需要移除的数量 = 总数 - 最大不重叠数
  return n - dp[n];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 073. 无重叠区间 =====");
console.log(
  eraseOverlapIntervals([
    [1, 2],
    [2, 3],
    [3, 4],
    [1, 3],
  ]),
); // 期望结果: 1
console.log(
  eraseOverlapIntervals([
    [1, 2],
    [1, 2],
    [1, 2],
  ]),
); // 期望结果: 2
console.log(
  eraseOverlapIntervals([
    [1, 2],
    [2, 3],
  ]),
); // 期望结果: 0
console.log(
  eraseOverlapIntervals([
    [1, 100],
    [11, 22],
    [1, 11],
    [2, 12],
  ]),
); // 期望结果: 2
console.log(
  eraseOverlapIntervals([
    [0, 1],
    [0, 2],
    [0, 3],
  ]),
); // 期望结果: 2

export {};
