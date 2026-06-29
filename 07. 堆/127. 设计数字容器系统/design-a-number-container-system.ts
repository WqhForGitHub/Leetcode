// ============================================================
// 127. 设计数字容器系统
// ============================================================
// LeetCode 2349. Design a Number Container System
// 支持在指定下标修改数字，并查询某个数字的最小下标。
// 时间复杂度：change O(log n)，find O(1)

// 方法1：哈希表 + 最小堆（懒删除）
class NumberContainers {
  private indexToNum: Map<number, number> = new Map();
  private numToHeap: Map<number, number[]> = new Map();

  change(index: number, number: number): void {
    this.indexToNum.set(index, number);
    if (!this.numToHeap.has(number)) this.numToHeap.set(number, []);
    const heap = this.numToHeap.get(number)!;
    heap.push(index);
    this.siftUp(heap, heap.length - 1);
  }

  find(number: number): number {
    if (!this.numToHeap.has(number)) return -1;
    const heap = this.numToHeap.get(number)!;
    while (heap.length > 0) {
      const idx = heap[0];
      if (this.indexToNum.get(idx) === number) return idx;
      heap[0] = heap[heap.length - 1];
      heap.pop();
      if (heap.length > 0) this.siftDown(heap, 0);
    }
    return -1;
  }

  private siftUp(heap: number[], i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] < heap[p]) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  }

  private siftDown(heap: number[], i: number): void {
    const n = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && heap[l] < heap[s]) s = l;
      if (r < n && heap[r] < heap[s]) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  }
}

// 方法2：哈希表 + SortedSet（用数组模拟）
class NumberContainers2 {
  private indexToNum: Map<number, number> = new Map();
  private numToIndices: Map<number, number[]> = new Map();

  change(index: number, number: number): void {
    this.indexToNum.set(index, number);
    if (!this.numToIndices.has(number)) this.numToIndices.set(number, []);
    const arr = this.numToIndices.get(number)!;
    // 有序插入
    let lo = 0,
      hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] < index) lo = mid + 1;
      else hi = mid;
    }
    if (arr[lo] !== index) arr.splice(lo, 0, index);
  }

  find(number: number): number {
    if (!this.numToIndices.has(number)) return -1;
    const arr = this.numToIndices.get(number)!;
    for (const idx of arr) {
      if (this.indexToNum.get(idx) === number) return idx;
    }
    return -1;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 127. 设计数字容器系统 =====");
const nc = new NumberContainers();
console.log("find(10):", nc.find(10)); // -1
nc.change(2, 10);
nc.change(1, 10);
nc.change(3, 10);
nc.change(5, 10);
console.log("find(10):", nc.find(10)); // 1
nc.change(1, 20);
console.log("find(10):", nc.find(10)); // 2

export {};
