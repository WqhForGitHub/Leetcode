// ============================================================
// 021. 会议室 II
// ============================================================
// LeetCode 253. Meeting Rooms II
// 给定一个会议时间区间数组，计算所需的最少会议室数量。

interface Interval {
  start: number;
  end: number;
}

// 方法1：分别排序开始和结束时间，双指针扫描（推荐，O(n log n)，O(n)）
function minMeetingRooms(intervals: Interval[]): number {
  const n: number = intervals.length;
  if (n === 0) return 0;

  const starts: number[] = intervals.map((iv) => iv.start).sort((a, b) => a - b);
  const ends: number[] = intervals.map((iv) => iv.end).sort((a, b) => a - b);

  let rooms: number = 0;
  let endPtr: number = 0;
  for (let i = 0; i < n; i++) {
    // 若当前会议开始时最早结束的会议已结束，可复用房间
    if (starts[i] < ends[endPtr]) {
      rooms++;
    } else {
      endPtr++;
    }
  }
  return rooms;
}

// 简单最小堆实现
class MinHeap {
  private data: number[] = [];

  size(): number {
    return this.data.length;
  }

  peek(): number {
    return this.data[0];
  }

  push(val: number): void {
    this.data.push(val);
    this.siftUp(this.data.length - 1);
  }

  pop(): number {
    const top: number = this.data[0];
    const last: number = this.data.pop() as number;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const parent: number = (i - 1) >> 1;
      if (this.data[parent] <= this.data[i]) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  private siftDown(i: number): void {
    const n: number = this.data.length;
    while (true) {
      let smallest: number = i;
      const left: number = 2 * i + 1;
      const right: number = 2 * i + 2;
      if (left < n && this.data[left] < this.data[smallest]) smallest = left;
      if (right < n && this.data[right] < this.data[smallest]) smallest = right;
      if (smallest === i) break;
      [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
      i = smallest;
    }
  }
}

// 方法2：最小堆（O(n log n)，O(n)）
// 按开始时间排序，堆中保存每个会议室的结束时间，
// 若最早结束的会议室可复用则弹出，最后堆的大小即所需房间数。
function minMeetingRooms2(intervals: Interval[]): number {
  if (intervals.length === 0) return 0;
  const arr: Interval[] = [...intervals].sort((a, b) => a.start - b.start);
  const heap = new MinHeap();
  for (const iv of arr) {
    if (heap.size() > 0 && heap.peek() <= iv.start) {
      heap.pop();
    }
    heap.push(iv.end);
  }
  return heap.size();
}

// ============================================================
// 测试
// ============================================================
console.log("===== 021. 会议室 II =====");
console.log(
  "方法1:",
  minMeetingRooms([
    { start: 0, end: 30 },
    { start: 5, end: 10 },
    { start: 15, end: 20 },
  ])
); // 期望 2
console.log(
  "方法1:",
  minMeetingRooms([
    { start: 7, end: 10 },
    { start: 2, end: 4 },
  ])
); // 期望 1
console.log(
  "方法2:",
  minMeetingRooms2([
    { start: 0, end: 30 },
    { start: 5, end: 10 },
    { start: 15, end: 20 },
  ])
); // 期望 2
console.log(
  "方法2:",
  minMeetingRooms2([
    { start: 7, end: 10 },
    { start: 2, end: 4 },
  ])
); // 期望 1

export {};
