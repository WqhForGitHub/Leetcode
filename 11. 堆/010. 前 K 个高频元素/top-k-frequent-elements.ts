// ============================================================
// 010. 前 K 个高频元素
// ============================================================
// LeetCode 347. Top K Frequent Elements
// 给你一个整数数组 nums 和一个整数 k，返回出现频率前 k 高的元素。
// 时间复杂度：O(N log k)，空间复杂度：O(N)

class MinHeap {
  private heap: Array<{ val: number; freq: number }> = [];
  get size(): number {
    return this.heap.length;
  }
  peek(): Array<{ val: number; freq: number }>[0] | undefined {
    return this.heap[0];
  }
  push(v: { val: number; freq: number }): void {
    this.heap.push(v);
    this.siftUp(this.heap.length - 1);
  }
  pop(): Array<{ val: number; freq: number }>[0] | undefined {
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
      if (this.heap[i].freq < this.heap[p].freq) {
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
      if (l < n && this.heap[l].freq < this.heap[s].freq) s = l;
      if (r < n && this.heap[r].freq < this.heap[s].freq) s = r;
      if (s !== i) {
        [this.heap[i], this.heap[s]] = [this.heap[s], this.heap[i]];
        i = s;
      } else break;
    }
  }
}

// 方法1：最小堆，按频率（推荐）
function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
  const heap = new MinHeap();
  for (const [val, f] of freq) {
    heap.push({ val, freq: f });
    if (heap.size > k) heap.pop();
  }
  const res: number[] = [];
  while (heap.size > 0) res.push(heap.pop()!.val);
  return res;
}

// 方法2：桶排序
function topKFrequentBucket(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [val, f] of freq) buckets[f].push(val);
  const res: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && res.length < k; i--) {
    for (const v of buckets[i]) {
      res.push(v);
      if (res.length === k) break;
    }
  }
  return res;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 010. 前 K 个高频元素 =====");
console.log("最小堆:", topKFrequent([1, 1, 1, 2, 2, 3], 2)); // 期望 [1,2]
console.log("桶排序:", topKFrequentBucket([1, 1, 1, 2, 2, 3], 2)); // 期望 [1,2]

export {};
