// ============================================================
// 043. 寻找右区间
// ============================================================
// LeetCode 436. Find Right Interval
// 给定一组区间，对每个区间 i，找到 start_j >= end_i 且 start_j 最小的区间 j 的下标。
// 若不存在返回 -1。区间起点各不相同。

// 方法1：排序起点 + 二分查找（推荐，O(n log n) 时间，O(n) 空间）
// 将 (start, 原下标) 按起点排序，对每个区间的 end 在排序数组中二分查找第一个 >= end 的起点。
function findRightInterval(intervals: number[][]): number[] {
  const n = intervals.length;

  // 记录每个区间的起点与原始下标，按起点升序
  const starts: Array<{ start: number; index: number }> = intervals.map(
    (interval, i) => ({ start: interval[0], index: i })
  );
  starts.sort((a, b) => a.start - b.start);

  const result: number[] = new Array(n).fill(-1);

  for (let i = 0; i < n; i++) {
    const target = intervals[i][1]; // 当前区间的 end
    // 二分查找第一个 start >= target
    let left = 0;
    let right = n;
    while (left < right) {
      const mid = (left + right) >> 1;
      if (starts[mid].start >= target) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    if (left < n) {
      result[i] = starts[left].index;
    }
  }

  return result;
}

// 方法2：双指针排序起点与终点（O(n log n) 时间，O(n) 空间）
// 分别对起点和终点排序，用双指针为每个终点寻找最小的不小于它的起点。
function findRightInterval_twoPointers(intervals: number[][]): number[] {
  const n = intervals.length;

  const starts: Array<{ val: number; index: number }> = intervals.map(
    (interval, i) => ({ val: interval[0], index: i })
  );
  const ends: Array<{ val: number; index: number }> = intervals.map(
    (interval, i) => ({ val: interval[1], index: i })
  );

  starts.sort((a, b) => a.val - b.val);
  ends.sort((a, b) => a.val - b.val);

  const result: number[] = new Array(n).fill(-1);

  let j = 0;
  for (let i = 0; i < n; i++) {
    // 找到第一个起点 >= 当前终点
    while (j < n && starts[j].val < ends[i].val) {
      j++;
    }
    if (j < n) {
      result[ends[i].index] = starts[j].index;
    }
    // j 不重置，因为终点已升序，下一个终点更大，起点只需继续向后找
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 043. 寻找右区间 =====");
console.log("二分 [[1,2]]:", findRightInterval([[1, 2]])); // 期望: [-1]
console.log("二分 [[3,4],[2,3],[1,2]]:", findRightInterval([[3, 4], [2, 3], [1, 2]])); // 期望: [-1,0,1]
console.log("二分 [[1,4],[2,3],[3,4]]:", findRightInterval([[1, 4], [2, 3], [3, 4]])); // 期望: [-1,2,-1]

console.log("双指针 [[1,2]]:", findRightInterval_twoPointers([[1, 2]])); // 期望: [-1]
console.log("双指针 [[3,4],[2,3],[1,2]]:", findRightInterval_twoPointers([[3, 4], [2, 3], [1, 2]])); // 期望: [-1,0,1]
console.log("双指针 [[1,4],[2,3],[3,4]]:", findRightInterval_twoPointers([[1, 4], [2, 3], [3, 4]])); // 期望: [-1,2,-1]

export {};
