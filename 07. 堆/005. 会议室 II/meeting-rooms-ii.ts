// ============================================================
// 005. 会议室 II
// ============================================================
// LeetCode 253. Meeting Rooms II
// 给定一系列会议时间区间，返回所需的最少会议室数量。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

class MinHeap {
  private heap: number[] = [];
  get size(): number {
    return this.heap.length;
  }
  peek(): number | undefined {
    return this.heap[0];
  }
  push(v: number): void {
    this.heap.push(v);
    this.siftUp(this.heap.length - 1);
  }
  pop(): number | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return top;
  }
  private siftUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[i] < this.heap[p]) {
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
      if (l < n && this.heap[l] < this.heap[s]) s = l;
      if (r < n && this.heap[r] < this.heap[s]) s = r;
      if (s !== i) {
        [this.heap[i], this.heap[s]] = [this.heap[s], this.heap[i]];
        i = s;
      } else break;
    }
  }
}

// 方法1：最小堆，按结束时间（推荐）
function minMeetingRooms(intervals: number[][]): number {
  if (intervals.length === 0) return 0;
  intervals.sort((a, b) => a[0] - b[0]);
  const heap = new MinHeap();
  heap.push(intervals[0][1]);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] >= heap.peek()!) heap.pop();
    heap.push(intervals[i][1]);
  }
  return heap.size;
}

// 方法2：扫描线
function minMeetingRoomsSweep(intervals: number[][]): number {
  const events: Array<{ time: number; delta: number }> = [];
  for (const [s, e] of intervals) {
    events.push({ time: s, delta: 1 });
    events.push({ time: e, delta: -1 });
  }
  events.sort((a, b) => a.time - b.time || a.delta - b.delta);
  let cur = 0;
  let max = 0;
  for (const ev of events) {
    cur += ev.delta;
    max = Math.max(max, cur);
  }
  return max;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 005. 会议室 II =====");
console.log("最小堆:", minMeetingRooms([[0, 30], [5, 10], [15, 20]])); // 期望 2
console.log("扫描线:", minMeetingRoomsSweep([[7, 10], [2, 4]])); // 期望 1

export {};
