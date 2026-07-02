// ============================================================
// 019. 前 K 个高频元素
// ============================================================
// LeetCode 347. Top K Frequent Elements
// 给定整数数组 nums 和整数 k，返回出现频率前 k 高的元素，可以按任意顺序返回答案。
// 时间复杂度：O(n) / O(n) 平均 / O(n log k), 空间复杂度：O(n)

// 方法1：桶排序（推荐）
// 用频率作为桶下标，从高频到低频收集元素，直到收集 k 个
function topKFrequent1(nums: number[], k: number): number[] {
  const freq: Map<number, number> = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) ?? 0) + 1);
  }
  const n: number = nums.length;
  // buckets[f] 存储所有频率为 f 的元素
  const buckets: number[][] = new Array(n + 1).fill(null).map((): number[] => []);
  for (const [num, f] of freq) {
    buckets[f].push(num);
  }
  const result: number[] = [];
  for (let i: number = n; i >= 0 && result.length < k; i--) {
    for (const num of buckets[i]) {
      result.push(num);
      if (result.length === k) break;
    }
  }
  return result;
}

// 方法2：快速选择（分治）在频率数组上
// 利用快速选择将前 k 个高频元素划分到数组前 k 个位置
function topKFrequent2(nums: number[], k: number): number[] {
  const freq: Map<number, number> = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) ?? 0) + 1);
  }
  const unique: number[] = [...freq.keys()];
  if (k >= unique.length) return unique;

  let lo: number = 0;
  let hi: number = unique.length - 1;
  const target: number = k; // 前 k 个高频元素，目标位置为 k-1
  while (lo < hi) {
    const p: number = partitionFreq(unique, freq, lo, hi);
    if (p === target - 1) break;
    else if (p < target - 1) lo = p + 1;
    else hi = p - 1;
  }
  return unique.slice(0, k);
}

// 按频率降序划分：频率大的放左侧
function partitionFreq(
  unique: number[],
  freq: Map<number, number>,
  lo: number,
  hi: number,
): number {
  const pivot: number = freq.get(unique[hi]) as number;
  let i: number = lo;
  for (let j: number = lo; j < hi; j++) {
    if ((freq.get(unique[j]) as number) > pivot) {
      [unique[i], unique[j]] = [unique[j], unique[i]];
      i++;
    }
  }
  [unique[i], unique[hi]] = [unique[hi], unique[i]];
  return i;
}

// 方法3：最小堆，维护大小为 k 的堆
function topKFrequent3(nums: number[], k: number): number[] {
  const freq: Map<number, number> = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) ?? 0) + 1);
  }
  const heap: number[] = [];
  for (const num of freq.keys()) {
    freqPush(heap, num, freq);
    if (heap.length > k) {
      freqPop(heap, freq);
    }
  }
  return heap;
}

function freqPush(heap: number[], num: number, freq: Map<number, number>): void {
  heap.push(num);
  freqSiftUp(heap, heap.length - 1, freq);
}

function freqPop(heap: number[], freq: Map<number, number>): number {
  const top: number = heap[0];
  const last: number = heap.pop() as number;
  if (heap.length > 0) {
    heap[0] = last;
    freqSiftDown(heap, 0, freq);
  }
  return top;
}

function freqSiftUp(heap: number[], i: number, freq: Map<number, number>): void {
  while (i > 0) {
    const parent: number = (i - 1) >> 1;
    if ((freq.get(heap[parent]) as number) <= (freq.get(heap[i]) as number)) break;
    [heap[parent], heap[i]] = [heap[i], heap[parent]];
    i = parent;
  }
}

function freqSiftDown(heap: number[], i: number, freq: Map<number, number>): void {
  const n: number = heap.length;
  while (true) {
    const l: number = 2 * i + 1;
    const r: number = 2 * i + 2;
    let smallest: number = i;
    if (l < n && (freq.get(heap[l]) as number) < (freq.get(heap[smallest]) as number)) smallest = l;
    if (r < n && (freq.get(heap[r]) as number) < (freq.get(heap[smallest]) as number)) smallest = r;
    if (smallest === i) break;
    [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
    i = smallest;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 019. 前 K 个高频元素 =====");
console.log("方法1:", JSON.stringify(topKFrequent1([1, 1, 1, 2, 2, 3], 2).sort())); // 期望结果: [1,2]
console.log("方法2:", JSON.stringify(topKFrequent2([1, 1, 1, 2, 2, 3], 2).sort())); // 期望结果: [1,2]
console.log("方法3:", JSON.stringify(topKFrequent3([1, 1, 1, 2, 2, 3], 2).sort())); // 期望结果: [1,2]
console.log("方法1:", JSON.stringify(topKFrequent1([1], 1))); // 期望结果: [1]
console.log("方法2:", JSON.stringify(topKFrequent2([1, 2, 2, 3, 3, 3], 2).sort())); // 期望结果: [2,3]
console.log("方法3:", JSON.stringify(topKFrequent3([4, 1, -1, 2, -1, 2, 3], 2).sort())); // 期望结果: [-1,2]

export {};
