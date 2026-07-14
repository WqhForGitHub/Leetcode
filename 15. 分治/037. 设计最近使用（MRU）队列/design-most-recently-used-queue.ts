// ============================================================
// 037. 设计最近使用（MRU）队列
// ============================================================
// LeetCode 1756. Design Most Recently Used Queue
// 设计 MRUQueue 类：
// - MRUQueue(n)：初始化包含 1..n 的队列
// - fetch(k)：移除第 k 个元素（1-indexed），将其追加到队列末尾，并返回该元素
// 时间复杂度：单次操作 O(sqrt(n)), 空间复杂度：O(n)

// 方法1：分块（sqrt 分块，类有序链表）（推荐）
// 将元素分散到若干个桶（每桶大小约 sqrt(n)），fetch 时定位桶、删除、追加。
// 当某桶过大时重建分块。单次操作 O(sqrt(n))。
class MRUQueue {
  private buckets: number[][];
  private blockSize: number;

  constructor(n: number) {
    this.blockSize = Math.max(1, Math.floor(Math.sqrt(n)));
    this.buckets = [];
    for (let i: number = 1; i <= n; i++) {
      const bIdx: number = Math.floor((i - 1) / this.blockSize);
      if (this.buckets[bIdx] === undefined) this.buckets[bIdx] = [];
      this.buckets[bIdx].push(i);
    }
  }

  fetch(k: number): number {
    // 定位第 k 个元素所在桶
    let count: number = 0;
    let bucketIdx: number = -1;
    let posInBucket: number = -1;
    for (let i: number = 0; i < this.buckets.length; i++) {
      const size: number = this.buckets[i].length;
      if (count + size >= k) {
        bucketIdx = i;
        posInBucket = k - count - 1;
        break;
      }
      count += size;
    }

    // 删除该元素
    const val: number = this.buckets[bucketIdx][posInBucket];
    this.buckets[bucketIdx].splice(posInBucket, 1);

    // 追加到末尾桶
    const lastIdx: number = this.buckets.length - 1;
    if (lastIdx < 0 || this.buckets[lastIdx].length >= this.blockSize) {
      this.buckets.push([val]);
    } else {
      this.buckets[lastIdx].push(val);
    }

    // 偶尔重建以避免空桶过多 / 桶过大
    let total: number = 0;
    for (const b of this.buckets) total += b.length;
    if (this.buckets.length > 2 * Math.sqrt(total) + 5) {
      this.rebuild(total);
    }

    return val;
  }

  // 重建分块，保持每桶约 blockSize 大小
  private rebuild(total: number): void {
    const all: number[] = [];
    for (const b of this.buckets) for (const v of b) all.push(v);
    this.blockSize = Math.max(1, Math.floor(Math.sqrt(total)));
    this.buckets = [];
    for (let i: number = 0; i < all.length; i++) {
      const bIdx: number = Math.floor(i / this.blockSize);
      if (this.buckets[bIdx] === undefined) this.buckets[bIdx] = [];
      this.buckets[bIdx].push(all[i]);
    }
  }
}

// 方法2：数组直接模拟
// 用数组维护队列，fetch 时 splice 删除第 k 个并 push 到末尾
// 时间复杂度 O(n) 每次，空间复杂度 O(n)
class MRUQueueArray {
  private arr: number[];

  constructor(n: number) {
    this.arr = [];
    for (let i: number = 1; i <= n; i++) this.arr.push(i);
  }

  fetch(k: number): number {
    const val: number = this.arr.splice(k - 1, 1)[0];
    this.arr.push(val);
    return val;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 037. 设计最近使用（MRU）队列 =====");
const q1: MRUQueue = new MRUQueue(8);
console.log(q1.fetch(3)); // 期望结果: 3 -> 队列: [1,2,4,5,6,7,8,3]
console.log(q1.fetch(5)); // 期望结果: 6 -> 队列: [1,2,4,5,7,8,3,6]
console.log(q1.fetch(2)); // 期望结果: 2 -> 队列: [1,4,5,7,8,3,6,2]
console.log(q1.fetch(8)); // 期望结果: 2 -> 末尾元素移到末尾不变

console.log("--- 方法2测试 ---");
const q2: MRUQueueArray = new MRUQueueArray(8);
console.log(q2.fetch(3)); // 期望结果: 3
console.log(q2.fetch(5)); // 期望结果: 6
console.log(q2.fetch(2)); // 期望结果: 2
console.log(q2.fetch(8)); // 期望结果: 2

export {};
