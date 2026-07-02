// ============================================================
// 233. 包含每个查询的最小区间
// ============================================================
// LeetCode 1851. Minimum Interval to Include Each Query
// 给定 intervals = [[left, right], ...] 和 queries 数组。
// 对每个查询值 q，找到满足 left <= q <= right 的最短区间长度，
// 不存在则返回 -1。

// 最小堆辅助函数（按 length 升序，元素为 [length, right]）
function pushHeap(heap: number[][], item: number[]): void {
  heap.push(item);
  let i = heap.length - 1;
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (heap[p][0] > heap[i][0]) {
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    } else break;
  }
}

function popHeap(heap: number[][]): number[] {
  const top = heap[0];
  const last = heap.pop()!;
  if (heap.length > 0) {
    heap[0] = last;
    let i = 0;
    const n = heap.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let smallest = i;
      if (l < n && heap[l][0] < heap[smallest][0]) smallest = l;
      if (r < n && heap[r][0] < heap[smallest][0]) smallest = r;
      if (smallest === i) break;
      [heap[smallest], heap[i]] = [heap[i], heap[smallest]];
      i = smallest;
    }
  }
  return top;
}

// 方法1：区间按 left 排序 + 查询离线排序 + 最小堆（O((n+q) log n)）
// 查询升序处理，把 left <= q 的区间入堆（按长度），
// 弹出 right < q 的失效区间，堆顶即为答案。
function minInterval1(intervals: number[][], queries: number[]): number[] {
  intervals.sort((a, b) => a[0] - b[0]); // 按 left 升序
  const m = queries.length;
  const indexedQueries: number[][] = queries.map((q, i) => [q, i]);
  indexedQueries.sort((a, b) => a[0] - b[0]); // 按查询值升序

  const ans = new Array<number>(m).fill(-1);
  const heap: number[][] = []; // [length, right]
  let j = 0;
  for (const [q, idx] of indexedQueries) {
    while (j < intervals.length && intervals[j][0] <= q) {
      const len = intervals[j][1] - intervals[j][0] + 1;
      pushHeap(heap, [len, intervals[j][1]]);
      j++;
    }
    while (heap.length > 0 && heap[0][1] < q) {
      popHeap(heap);
    }
    ans[idx] = heap.length > 0 ? heap[0][0] : -1;
  }
  return ans;
}

// 方法2：事件扫描 + 最小堆（O((n+q) log n)）
// 将区间起点和查询都作为事件按位置排序，同位置先处理区间起点再处理查询。
// 维护最小堆（按长度），查询时弹出 right < 当前位置的失效区间。
function minInterval2(intervals: number[][], queries: number[]): number[] {
  type Event = { pos: number; type: number; length: number; right: number; idx: number };
  const events: Event[] = [];
  for (const [l, r] of intervals) {
    events.push({ pos: l, type: 0, length: r - l + 1, right: r, idx: -1 });
  }
  queries.forEach((q, i) => events.push({ pos: q, type: 1, length: 0, right: 0, idx: i }));
  // 按位置升序，同位置区间起点(type=0)先于查询(type=1)
  events.sort((a, b) => a.pos - b.pos || a.type - b.type);

  const ans = new Array<number>(queries.length).fill(-1);
  const heap: number[][] = []; // [length, right]
  for (const e of events) {
    if (e.type === 0) {
      pushHeap(heap, [e.length, e.right]);
    } else {
      while (heap.length > 0 && heap[0][1] < e.pos) {
        popHeap(heap);
      }
      ans[e.idx] = heap.length > 0 ? heap[0][0] : -1;
    }
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 233. 包含每个查询的最小区间 =====");
const intervals1 = [
  [1, 4],
  [2, 4],
  [3, 6],
  [4, 4],
];
const queries1 = [2, 3, 4, 5];
console.log("方法1 [2,3,4,5]:", minInterval1(intervals1, queries1)); // [3,3,1,4]
console.log("方法2 [2,3,4,5]:", minInterval2(intervals1, queries1)); // [3,3,1,4]

const intervals2 = [
  [2, 3],
  [2, 5],
  [1, 8],
  [20, 25],
];
const queries2 = [2, 19, 5, 22];
console.log("方法1 [2,19,5,22]:", minInterval1(intervals2, queries2)); // [2,-1,4,6]
console.log("方法2 [2,19,5,22]:", minInterval2(intervals2, queries2)); // [2,-1,4,6]

export {};
