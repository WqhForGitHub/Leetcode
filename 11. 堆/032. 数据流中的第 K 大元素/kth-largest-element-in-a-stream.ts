// ============================================================
// 032. 数据流中的第 K 大元素
// ============================================================
// LeetCode 703. Kth Largest Element in a Stream
// 设计一个数据流，每次添加元素后返回第 k 大的元素。
// 时间复杂度：add O(log k)，空间复杂度：O(k)

// 方法1：最小堆维护 k 个最大元素
class KthLargest {
  private heap: number[] = [];
  private k: number;
  constructor(k: number, nums: number[]) {
    this.k = k;
    for (const n of nums) this.add(n);
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
  add(val: number): number {
    this.heap.push(val);
    this.siftUp(this.heap.length - 1);
    if (this.heap.length > this.k) {
      const last = this.heap.pop()!;
      this.heap[0] = last;
      this.siftDown(0);
    }
    return this.heap[0];
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 032. 数据流中的第 K 大元素 =====");
const kl = new KthLargest(3, [4, 5, 8, 2]);
console.log("add 3:", kl.add(3)); // 期望 4
console.log("add 5:", kl.add(5)); // 期望 5
console.log("add 10:", kl.add(10)); // 期望 5
console.log("add 9:", kl.add(9)); // 期望 8

export {};
