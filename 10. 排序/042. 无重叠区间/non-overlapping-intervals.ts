// ============================================================
// 042. 无重叠区间
// ============================================================
// LeetCode 435. Non-overlapping Intervals
// 给定一组区间，返回需要移除的最少区间数，使剩余区间互不重叠。

// 方法1：按右端点排序贪心（推荐，O(n log n) 时间，O(log n) 空间）
// 每次选择右端点最小的可行区间，能保留尽可能多的区间。
// 保留数 = 区间总数 - 需移除数。
function eraseOverlapIntervals_byEnd(intervals: number[][]): number {
  const n = intervals.length;
  if (n === 0) return 0;

  // 按右端点升序
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 1; // 保留下来的区间数，第一个一定保留
  let end = intervals[0][1];

  for (let i = 1; i < n; i++) {
    if (intervals[i][0] >= end) {
      // 不重叠，保留该区间
      count++;
      end = intervals[i][1];
    }
    // 否则重叠，需要移除（不更新 end）
  }

  return n - count;
}

// 方法2：按左端点排序贪心（O(n log n) 时间，O(log n) 空间）
// 按左端点升序，遇到重叠时保留右端点较小的那个，移除右端点较大的。
function eraseOverlapIntervals_byStart(intervals: number[][]): number {
  const n = intervals.length;
  if (n === 0) return 0;

  // 按左端点升序
  intervals.sort((a, b) => a[0] - b[0]);

  let remove = 0;
  let prevEnd = intervals[0][1];

  for (let i = 1; i < n; i++) {
    if (intervals[i][0] < prevEnd) {
      // 重叠，移除右端点较大的那个（保留较小的右端点）
      remove++;
      prevEnd = Math.min(prevEnd, intervals[i][1]);
    } else {
      // 不重叠，更新 prevEnd
      prevEnd = intervals[i][1];
    }
  }

  return remove;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 042. 无重叠区间 =====");
console.log("按右端点 [[1,2],[2,3],[3,4],[1,3]]:", eraseOverlapIntervals_byEnd([[1, 2], [2, 3], [3, 4], [1, 3]])); // 期望: 1
console.log("按右端点 [[1,2],[1,2],[1,2]]:", eraseOverlapIntervals_byEnd([[1, 2], [1, 2], [1, 2]])); // 期望: 2
console.log("按右端点 [[1,2],[2,3]]:", eraseOverlapIntervals_byEnd([[1, 2], [2, 3]])); // 期望: 0

console.log("按左端点 [[1,2],[2,3],[3,4],[1,3]]:", eraseOverlapIntervals_byStart([[1, 2], [2, 3], [3, 4], [1, 3]])); // 期望: 1
console.log("按左端点 [[1,2],[1,2],[1,2]]:", eraseOverlapIntervals_byStart([[1, 2], [1, 2], [1, 2]])); // 期望: 2
console.log("按左端点 [[1,2],[2,3]]:", eraseOverlapIntervals_byStart([[1, 2], [2, 3]])); // 期望: 0

export {};
