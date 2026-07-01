// ============================================================
// 031. 前 K 个高频元素
// ============================================================
// LeetCode 347. Top K Frequent Elements
// 返回数组中出现频率前 k 高的元素，答案唯一。

// 小顶堆实现（仅含必要方法）
class MinHeapPair {
  private data: Array<[number, number]> = []; // [元素, 频率]

  size(): number {
    return this.data.length;
  }

  peek(): [number, number] | undefined {
    return this.data[0];
  }

  push(item: [number, number]): void {
    this.data.push(item);
    this.siftUp(this.data.length - 1);
  }

  pop(): [number, number] | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.data[parent][1] <= this.data[i][1]) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  private siftDown(i: number): void {
    const n = this.data.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && this.data[left][1] < this.data[smallest][1]) smallest = left;
      if (right < n && this.data[right][1] < this.data[smallest][1]) smallest = right;
      if (smallest === i) break;
      [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
      i = smallest;
    }
  }
}

// 方法1：桶排序（推荐，O(n) 时间，O(n) 空间）
// 用频率作为桶下标，从高到低收集元素直到取够 k 个。
function topKFrequentBucket(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const num of nums) {
    freq.set(num, (freq.get(num) ?? 0) + 1);
  }

  const n = nums.length;
  // 桶下标为频率，范围 1..n
  const buckets: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [num, count] of freq) {
    buckets[count].push(num);
  }

  const result: number[] = [];
  for (let f = n; f >= 1 && result.length < k; f--) {
    for (const num of buckets[f]) {
      result.push(num);
      if (result.length === k) return result;
    }
  }
  return result;
}

// 方法2：大小为 k 的小顶堆（O(n log k) 时间，O(n) 空间）
// 维护一个频率最小的 k 元素小顶堆，遍历完堆中即为前 k 高频。
function topKFrequentHeap(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const num of nums) {
    freq.set(num, (freq.get(num) ?? 0) + 1);
  }

  const heap = new MinHeapPair();
  for (const [num, count] of freq) {
    heap.push([num, count]);
    if (heap.size() > k) {
      heap.pop();
    }
  }

  const result: number[] = [];
  while (heap.size() > 0) {
    result.push(heap.pop()![0]);
  }
  return result;
}

// 方法3：按频率排序（O(n log n) 时间，O(n) 空间）
// 统计频率后按频率降序排序，取前 k 个。
function topKFrequentSort(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const num of nums) {
    freq.set(num, (freq.get(num) ?? 0) + 1);
  }

  const entries = Array.from(freq.entries());
  entries.sort((a, b) => b[1] - a[1]);

  return entries.slice(0, k).map((e) => e[0]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 031. 前 K 个高频元素 =====");

function sortArr(arr: number[]): number[] {
  return [...arr].sort((a, b) => a - b);
}

console.log("桶排序 [1,1,1,2,2,3], k=2:", sortArr(topKFrequentBucket([1, 1, 1, 2, 2, 3], 2))); // 期望 [1,2]
console.log("小顶堆 [1,1,1,2,2,3], k=2:", sortArr(topKFrequentHeap([1, 1, 1, 2, 2, 3], 2))); // 期望 [1,2]
console.log("排序法 [1,1,1,2,2,3], k=2:", sortArr(topKFrequentSort([1, 1, 1, 2, 2, 3], 2))); // 期望 [1,2]
console.log("桶排序 [1], k=1:", topKFrequentBucket([1], 1)); // 期望 [1]

export {};
