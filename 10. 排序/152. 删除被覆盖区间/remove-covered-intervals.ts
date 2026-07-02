// ============================================================
// 152. 删除被覆盖区间
// ============================================================
// LeetCode 1288. Remove Covered Intervals
// 给定若干区间，删除所有被另一区间完全覆盖的区间，返回剩余区间数量。

// 方法1：按起点升序、终点降序排序 + 单次扫描（推荐，O(n log n)）
// 排序后，前一个区间不会被后一个区间覆盖（起点更小或相等时终点更大），
// 只需维护当前最大终点 maxEnd：若当前区间终点 <= maxEnd，则被覆盖；
// 否则未被覆盖，更新 maxEnd 并计数。
function removeCoveredIntervals(intervals: number[][]): number {
  // 起点升序，起点相同时终点降序，保证同起点下长区间先出现
  intervals.sort((a, b) => a[0] - b[0] || b[1] - a[1]);

  let count: number = 0;
  let maxEnd: number = 0;
  for (const interval of intervals) {
    const end: number = interval[1];
    if (end > maxEnd) {
      count++;
      maxEnd = end;
    }
  }
  return count;
}

// 方法2：朴素双重比较（O(n^2)）
// 对每个区间检查是否存在另一个区间完全覆盖它。
function removeCoveredIntervals2(intervals: number[][]): number {
  const n: number = intervals.length;
  let covered: number = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      // 区间 j 是否覆盖区间 i
      if (intervals[j][0] <= intervals[i][0] && intervals[j][1] >= intervals[i][1]) {
        covered++;
        break;
      }
    }
  }
  return n - covered;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 152. 删除被覆盖区间 =====");
console.log(
  "方法1:",
  removeCoveredIntervals([
    [1, 4],
    [3, 6],
    [2, 8],
  ]),
); // 期望: 2
console.log(
  "方法1:",
  removeCoveredIntervals([
    [1, 4],
    [2, 3],
  ]),
); // 期望: 1
console.log(
  "方法1:",
  removeCoveredIntervals([
    [1, 2],
    [1, 4],
    [3, 4],
  ]),
); // 期望: 1
console.log(
  "方法2:",
  removeCoveredIntervals2([
    [1, 4],
    [3, 6],
    [2, 8],
  ]),
); // 期望: 2

export {};
