// ============================================================
// 106. 两个最好的不重叠活动
// ============================================================
// LeetCode 2054. Two Best Non-Overlapping Events
// 选两个不重叠活动，使价值和最大。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：扫描线 + 最大堆
function maxTwoEvents(events: number[][]): number {
  const arr: Array<{ time: number; val: number; type: number }> = [];
  for (const [s, e, v] of events) {
    arr.push({ time: s, val: v, type: 1 }); // 开始
    arr.push({ time: e + 1, val: v, type: -1 }); // 结束
  }
  arr.sort((a, b) => a.time - b.time || a.type - b.type);
  let maxEnded = 0;
  let result = 0;
  let i = 0;
  while (i < arr.length) {
    const t = arr[i].time;
    while (i < arr.length && arr[i].time === t && arr[i].type === -1) {
      maxEnded = Math.max(maxEnded, arr[i].val);
      i++;
    }
    while (i < arr.length && arr[i].time === t && arr[i].type === 1) {
      result = Math.max(result, maxEnded + arr[i].val);
      i++;
    }
  }
  return result;
}

// 方法2：堆 + 排序
function maxTwoEventsHeap(events: number[][]): number {
  events.sort((a, b) => a[0] - b[0]);
  const heap: Array<{ end: number; val: number }> = []; // 最小堆按 end
  const push = (v: { end: number; val: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].end < heap[p].end) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): { end: number; val: number } => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l].end < heap[s].end) s = l;
        if (r < heap.length && heap[r].end < heap[s].end) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  let maxEnded = 0;
  let result = 0;
  for (const [s, e, v] of events) {
    while (heap.length > 0 && heap[0].end < s) {
      maxEnded = Math.max(maxEnded, pop().val);
    }
    result = Math.max(result, maxEnded + v);
    push({ end: e, val: v });
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 106. 两个最好的不重叠活动 =====");
console.log(
  "扫描线:",
  maxTwoEvents([
    [1, 3, 2],
    [4, 5, 2],
    [2, 4, 3],
  ]),
); // 期望 4
console.log(
  "堆:",
  maxTwoEventsHeap([
    [1, 3, 2],
    [4, 5, 2],
    [1, 5, 5],
  ]),
); // 期望 5

export {};
