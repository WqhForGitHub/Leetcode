// ============================================================
// 014. 数组中的第K个最大元素
// ============================================================
// LeetCode 215. Kth Largest Element in an Array
// 在未排序的数组中找到第 k 个最大的元素（注意是排序后第 k 个，下标 k-1）。

// 方法1：快速选择（Quickselect，平均 O(n) 时间，O(1) 空间）
function findKthLargest(nums: number[], k: number): number {
  const targetIndex = nums.length - k; // 升序排序后第 k 大的下标
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const pivotIndex = partition(nums, left, right);
    if (pivotIndex === targetIndex) return nums[pivotIndex];
    if (pivotIndex < targetIndex) {
      left = pivotIndex + 1;
    } else {
      right = pivotIndex - 1;
    }
  }
  return -1;
}

function partition(nums: number[], left: number, right: number): number {
  // 三数取中减少最坏情况概率
  const mid = Math.floor((left + right) / 2);
  if (nums[left] > nums[mid]) swap(nums, left, mid);
  if (nums[left] > nums[right]) swap(nums, left, right);
  if (nums[mid] > nums[right]) swap(nums, mid, right);
  const pivot = nums[mid];
  swap(nums, mid, right); // pivot 暂存到 right
  let storeIndex = left;
  for (let i = left; i < right; i++) {
    if (nums[i] < pivot) {
      swap(nums, i, storeIndex);
      storeIndex++;
    }
  }
  swap(nums, storeIndex, right);
  return storeIndex;
}

function swap(nums: number[], i: number, j: number): void {
  const tmp = nums[i];
  nums[i] = nums[j];
  nums[j] = tmp;
}

// 方法2：最小堆，维护大小为 k 的堆（O(n log k) 时间，O(k) 空间）
function findKthLargestHeap(nums: number[], k: number): number {
  // 手写最小堆
  const heap: number[] = [];
  for (const v of nums) {
    push(heap, v);
    if (heap.length > k) pop(heap);
  }
  return peek(heap);

  function push(h: number[], val: number): void {
    h.push(val);
    siftUp(h, h.length - 1);
  }

  function pop(h: number[]): number {
    const top = h[0];
    const last = h.pop()!;
    if (h.length > 0) {
      h[0] = last;
      siftDown(h, 0);
    }
    return top;
  }

  function peek(h: number[]): number {
    return h[0];
  }

  function siftUp(h: number[], i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (h[parent] <= h[i]) break;
      swap(h, parent, i);
      i = parent;
    }
  }

  function siftDown(h: number[], i: number): void {
    const n = h.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let smallest = i;
      if (l < n && h[l] < h[smallest]) smallest = l;
      if (r < n && h[r] < h[smallest]) smallest = r;
      if (smallest === i) break;
      swap(h, i, smallest);
      i = smallest;
    }
  }
}

// 方法3：排序后取倒数第 k 个（O(n log n) 时间）
function findKthLargestSort(nums: number[], k: number): number {
  const sorted = [...nums].sort((a, b) => a - b);
  return sorted[sorted.length - k];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 014. 数组中的第K个最大元素 =====");
console.log("快选 [3,2,1,5,6,4],k=2:", findKthLargest([3, 2, 1, 5, 6, 4], 2)); // 5
console.log("快选 [3,2,3,1,2,4,5,5,6],k=4:", findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 4
console.log("堆 [3,2,1,5,6,4],k=2:", findKthLargestHeap([3, 2, 1, 5, 6, 4], 2)); // 5
console.log("排序 [3,2,3,1,2,4,5,5,6],k=4:", findKthLargestSort([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 4

export {};
