// ============================================================
// 012. 数组中的第K个最大元素
// ============================================================
// LeetCode 215. Kth Largest Element in an Array
// 在未排序的数组中找到第 k 个最大的元素。
// 注意：你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
// 时间复杂度：O(n) 平均 / O(n log k) / O(n log n), 空间复杂度：O(log n) / O(k) / O(n)

// 方法1：快速选择（分治）（推荐）
// 类似快速排序的 partition，每次只需递归一侧，平均时间复杂度 O(n)
function findKthLargest1(nums: number[], k: number): number {
  const target: number = nums.length - k; // 第 k 大即升序后索引 n-k
  let left: number = 0;
  let right: number = nums.length - 1;
  while (left < right) {
    const p: number = partition(nums, left, right);
    if (p === target) {
      return nums[p];
    } else if (p < target) {
      left = p + 1;
    } else {
      right = p - 1;
    }
  }
  return nums[left];
}

// 分治划分子过程：随机选择 pivot，将 <= pivot 的元素放左侧
function partition(nums: number[], left: number, right: number): number {
  // 随机选择 pivot 避免最坏情况
  const rand: number = left + Math.floor(Math.random() * (right - left + 1));
  [nums[rand], nums[right]] = [nums[right], nums[rand]];
  const pivot: number = nums[right];
  let i: number = left;
  for (let j: number = left; j < right; j++) {
    if (nums[j] <= pivot) {
      [nums[i], nums[j]] = [nums[j], nums[i]];
      i++;
    }
  }
  [nums[i], nums[right]] = [nums[right], nums[i]];
  return i;
}

// 方法2：最小堆，维护大小为 k 的堆
// 遍历数组，堆中保留当前最大的 k 个元素，堆顶即第 k 大
function findKthLargest2(nums: number[], k: number): number {
  const heap: number[] = [];
  for (const num of nums) {
    heapPush(heap, num);
    if (heap.length > k) {
      heapPop(heap);
    }
  }
  return heap[0];
}

function heapPush(heap: number[], val: number): void {
  heap.push(val);
  siftUp(heap, heap.length - 1);
}

function heapPop(heap: number[]): number {
  const top: number = heap[0];
  const last: number = heap.pop() as number;
  if (heap.length > 0) {
    heap[0] = last;
    siftDown(heap, 0);
  }
  return top;
}

function siftUp(heap: number[], i: number): void {
  while (i > 0) {
    const parent: number = (i - 1) >> 1;
    if (heap[parent] <= heap[i]) break;
    [heap[parent], heap[i]] = [heap[i], heap[parent]];
    i = parent;
  }
}

function siftDown(heap: number[], i: number): void {
  const n: number = heap.length;
  while (true) {
    const l: number = 2 * i + 1;
    const r: number = 2 * i + 2;
    let smallest: number = i;
    if (l < n && heap[l] < heap[smallest]) smallest = l;
    if (r < n && heap[r] < heap[smallest]) smallest = r;
    if (smallest === i) break;
    [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
    i = smallest;
  }
}

// 方法3：排序后取第 k 大
function findKthLargest3(nums: number[], k: number): number {
  const sorted: number[] = [...nums].sort((a: number, b: number) => a - b);
  return sorted[sorted.length - k];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 012. 数组中的第K个最大元素 =====");
console.log("方法1:", findKthLargest1([3, 2, 1, 5, 6, 4], 2)); // 期望结果: 5
console.log("方法2:", findKthLargest2([3, 2, 1, 5, 6, 4], 2)); // 期望结果: 5
console.log("方法3:", findKthLargest3([3, 2, 1, 5, 6, 4], 2)); // 期望结果: 5
console.log("方法1:", findKthLargest1([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 期望结果: 4
console.log("方法2:", findKthLargest2([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 期望结果: 4
console.log("方法3:", findKthLargest3([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 期望结果: 4
console.log("方法1:", findKthLargest1([1], 1)); // 期望结果: 1

export {};
