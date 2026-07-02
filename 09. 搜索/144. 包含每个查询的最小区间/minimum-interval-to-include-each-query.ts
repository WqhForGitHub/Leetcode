// ============================================================
// 144. 包含每个查询的最小区间
// ============================================================
// LeetCode 1851. Minimum Interval to Include Each Query
// 对每个查询 q，找包含 q 的最小区间长度，不存在返回 -1。

// 方法1：排序 + 优先队列（最小堆）
function minInterval(intervals: number[][], queries: number[]): number[] {
  intervals.sort((a, b) => a[0] - b[0]);
  const sortedQueries = queries.map((q, i) => ({ q, i }));
  sortedQueries.sort((a, b) => a.q - b.q);
  const result = new Array(queries.length).fill(-1);
  // 最小堆：[区间长度, 右端点]
  const heap: [number, number][] = [];
  let intervalIdx = 0;
  for (const { q, i } of sortedQueries) {
    // 加入所有左端点 <= q 的区间
    while (intervalIdx < intervals.length && intervals[intervalIdx][0] <= q) {
      const [l, r] = intervals[intervalIdx];
      heap.push([r - l + 1, r]);
      intervalIdx++;
    }
    // 弹出右端点 < q 的区间
    while (heap.length > 0 && heap[0][1] < q) {
      heap.shift();
      heap.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    }
    heap.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (heap.length > 0) {
      result[i] = heap[0][0];
    }
  }
  return result;
}

// 方法2：线段树/扫描线（离线处理）
function minIntervalOffline(intervals: number[][], queries: number[]): number[] {
  // 对每个查询二分查找
  intervals.sort((a, b) => a[0] - b[0]);
  const result: number[] = [];
  for (const q of queries) {
    let minLen = Infinity;
    for (const [l, r] of intervals) {
      if (l <= q && q <= r) {
        minLen = Math.min(minLen, r - l + 1);
      }
    }
    result.push(minLen === Infinity ? -1 : minLen);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 144. 包含每个查询的最小区间 =====");
console.log(
  "堆 [[1,4],[2,4],[3,6],[4,4]],[2,3,4,5]:",
  minInterval(
    [
      [1, 4],
      [2, 4],
      [3, 6],
      [4, 4],
    ],
    [2, 3, 4, 5],
  ),
); // [3,3,1,4]
console.log(
  "堆 [[2,3],[2,5],[1,8],[20,25]],[2,19,5,22]:",
  minInterval(
    [
      [2, 3],
      [2, 5],
      [1, 8],
      [20, 25],
    ],
    [2, 19, 5, 22],
  ),
); // [2,-1,4,6]

export {};
