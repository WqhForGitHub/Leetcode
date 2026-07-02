// ============================================================
// 028. 排序数组
// ============================================================
// LeetCode 912. Sort an Array
// 给定整数数组 nums，将其升序排列。要求时间复杂度 O(n log n)。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：归并排序（推荐，O(n log n) 时间，O(n) 空间，稳定排序）
// 自顶向下递归划分，再合并两个有序段。
function sortArray(nums: number[]): number[] {
  const temp = new Array<number>(nums.length);
  mergeSort(nums, 0, nums.length - 1, temp);
  return nums;
}

function mergeSort(nums: number[], left: number, right: number, temp: number[]): void {
  if (left >= right) return;
  const mid = (left + right) >> 1;
  mergeSort(nums, left, mid, temp);
  mergeSort(nums, mid + 1, right, temp);
  merge(nums, left, mid, right, temp);
}

function merge(nums: number[], left: number, mid: number, right: number, temp: number[]): void {
  for (let i = left; i <= right; i++) temp[i] = nums[i];
  let i = left;
  let j = mid + 1;
  let k = left;
  while (i <= mid && j <= right) {
    if (temp[i] <= temp[j]) {
      nums[k++] = temp[i++];
    } else {
      nums[k++] = temp[j++];
    }
  }
  while (i <= mid) nums[k++] = temp[i++];
  while (j <= right) nums[k++] = temp[j++];
}

// 方法2：快速排序（O(n log n) 平均，O(log n) 空间，最坏 O(n^2)）
// 随机选取 pivot 避免有序数组退化为最坏情况。
function sortArrayQuick(nums: number[]): number[] {
  quickSort(nums, 0, nums.length - 1);
  return nums;
}

function quickSort(nums: number[], left: number, right: number): void {
  if (left >= right) return;
  const pivot = partition(nums, left, right);
  quickSort(nums, left, pivot - 1);
  quickSort(nums, pivot + 1, right);
}

function partition(nums: number[], left: number, right: number): number {
  // 随机化 pivot 并交换到末尾
  const rand = left + Math.floor(Math.random() * (right - left + 1));
  [nums[rand], nums[right]] = [nums[right], nums[rand]];
  const pivot = nums[right];
  let i = left;
  for (let j = left; j < right; j++) {
    if (nums[j] < pivot) {
      [nums[i], nums[j]] = [nums[j], nums[i]];
      i++;
    }
  }
  [nums[i], nums[right]] = [nums[right], nums[i]];
  return i;
}

// 方法3：堆排序（O(n log n) 时间，O(1) 空间，不稳定）
// 先建大顶堆，再不断把堆顶最大值交换到末尾并下沉调整。
function sortArrayHeap(nums: number[]): number[] {
  const n = nums.length;
  // 从最后一个非叶子节点开始建堆
  for (let i = (n >> 1) - 1; i >= 0; i--) {
    heapify(nums, n, i);
  }
  // 逐个把最大值放到末尾
  for (let i = n - 1; i > 0; i--) {
    [nums[0], nums[i]] = [nums[i], nums[0]];
    heapify(nums, i, 0);
  }
  return nums;
}

function heapify(nums: number[], n: number, i: number): void {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;
  if (l < n && nums[l] > nums[largest]) largest = l;
  if (r < n && nums[r] > nums[largest]) largest = r;
  if (largest !== i) {
    [nums[i], nums[largest]] = [nums[largest], nums[i]];
    heapify(nums, n, largest);
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 028. 排序数组 =====");
console.log("归并:", JSON.stringify(sortArray([5, 2, 3, 1]))); // 期望 [1,2,3,5]
console.log("归并:", JSON.stringify(sortArray([5, 1, 1, 2, 0, 0]))); // 期望 [0,0,1,1,2,5]
console.log("快排:", JSON.stringify(sortArrayQuick([5, 2, 3, 1]))); // 期望 [1,2,3,5]
console.log("快排:", JSON.stringify(sortArrayQuick([5, 1, 1, 2, 0, 0]))); // 期望 [0,0,1,1,2,5]
console.log("堆排:", JSON.stringify(sortArrayHeap([5, 2, 3, 1]))); // 期望 [1,2,3,5]
console.log("堆排:", JSON.stringify(sortArrayHeap([5, 1, 1, 2, 0, 0]))); // 期望 [0,0,1,1,2,5]

export {};
