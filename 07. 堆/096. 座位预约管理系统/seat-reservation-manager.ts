// ============================================================
// 096. 座位预约管理系统
// ============================================================
// LeetCode 1845. Seat Reservation Manager
// 管理 n 个座位，reserve 返回最小可用编号，unreserve 释放。
// 时间复杂度：reserve/unreserve O(log n)

// 方法1：最小堆
class SeatManager {
  private heap: number[] = [];
  constructor(n: number) {
    for (let i = 1; i <= n; i++) this.heap.push(i);
    // 建堆
    for (let i = (this.heap.length >> 1) - 1; i >= 0; i--) this.siftDown(i);
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
  private siftUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[i] < this.heap[p]) {
        [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
        i = p;
      } else break;
    }
  }
  reserve(): number {
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return top;
  }
  unreserve(seatNumber: number): void {
    this.heap.push(seatNumber);
    this.siftUp(this.heap.length - 1);
  }
}

// 方法2：TreeSet（用排序数组模拟）
class SeatManagerSet {
  private available: boolean[];
  private minAvailable: number = 1;
  private freed: number[] = [];
  constructor(n: number) {
    this.available = new Array(n + 1).fill(true);
  }
  reserve(): number {
    if (this.freed.length > 0) {
      this.freed.sort((a, b) => a - b);
      const seat = this.freed.shift()!;
      this.available[seat] = false;
      return seat;
    }
    while (!this.available[this.minAvailable]) this.minAvailable++;
    this.available[this.minAvailable] = false;
    return this.minAvailable++;
  }
  unreserve(seatNumber: number): void {
    this.available[seatNumber] = true;
    this.freed.push(seatNumber);
    if (seatNumber < this.minAvailable) this.minAvailable = seatNumber;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 096. 座位预约管理系统 =====");
const sm = new SeatManager(5);
console.log("reserve:", sm.reserve()); // 期望 1
console.log("reserve:", sm.reserve()); // 期望 2
sm.unreserve(2);
console.log("reserve:", sm.reserve()); // 期望 2
console.log("reserve:", sm.reserve()); // 期望 3

export {};
