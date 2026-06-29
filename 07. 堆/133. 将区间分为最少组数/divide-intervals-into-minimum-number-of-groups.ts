// ============================================================
// 133. 将区间分为最少组数
// ============================================================
// LeetCode 2406. Divide Intervals Into Minimum Number of Groups
// 将区间分成最少组，使每组内区间不重叠。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：最小堆（按结束时间）
function minGroups(intervals: number[][]): number {
  intervals.sort((a, b) => a[0] - b[0]);
  const heap: number[] = []; // 存储每组的结束时间
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] < heap[p]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
      else break;
    }
  };
  const siftDown = (): void => {
    let i = 0;
    const n = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && heap[l] < heap[s]) s = l;
      if (r < n && heap[r] < heap[s]) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  for (const [start, end] of intervals) {
    if (heap.length > 0 && heap[0] < start) {
      heap[0] = end;
      siftDown();
    } else {
      heap.push(end);
      siftUp(heap.length - 1);
    }
  }
  return heap.length;
}

// 方法2：差分数组 / 扫描线
function minGroupsSweep(intervals: number[][]): number {
  const events: Array<[number, number]> = [];
  for (const [s, e] of intervals) {
    events.push([s, 1]);
    events.push([e + 1, -1]);
  }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let cur = 0, max = 0;
  for (const [, delta] of events) {
    cur += delta;
    max = Math.max(max, cur);
  }
  return max;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 133. 将区间分为最少组数 =====");
console.log("堆:", minGroups([[5, 10], [6, 8], [1, 5], [2, 3], [1, 10]])); // 期望 3
console.log("扫描线:", minGroupsSweep([[1, 3], [5, 6], [8, 10], [4, 7]])); // 期望 1

export {};
