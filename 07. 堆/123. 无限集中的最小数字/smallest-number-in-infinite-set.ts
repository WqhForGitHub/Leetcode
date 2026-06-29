// ============================================================
// 123. 无限集中的最小数字
// ============================================================
// LeetCode 2336. Smallest Number in Infinite Set
// 维护一个从1开始的正整数集合，支持弹出最小值和加回元素。
// 时间复杂度：O(log n) per operation，空间复杂度：O(n)

// 方法1：最小堆 + Set 去重
class SmallestInfiniteSet {
  private heap: number[] = [];
  private set: Set<number> = new Set();
  private next: number = 1;

  constructor() {
    this.next = 1;
  }

  popSmallest(): number {
    if (this.heap.length > 0) {
      const min = this.heap[0];
      this.heap[0] = this.heap[this.heap.length - 1];
      this.heap.pop();
      this.siftDown(0);
      this.set.delete(min);
      return min;
    }
    return this.next++;
  }

  addBack(num: number): void {
    if (num >= this.next || this.set.has(num)) return;
    this.set.add(num);
    this.heap.push(num);
    this.siftUp(this.heap.length - 1);
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
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.heap[l] < this.heap[s]) s = l;
      if (r < n && this.heap[r] < this.heap[s]) s = r;
      if (s !== i) { [this.heap[i], this.heap[s]] = [this.heap[s], this.heap[i]]; i = s; }
      else break;
    }
  }
}

// 方法2：TreeSet 模拟（用 sorted array）
class SmallestInfiniteSet2 {
  private added: number[] = [];
  private next: number = 1;

  popSmallest(): number {
    if (this.added.length > 0) {
      return this.added.shift()!;
    }
    return this.next++;
  }

  addBack(num: number): void {
    if (num >= this.next) return;
    const idx = this.added.findIndex(x => x >= num);
    if (idx !== -1 && this.added[idx] === num) return;
    this.added.splice(idx === -1 ? this.added.length : idx, 0, num);
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 123. 无限集中的最小数字 =====");
const sis = new SmallestInfiniteSet();
sis.addBack(2);
console.log("popSmallest:", sis.popSmallest()); // 1
console.log("popSmallest:", sis.popSmallest()); // 2
console.log("popSmallest:", sis.popSmallest()); // 3
sis.addBack(1);
console.log("popSmallest:", sis.popSmallest()); // 1
console.log("popSmallest:", sis.popSmallest()); // 4

export {};
