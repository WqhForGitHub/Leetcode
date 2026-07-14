// ============================================================
// 016. 天际线问题
// ============================================================
// LeetCode 218. The Skyline Problem
// 给定建筑物 [left,right,height]，输出天际线关键点 [x, height]。
// 关键点为天际线高度发生变化的水平线段左端点。

interface Point {
  x: number;
  h: number;
  type: "start" | "end"; // start=建筑物起点(左), end=建筑物终点(右)
}

// 方法1：扫描线 + 最大堆 + 惰性删除（平均 O(n log n)，最坏 O(n^2)）
function getSkyline(buildings: number[][]): number[][] {
  const events: Point[] = [];
  for (const [l, r, h] of buildings) {
    events.push({ x: l, h, type: "start" });
    events.push({ x: r, h, type: "end" });
  }

  // 排序规则：
  // 1. x 升序
  // 2. 同 x：起点优先（高的先）；终点滞后（高的后出）
  // 具体规则保证正确合并相同 x 的事件
  events.sort((a, b) => {
    if (a.x !== b.x) return a.x - b.x;
    if (a.type === "start" && b.type === "start") return b.h - a.h; // 高的起点先
    if (a.type === "end" && b.type === "end") return a.h - b.h; // 矮的终点先
    return a.type === "start" ? -1 : 1; // 起点在终点前
  });

  const result: number[][] = [];
  // 最大堆（用数组模拟 + 惰性删除）
  const heap: number[] = [];
  const removed = new Map<number, number>(); // height -> 待删计数

  const pushHeap = (val: number): void => {
    heap.push(val);
    siftUp(heap, heap.length - 1);
  };

  const popMax = (): number | undefined => {
    while (heap.length > 0) {
      const top = heap[0];
      const cnt = removed.get(top) ?? 0;
      if (cnt > 0) {
        // 惰性删除：弹出并继续
        if (cnt === 1) removed.delete(top);
        else removed.set(top, cnt - 1);
        heap[0] = heap[heap.length - 1];
        heap.pop();
        if (heap.length > 0) siftDown(heap, 0);
      } else {
        return top;
      }
    }
    return undefined;
  };

  const peekMax = (): number => {
    const top = popMax();
    if (top === undefined) return 0;
    return top;
  };

  function siftUp(h: number[], i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (h[parent] >= h[i]) break;
      [h[parent], h[i]] = [h[i], h[parent]];
      i = parent;
    }
  }

  function siftDown(h: number[], i: number): void {
    const n = h.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let largest = i;
      if (l < n && h[l] > h[largest]) largest = l;
      if (r < n && h[r] > h[largest]) largest = r;
      if (largest === i) break;
      [h[i], h[largest]] = [h[largest], h[i]];
      i = largest;
    }
  }

  let prevMax = 0;
  for (const ev of events) {
    if (ev.type === "start") {
      pushHeap(ev.h);
    } else {
      const cnt = removed.get(ev.h) ?? 0;
      removed.set(ev.h, cnt + 1);
    }
    const curMax = peekMax();
    if (curMax !== prevMax) {
      result.push([ev.x, curMax]);
      prevMax = curMax;
    }
  }

  return result;
}

// 方法2：扫描线 + 有序集合（O(n log n) 时间，O(n) 空间）
// 使用排序数组手动维护活跃高度集合，插入/删除 O(log n)。
function getSkylineMultiset(buildings: number[][]): number[][] {
  const events: Point[] = [];
  for (const [l, r, h] of buildings) {
    events.push({ x: l, h, type: "start" });
    events.push({ x: r, h, type: "end" });
  }

  events.sort((a, b) => {
    if (a.x !== b.x) return a.x - b.x;
    if (a.type === "start" && b.type === "start") return b.h - a.h;
    if (a.type === "end" && b.type === "end") return a.h - b.h;
    return a.type === "start" ? -1 : 1;
  });

  const result: number[][] = [];
  // 用排序数组模拟 multiset（允许重复）
  const heights: number[] = []; // 降序排列

  const binarySearchInsert = (val: number): void => {
    let lo = 0;
    let hi = heights.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (heights[mid] >= val) lo = mid + 1;
      else hi = mid;
    }
    heights.splice(lo, 0, val);
  };

  const binarySearchRemove = (val: number): void => {
    let lo = 0;
    let hi = heights.length - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (heights[mid] === val) {
        heights.splice(mid, 1);
        return;
      }
      if (heights[mid] > val) lo = mid + 1;
      else hi = mid - 1;
    }
  };

  const currentMax = (): number => (heights.length > 0 ? heights[0] : 0);

  let prevMax = 0;
  for (const ev of events) {
    if (ev.type === "start") {
      binarySearchInsert(ev.h);
    } else {
      binarySearchRemove(ev.h);
    }
    const curMax = currentMax();
    if (curMax !== prevMax) {
      result.push([ev.x, curMax]);
      prevMax = curMax;
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 016. 天际线问题 =====");
console.log(
  "堆 [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]:",
  JSON.stringify(
    getSkyline([
      [2, 9, 10],
      [3, 7, 15],
      [5, 12, 12],
      [15, 20, 10],
      [19, 24, 8],
    ]),
  ),
); // [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]
console.log(
  "堆 [[0,2,3],[2,5,3]]:",
  JSON.stringify(
    getSkyline([
      [0, 2, 3],
      [2, 5, 3],
    ]),
  ),
); // [[0,3],[5,0]]
console.log(
  "集合 [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]:",
  JSON.stringify(
    getSkylineMultiset([
      [2, 9, 10],
      [3, 7, 15],
      [5, 12, 12],
      [15, 20, 10],
      [19, 24, 8],
    ]),
  ),
); // [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]

export {};
