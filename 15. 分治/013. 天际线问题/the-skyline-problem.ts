// ============================================================
// 013. 天际线问题
// ============================================================
// LeetCode 218. The Skyline Problem
// 给定建筑物的 [left, right, height]，输出天际线轮廓的关键点。
// 关键点为水平线段的左端点，格式为 [x, y]。
// 时间复杂度：O(n log n), 空间复杂度：O(n)

interface Point {
  x: number;
  y: number;
}

// 方法1：分治合并天际线（推荐）
// 将建筑物分成左右两半，分别求天际线，再将两条天际线合并
function getSkyline1(buildings: number[][]): number[][] {
  if (buildings.length === 0) return [];
  const skyline: Point[] = dac(buildings, 0, buildings.length - 1);
  return skyline.map((p: Point): number[] => [p.x, p.y]);
}

// 分治：单个建筑直接返回两段关键点；多个建筑分治后合并
function dac(buildings: number[][], lo: number, hi: number): Point[] {
  if (lo === hi) {
    const b: number[] = buildings[lo];
    return [
      { x: b[0], y: b[2] },
      { x: b[1], y: 0 },
    ];
  }
  const mid: number = (lo + hi) >> 1;
  const left: Point[] = dac(buildings, lo, mid);
  const right: Point[] = dac(buildings, mid + 1, hi);
  return mergeSkylines(left, right);
}

// 合并两条天际线：在每个 x 处取两者高度的最大值，仅在高度变化时记录关键点
function mergeSkylines(left: Point[], right: Point[]): Point[] {
  const result: Point[] = [];
  let i: number = 0;
  let j: number = 0;
  let h1: number = 0;
  let h2: number = 0;
  let prevH: number = 0;
  while (i < left.length || j < right.length) {
    let x: number;
    if (j >= right.length || (i < left.length && left[i].x < right[j].x)) {
      x = left[i].x;
      h1 = left[i].y;
      i++;
    } else if (i >= left.length || (j < right.length && left[i].x > right[j].x)) {
      x = right[j].x;
      h2 = right[j].y;
      j++;
    } else {
      // 两者 x 相同，同时推进
      x = left[i].x;
      h1 = left[i].y;
      h2 = right[j].y;
      i++;
      j++;
    }
    const maxH: number = Math.max(h1, h2);
    if (maxH !== prevH) {
      result.push({ x, y: maxH });
      prevH = maxH;
    }
  }
  return result;
}

// 方法2：扫描线 + 最大堆（懒删除）
// 将每个建筑拆为进入/离开事件，按 x 排序扫描，堆维护当前最大高度
class MaxHeapMulti {
  private heap: number[] = [];
  private pending: Map<number, number> = new Map();

  push(val: number): void {
    this.heap.push(val);
    this.siftUp(this.heap.length - 1);
  }

  top(): number {
    this.clean();
    return this.heap.length > 0 ? this.heap[0] : 0;
  }

  remove(val: number): void {
    this.pending.set(val, (this.pending.get(val) ?? 0) + 1);
    this.clean();
  }

  // 清理堆顶已被标记删除的元素
  private clean(): void {
    while (this.heap.length > 0 && this.pending.has(this.heap[0])) {
      const top: number = this.heap[0];
      const cnt: number = this.pending.get(top) as number;
      if (cnt === 1) this.pending.delete(top);
      else this.pending.set(top, cnt - 1);
      this.heap[0] = this.heap[this.heap.length - 1];
      this.heap.pop();
      if (this.heap.length > 0) this.siftDown(0);
    }
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const parent: number = (i - 1) >> 1;
      if (this.heap[parent] >= this.heap[i]) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  private siftDown(i: number): void {
    const n: number = this.heap.length;
    while (true) {
      const l: number = 2 * i + 1;
      const r: number = 2 * i + 2;
      let largest: number = i;
      if (l < n && this.heap[l] > this.heap[largest]) largest = l;
      if (r < n && this.heap[r] > this.heap[largest]) largest = r;
      if (largest === i) break;
      [this.heap[i], this.heap[largest]] = [this.heap[largest], this.heap[i]];
      i = largest;
    }
  }
}

interface Event {
  x: number;
  h: number;
  type: number; // 1 表示进入，-1 表示离开
}

function getSkyline2(buildings: number[][]): number[][] {
  if (buildings.length === 0) return [];
  const events: Event[] = [];
  for (const b of buildings) {
    events.push({ x: b[0], h: b[2], type: 1 });
    events.push({ x: b[1], h: b[2], type: -1 });
  }
  // 排序：x 升序；同 x 时进入事件在前；同为进入时高度大的在前，同为离开时高度小的在前
  events.sort((a: Event, b: Event): number => {
    if (a.x !== b.x) return a.x - b.x;
    if (a.type !== b.type) return b.type - a.type;
    return a.type === 1 ? b.h - a.h : a.h - b.h;
  });

  const result: number[][] = [];
  const heap: MaxHeapMulti = new MaxHeapMulti();
  heap.push(0);
  let prevMax: number = 0;
  for (const e of events) {
    if (e.type === 1) {
      heap.push(e.h);
    } else {
      heap.remove(e.h);
    }
    const curMax: number = heap.top();
    if (curMax !== prevMax) {
      result.push([e.x, curMax]);
      prevMax = curMax;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 013. 天际线问题 =====");
const buildings1: number[][] = [
  [2, 9, 10],
  [3, 7, 15],
  [5, 12, 12],
  [15, 20, 10],
  [19, 24, 8],
];
console.log("方法1:", JSON.stringify(getSkyline1(buildings1)));
// 期望结果: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]
console.log("方法2:", JSON.stringify(getSkyline2(buildings1)));
// 期望结果: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]
const buildings2: number[][] = [
  [0, 2, 3],
  [2, 5, 3],
];
console.log("方法1:", JSON.stringify(getSkyline1(buildings2))); // 期望结果: [[0,3],[5,0]]
console.log("方法2:", JSON.stringify(getSkyline2(buildings2))); // 期望结果: [[0,3],[5,0]]
const buildings3: number[][] = [
  [1, 2, 1],
  [1, 2, 2],
  [1, 2, 3],
];
console.log("方法1:", JSON.stringify(getSkyline1(buildings3))); // 期望结果: [[1,3],[2,0]]
console.log("方法2:", JSON.stringify(getSkyline2(buildings3))); // 期望结果: [[1,3],[2,0]]

export {};
