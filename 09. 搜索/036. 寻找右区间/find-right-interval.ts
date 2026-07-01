// ============================================================
// 036. 寻找右区间
// ============================================================
// LeetCode 436. Find Right Interval
// 给定区间集合，对每个区间 i，找起点 ≥ 区间 i 终点的最小起点的区间索引。

// 方法1：排序 + 二分查找
function findRightInterval(intervals: number[][]): number[] {
  const n = intervals.length;
  // 记录起点和索引，按起点排序
  const starts = intervals
    .map((interval, idx) => ({ start: interval[0], idx }))
    .sort((a, b) => a.start - b.start);
  const result: number[] = new Array(n).fill(-1);
  for (let i = 0; i < n; i++) {
    const end = intervals[i][1];
    // 二分找第一个 start >= end
    let left = 0;
    let right = n - 1;
    let found = -1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (starts[mid].start >= end) {
        found = starts[mid].idx;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    result[i] = found;
  }
  return result;
}

// 方法2：哈希表 + 排序 + 双指针
function findRightIntervalHash(intervals: number[][]): number[] {
  const n = intervals.length;
  const sortedByStart = intervals
    .map((iv, idx) => [iv[0], idx])
    .sort((a, b) => a[0] - b[0]);
  const sortedByEnd = intervals
    .map((iv, idx) => [iv[1], idx])
    .sort((a, b) => a[0] - b[0]);
  const result = new Array(n).fill(-1);
  let j = 0;
  for (const [end, idx] of sortedByEnd) {
    while (j < n && sortedByStart[j][0] < end) j++;
    if (j < n) {
      result[idx] = sortedByStart[j][1];
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 036. 寻找右区间 =====");
console.log(
  "二分 [[1,2]]:",
  findRightInterval([[1, 2]])
); // [-1]
console.log(
  "二分 [[3,4],[2,3],[1,2]]:",
  findRightInterval([
    [3, 4],
    [2, 3],
    [1, 2],
  ])
); // [-1,0,1]
console.log(
  "二分 [[1,4],[2,3],[3,4]]:",
  findRightInterval([
    [1, 4],
    [2, 3],
    [3, 4],
  ])
); // [-1,2,-1]

export {};
