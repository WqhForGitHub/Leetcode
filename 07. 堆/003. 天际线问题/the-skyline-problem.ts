// ============================================================
// 003. 天际线问题
// ============================================================
// LeetCode 218. The Skyline Problem
// 给定建筑物的轮廓线，输出天际线。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

interface Building {
  l: number;
  r: number;
  h: number;
}

class MaxHeap {
  private heap: number[] = [];
  private count: Map<number, number> = new Map();
  get size(): number {
    return this.heap.length;
  }
  peek(): number {
    return this.heap[0];
  }
  push(v: number): void {
    this.count.set(v, (this.count.get(v) ?? 0) + 1);
    this.heap.push(v);
    this.siftUp(this.heap.length - 1);
  }
  remove(v: number): void {
    const c = this.count.get(v);
    if (c === undefined) return;
    if (c === 1) {
      this.count.delete(v);
      const idx = this.heap.indexOf(v);
      if (idx === -1) return;
      const last = this.heap.pop()!;
      if (idx < this.heap.length) {
        this.heap[idx] = last;
        this.siftUp(idx);
        this.siftDown(idx);
      }
    } else {
      this.count.set(v, c - 1);
    }
  }
  private siftUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[i] > this.heap[p]) {
        [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
        i = p;
      } else break;
    }
  }
  private siftDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.heap[l] > this.heap[s]) s = l;
      if (r < n && this.heap[r] > this.heap[s]) s = r;
      if (s !== i) {
        [this.heap[i], this.heap[s]] = [this.heap[s], this.heap[i]];
        i = s;
      } else break;
    }
  }
}

// 方法1：扫描线 + 最大堆（推荐）
function getSkyline(buildings: number[][]): number[][] {
  const events: Array<{ x: number; h: number; type: number }> = [];
  for (const [l, r, h] of buildings) {
    events.push({ x: l, h, type: 1 });
    events.push({ x: r, h, type: -1 });
  }
  events.sort((a, b) => a.x - b.x || b.h - a.h || a.type - b.type);
  const result: number[][] = [];
  const heap = new MaxHeap();
  heap.push(0);
  let prev = 0;
  let i = 0;
  while (i < events.length) {
    const x = events[i].x;
    while (i < events.length && events[i].x === x) {
      if (events[i].type === 1) heap.push(events[i].h);
      else heap.remove(events[i].h);
      i++;
    }
    const cur = heap.peek();
    if (cur !== prev) {
      result.push([x, cur]);
      prev = cur;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 003. 天际线问题 =====");
console.log(
  JSON.stringify(
    getSkyline([
      [2, 9, 10],
      [3, 7, 15],
      [5, 12, 12],
      [15, 20, 10],
      [19, 24, 8],
    ]),
  ),
);
// 期望 [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]

export {};
