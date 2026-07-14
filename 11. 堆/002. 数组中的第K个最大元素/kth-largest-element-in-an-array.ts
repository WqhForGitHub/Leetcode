// ============================================================
// 002. 数组中的第K个最大元素
// ============================================================
// LeetCode 215. Kth Largest Element in an Array
// 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。
// 时间复杂度：O(N) 平均，空间复杂度：O(k)

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

// 方法1：最小堆，维护大小为 k 的堆（推荐）
function findKthLargest(nums: number[], k: number): number {
  const heap = new MinHeap();
  for (const num of nums) {
    heap.push(num);
    if (heap.size > k) heap.pop();
  }
  return heap.peek()!;
}

// 方法2：快速选择
function findKthLargestQuickSelect(nums: number[], k: number): number {
  const target = nums.length - k;
  const partition = (lo: number, hi: number): number => {
    const pivot = nums[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (nums[j] <= pivot) {
        [nums[i], nums[j]] = [nums[j], nums[i]];
        i++;
      }
    }
    [nums[i], nums[hi]] = [nums[hi], nums[i]];
    return i;
  };
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const p = partition(lo, hi);
    if (p === target) return nums[p];
    if (p < target) lo = p + 1;
    else hi = p - 1;
  }
  return nums[lo];
}

// 方法3：排序
function findKthLargestSort(nums: number[], k: number): number {
  return nums.sort((a, b) => b - a)[k - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 002. 数组中的第K个最大元素 =====");
console.log("最小堆:", findKthLargest([3, 2, 1, 5, 6, 4], 2)); // 期望 5
console.log("快速选择:", findKthLargestQuickSelect([3, 2, 1, 5, 6, 4], 2)); // 期望 5
console.log("排序:", findKthLargestSort([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 期望 4

export {};
