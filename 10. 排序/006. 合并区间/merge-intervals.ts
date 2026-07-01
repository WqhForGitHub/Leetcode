// ============================================================
// 006. 合并区间
// ============================================================
// LeetCode 56. Merge Intervals
// 给出一组区间，合并所有重叠的区间。

// 方法1：按起点排序 + 逐个合并（推荐，时间 O(n*log n)，空间 O(log n) 排序栈）
function merge(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;

  intervals.sort((a, b) => a[0] - b[0]);

  const result: number[][] = [];
  for (const interval of intervals) {
    const last = result[result.length - 1];
    if (last && last[1] >= interval[0]) {
      // 重叠，合并区间（取较大的右端点）
      last[1] = Math.max(last[1], interval[1]);
    } else {
      result.push([...interval]);
    }
  }
  return result;
}

// 方法2：按起点排序 + 单独起止数组（时间 O(n*log n)，空间 O(n)）
function merge2(intervals: number[][]): number[][] {
  const n = intervals.length;
  if (n <= 1) return intervals;

  intervals.sort((a, b) => a[0] - b[0]);

  const starts = intervals.map((i) => i[0]);
  const ends = intervals.map((i) => i[1]);

  const result: number[][] = [];
  let i = 0;
  while (i < n) {
    const start = starts[i];
    let end = ends[i];
    // 当前区间的右端点 >= 下一个区间的左端点，说明重叠，继续扩展
    while (i < n - 1 && end >= starts[i + 1]) {
      i++;
      end = Math.max(end, ends[i]);
    }
    result.push([start, end]);
    i++;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 006. 合并区间 =====");
console.log("方法1:", merge([[1, 3], [2, 6], [8, 10], [15, 18]])); // 期望: [[1,6],[8,10],[15,18]]
console.log("方法1:", merge([[1, 4], [4, 5]])); // 期望: [[1,5]]
console.log("方法1:", merge([[1, 4], [0, 4]])); // 期望: [[0,4]]
console.log("方法2:", merge2([[1, 3], [2, 6], [8, 10], [15, 18]])); // 期望: [[1,6],[8,10],[15,18]]
console.log("方法2:", merge2([[1, 4], [4, 5]])); // 期望: [[1,5]]

export {};
