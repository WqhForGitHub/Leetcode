// ============================================================
// 排序面试题 - TypeScript 解题合集
// 包含：冒泡排序、归并排序、快速排序、堆排序、
//       前 k 大元素、第 k 大元素、最大数字、逆序数
// ============================================================

// ============================================================
// 1. 冒泡排序
// 核心思路：相邻元素两两比较，每轮将最大元素"冒泡"到末尾
// 时间复杂度：O(n^2)
// 空间复杂度：O(1)
// ============================================================

// 方法1：标准冒泡排序
function bubbleSort(arr: number[]): number[] {
  const n: number = arr.length;
  // 外层循环控制轮数，每轮确定一个最大值的位置
  for (let i: number = 0; i < n - 1; i++) {
    for (let j: number = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // 交换相邻元素
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// 方法2：冒泡排序 - 提前终止优化
function bubbleSortOptimized(arr: number[]): number[] {
  const n: number = arr.length;
  for (let i: number = 0; i < n - 1; i++) {
    let swapped: boolean = false;
    for (let j: number = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    // 如果某一轮没有发生交换，说明数组已经有序
    if (!swapped) break;
  }
  return arr;
}

// ============================================================
// 2. 归并排序
// 核心思路：分治法，将数组一分为二递归排序，然后合并两个有序子数组
// 时间复杂度：O(n log n)
// 空间复杂度：O(n)
// ============================================================

// 方法1：递归归并排序（推荐）
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid: number = Math.floor(arr.length / 2);
  const left: number[] = mergeSort(arr.slice(0, mid));
  const right: number[] = mergeSort(arr.slice(mid));

  return merge(left, right);
}

// 合并两个有序数组
function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i: number = 0;
  let j: number = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  // 将剩余元素追加到末尾
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}

// 方法2：原地归并排序（使用索引，减少 slice 拷贝）
function mergeSortInPlace(arr: number[]): number[] {
  const temp: number[] = new Array(arr.length);
  mergeSortHelper(arr, 0, arr.length - 1, temp);
  return arr;
}

function mergeSortHelper(
  arr: number[],
  left: number,
  right: number,
  temp: number[]
): void {
  if (left >= right) return;

  const mid: number = Math.floor((left + right) / 2);
  mergeSortHelper(arr, left, mid, temp);
  mergeSortHelper(arr, mid + 1, right, temp);
  mergeInPlace(arr, left, mid, right, temp);
}

function mergeInPlace(
  arr: number[],
  left: number,
  mid: number,
  right: number,
  temp: number[]
): void {
  // 将 arr[left..right] 复制到临时数组
  for (let k: number = left; k <= right; k++) {
    temp[k] = arr[k];
  }

  let i: number = left;
  let j: number = mid + 1;

  for (let k: number = left; k <= right; k++) {
    if (i > mid) {
      // 左半部分已用完
      arr[k] = temp[j++];
    } else if (j > right) {
      // 右半部分已用完
      arr[k] = temp[i++];
    } else if (temp[i] <= temp[j]) {
      arr[k] = temp[i++];
    } else {
      arr[k] = temp[j++];
    }
  }
}

// ============================================================
// 3. 快速排序
// 核心思路：分治法，选取基准元素 pivot，将小于 pivot 的放左边，
//          大于 pivot 的放右边，递归排序左右两部分
// 时间复杂度：平均 O(n log n)，最坏 O(n^2)
// 空间复杂度：O(log n)（递归栈）
// ============================================================

// 方法1：Lomuto 分区方案（推荐）
function quickSort(arr: number[]): number[] {
  quickSortHelper(arr, 0, arr.length - 1);
  return arr;
}

function quickSortHelper(arr: number[], low: number, high: number): void {
  if (low >= high) return;

  const pivotIndex: number = partition(arr, low, high);
  quickSortHelper(arr, low, pivotIndex - 1);
  quickSortHelper(arr, pivotIndex + 1, high);
}

// Lomuto 分区：选最后一个元素为 pivot
function partition(arr: number[], low: number, high: number): number {
  const pivot: number = arr[high];
  let i: number = low; // i 指向小于 pivot 的区域的末尾

  for (let j: number = low; j < high; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }

  // 将 pivot 放到正确位置
  [arr[i], arr[high]] = [arr[high], arr[i]];
  return i;
}

// 方法2：Hoare 分区方案（双指针，更高效）
function quickSortHoare(arr: number[]): number[] {
  quickSortHoareHelper(arr, 0, arr.length - 1);
  return arr;
}

function quickSortHoareHelper(arr: number[], low: number, high: number): void {
  if (low >= high) return;

  const pivotIndex: number = partitionHoare(arr, low, high);
  quickSortHoareHelper(arr, low, pivotIndex);
  quickSortHoareHelper(arr, pivotIndex + 1, high);
}

// Hoare 分区：双指针从两端向中间扫描
function partitionHoare(arr: number[], low: number, high: number): number {
  const pivot: number = arr[Math.floor((low + high) / 2)];
  let i: number = low - 1;
  let j: number = high + 1;

  while (true) {
    do { i++; } while (arr[i] < pivot);
    do { j--; } while (arr[j] > pivot);
    if (i >= j) return j;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// 方法3：随机化快速排序（避免最坏情况）
function quickSortRandom(arr: number[]): number[] {
  quickSortRandomHelper(arr, 0, arr.length - 1);
  return arr;
}

function quickSortRandomHelper(arr: number[], low: number, high: number): void {
  if (low >= high) return;

  // 随机选择 pivot 并与末尾元素交换
  const randIndex: number = Math.floor(Math.random() * (high - low + 1)) + low;
  [arr[randIndex], arr[high]] = [arr[high], arr[randIndex]];

  const pivotIndex: number = partition(arr, low, high);
  quickSortRandomHelper(arr, low, pivotIndex - 1);
  quickSortRandomHelper(arr, pivotIndex + 1, high);
}

// ============================================================
// 4. 堆排序
// 核心思路：先建最大堆，然后反复将堆顶（最大值）与末尾交换并下沉调整
// 时间复杂度：O(n log n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：标准堆排序（推荐）
function heapSort(arr: number[]): number[] {
  const n: number = arr.length;

  // 建堆：从最后一个非叶节点开始，自底向上执行下沉操作
  for (let i: number = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(arr, i, n);
  }

  // 逐个将堆顶最大值交换到末尾，缩小堆的范围
  for (let i: number = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    siftDown(arr, 0, i);
  }

  return arr;
}

// 下沉操作：将节点 i 在范围 [0, size) 内下沉到正确位置
function siftDown(arr: number[], i: number, size: number): void {
  while (true) {
    let largest: number = i;
    const left: number = 2 * i + 1;
    const right: number = 2 * i + 2;

    if (left < size && arr[left] > arr[largest]) largest = left;
    if (right < size && arr[right] > arr[largest]) largest = right;

    // 如果当前节点已经是最大的，下沉结束
    if (largest === i) break;

    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    i = largest;
  }
}

// 方法2：上浮操作版本（用于插入场景）
function siftUp(arr: number[], i: number): void {
  while (i > 0) {
    const parent: number = Math.floor((i - 1) / 2);
    if (arr[parent] >= arr[i]) break;
    [arr[i], arr[parent]] = [arr[parent], arr[i]];
    i = parent;
  }
}

// ============================================================
// 5. 找到前 k 大的元素
// LeetCode 215 变体 / 剑指 Offer 40
// 核心思路：不需要完全排序，利用堆或快排分区可高效求解
// 时间复杂度：堆方法 O(n log k)，快排方法 O(n)
// 空间复杂度：堆方法 O(k)，快排方法 O(1)
// ============================================================

// 方法1：小顶堆（推荐）
// 维护大小为 k 的小顶堆，堆顶是当前 k 个元素中的最小值
// 遍历数组时，比堆顶大的元素替换堆顶并调整堆
function topKLargest(nums: number[], k: number): number[] {
  // 建立大小为 k 的小顶堆
  const heap: number[] = nums.slice(0, k);
  buildMinHeap(heap);

  for (let i: number = k; i < nums.length; i++) {
    if (nums[i] > heap[0]) {
      // 替换堆顶并下沉调整
      heap[0] = nums[i];
      minSiftDown(heap, 0, k);
    }
  }

  return heap.sort((a, b) => b - a); // 降序输出
}

// 建小顶堆
function buildMinHeap(arr: number[]): void {
  const n: number = arr.length;
  for (let i: number = Math.floor(n / 2) - 1; i >= 0; i--) {
    minSiftDown(arr, i, n);
  }
}

// 小顶堆下沉
function minSiftDown(arr: number[], i: number, size: number): void {
  while (true) {
    let smallest: number = i;
    const left: number = 2 * i + 1;
    const right: number = 2 * i + 2;

    if (left < size && arr[left] < arr[smallest]) smallest = left;
    if (right < size && arr[right] < arr[smallest]) smallest = right;

    if (smallest === i) break;
    [arr[i], arr[smallest]] = [arr[smallest], arr[i]];
    i = smallest;
  }
}

// 方法2：基于快排分区
function topKLargestQuickSelect(nums: number[], k: number): number[] {
  const arr: number[] = [...nums];
  // 找第 (n-k) 小的元素（即第 k 大），分区后右侧都是比它大的
  const target: number = nums.length - k;
  quickSelect(arr, 0, arr.length - 1, target);
  return arr.slice(target).sort((a, b) => b - a);
}

function quickSelect(
  arr: number[],
  low: number,
  high: number,
  target: number
): void {
  if (low >= high) return;

  const pivotIndex: number = partition(arr, low, high);

  if (pivotIndex === target) {
    return; // 找到了
  } else if (pivotIndex < target) {
    quickSelect(arr, pivotIndex + 1, high, target);
  } else {
    quickSelect(arr, low, pivotIndex - 1, target);
  }
}

// ============================================================
// 6. 找到第 k 大的元素
// LeetCode 215. Kth Largest Element in an Array
// 核心思路：与"前 k 大"类似，但只需返回一个元素
// 时间复杂度：堆方法 O(n log k)，快排方法 O(n)
// 空间复杂度：堆方法 O(k)，快排方法 O(1)
// ============================================================

// 方法1：小顶堆（推荐）
// 维护大小为 k 的小顶堆，遍历结束后堆顶即为第 k 大元素
function findKthLargest(nums: number[], k: number): number {
  const heap: number[] = nums.slice(0, k);
  buildMinHeap(heap);

  for (let i: number = k; i < nums.length; i++) {
    if (nums[i] > heap[0]) {
      heap[0] = nums[i];
      minSiftDown(heap, 0, k);
    }
  }

  return heap[0]; // 堆顶就是第 k 大元素
}

// 方法2：快排分区（QuickSelect）
// 找排名第 (n-k) 的元素（升序中下标为 n-k）
function findKthLargestQuickSelect(nums: number[], k: number): number {
  const arr: number[] = [...nums];
  const target: number = arr.length - k;
  return quickSelectKth(arr, 0, arr.length - 1, target);
}

function quickSelectKth(
  arr: number[],
  low: number,
  high: number,
  target: number
): number {
  if (low === high) return arr[low];

  const pivotIndex: number = partition(arr, low, high);

  if (pivotIndex === target) {
    return arr[pivotIndex];
  } else if (pivotIndex < target) {
    return quickSelectKth(arr, pivotIndex + 1, high, target);
  } else {
    return quickSelectKth(arr, low, pivotIndex - 1, target);
  }
}

// 方法3：大顶堆方式
// 建大顶堆后弹出 k-1 个元素，堆顶就是第 k 大
function findKthLargestMaxHeap(nums: number[], k: number): number {
  const arr: number[] = [...nums];
  const n: number = arr.length;

  // 建大顶堆
  for (let i: number = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(arr, i, n);
  }

  // 弹出前 k-1 个最大值
  for (let i: number = n - 1; i > n - k; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    siftDown(arr, 0, i);
  }

  return arr[0];
}

// ============================================================
// 7. 字符串组成最大的数字
// LeetCode 179. Largest Number
// 核心思路：自定义排序规则 - 比较 a+b 和 b+a 的字典序，
//          使拼接后较大的排列在前面
// 时间复杂度：O(n log n * k)，k 为字符串平均长度
// 空间复杂度：O(n)
// ============================================================

// 方法1：自定义比较器排序（推荐）
function largestNumber(nums: number[]): string {
  // 将数字转为字符串
  const strs: string[] = nums.map(String);

  // 自定义排序：如果 a+b > b+a，则 a 排在前面
  strs.sort((a: string, b: string) => {
    const ab: string = a + b;
    const ba: string = b + a;
    // 降序排列，使拼接结果最大
    if (ba > ab) return 1;
    if (ba < ab) return -1;
    return 0;
  });

  // 去除前导零（如输入全为 0 的情况）
  const result: string = strs.join("");
  return result[0] === "0" ? "0" : result;
}

// 方法2：手动实现排序（冒泡排序版，便于理解比较规则）
function largestNumberBubble(nums: number[]): string {
  const strs: string[] = nums.map(String);
  const n: number = strs.length;

  for (let i: number = 0; i < n - 1; i++) {
    for (let j: number = 0; j < n - 1 - i; j++) {
      // 如果 strs[j]+strs[j+1] < strs[j+1]+strs[j]，则交换
      if (strs[j] + strs[j + 1] < strs[j + 1] + strs[j]) {
        [strs[j], strs[j + 1]] = [strs[j + 1], strs[j]];
      }
    }
  }

  const result: string = strs.join("");
  return result[0] === "0" ? "0" : result;
}

// ============================================================
// 8. 逆序数数量
// 剑指 Offer 51 / LeetCode 315 变体
// 核心思路：在归并排序的合并阶段统计逆序对，
//          当右侧元素先被选中时，左侧剩余元素都与之构成逆序对
// 时间复杂度：O(n log n)
// 空间复杂度：O(n)
// ============================================================

// 方法1：归并排序统计逆序对（推荐）
function countInversions(nums: number[]): number {
  const arr: number[] = [...nums];
  const temp: number[] = new Array(arr.length);
  return mergeSortCount(arr, 0, arr.length - 1, temp);
}

function mergeSortCount(
  arr: number[],
  left: number,
  right: number,
  temp: number[]
): number {
  if (left >= right) return 0;

  const mid: number = Math.floor((left + right) / 2);
  let count: number = 0;

  // 递归统计左半部分和右半部分的逆序对
  count += mergeSortCount(arr, left, mid, temp);
  count += mergeSortCount(arr, mid + 1, right, temp);

  // 统计跨越左右两部分的逆序对
  count += mergeCount(arr, left, mid, right, temp);

  return count;
}

function mergeCount(
  arr: number[],
  left: number,
  mid: number,
  right: number,
  temp: number[]
): number {
  for (let k: number = left; k <= right; k++) {
    temp[k] = arr[k];
  }

  let i: number = left;
  let j: number = mid + 1;
  let count: number = 0;

  for (let k: number = left; k <= right; k++) {
    if (i > mid) {
      // 左半部分已用完
      arr[k] = temp[j++];
    } else if (j > right) {
      // 右半部分已用完
      arr[k] = temp[i++];
    } else if (temp[i] <= temp[j]) {
      // 左侧元素更小或相等，不构成逆序对
      arr[k] = temp[i++];
    } else {
      // 右侧元素更小，左侧剩余元素都与它构成逆序对
      arr[k] = temp[j++];
      count += mid - i + 1;
    }
  }

  return count;
}

// 方法2：暴力枚举（仅用于验证）
// 时间复杂度：O(n^2)
function countInversionsBruteForce(nums: number[]): number {
  let count: number = 0;
  const n: number = nums.length;
  for (let i: number = 0; i < n - 1; i++) {
    for (let j: number = i + 1; j < n; j++) {
      if (nums[i] > nums[j]) {
        count++;
      }
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================

// 测试 1：冒泡排序
console.log("=== 冒泡排序 ===");
const bubbleArr1: number[] = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort([...bubbleArr1])); // [11, 12, 22, 25, 34, 64, 90]
console.log(bubbleSortOptimized([...bubbleArr1])); // [11, 12, 22, 25, 34, 64, 90]

// 测试 2：归并排序
console.log("=== 归并排序 ===");
const mergeArr: number[] = [38, 27, 43, 3, 9, 82, 10];
console.log(mergeSort([...mergeArr])); // [3, 9, 10, 27, 38, 43, 82]
console.log(mergeSortInPlace([...mergeArr])); // [3, 9, 10, 27, 38, 43, 82]

// 测试 3：快速排序
console.log("=== 快速排序 ===");
const quickArr: number[] = [10, 7, 8, 9, 1, 5];
console.log(quickSort([...quickArr])); // [1, 5, 7, 8, 9, 10]
console.log(quickSortHoare([...quickArr])); // [1, 5, 7, 8, 9, 10]
console.log(quickSortRandom([...quickArr])); // [1, 5, 7, 8, 9, 10]

// 测试 4：堆排序
console.log("=== 堆排序 ===");
const heapArr: number[] = [12, 11, 13, 5, 6, 7];
console.log(heapSort([...heapArr])); // [5, 6, 7, 11, 12, 13]

// 测试 5：前 k 大的元素
console.log("=== 前 k 大的元素 ===");
const topKArr: number[] = [3, 2, 1, 5, 6, 4];
console.log(topKLargest([...topKArr], 2)); // [6, 5]
console.log(topKLargestQuickSelect([...topKArr], 2)); // [6, 5]

// 测试 6：第 k 大的元素
console.log("=== 第 k 大的元素 ===");
const kthArr: number[] = [3, 2, 1, 5, 6, 4];
console.log(findKthLargest([...kthArr], 2)); // 5
console.log(findKthLargestQuickSelect([...kthArr], 2)); // 5
console.log(findKthLargestMaxHeap([...kthArr], 2)); // 5
const kthArr2: number[] = [3, 2, 3, 1, 2, 4, 5, 5, 6];
console.log(findKthLargest([...kthArr2], 4)); // 4

// 测试 7：字符串组成最大的数字
console.log("=== 字符串组成最大的数字 ===");
console.log(largestNumber([10, 2])); // "210"
console.log(largestNumber([3, 30, 34, 5, 9])); // "9534330"
console.log(largestNumber([0, 0])); // "0"
console.log(largestNumberBubble([10, 2])); // "210"
console.log(largestNumberBubble([3, 30, 34, 5, 9])); // "9534330"

// 测试 8：逆序数数量
console.log("=== 逆序数数量 ===");
const invArr1: number[] = [7, 5, 6, 4];
console.log(countInversions(invArr1)); // 5
console.log(countInversionsBruteForce(invArr1)); // 5
const invArr2: number[] = [1, 3, 2, 3, 1];
console.log(countInversions(invArr2)); // 4 (3>2, 3>1, 2>1, 3>1)
console.log(countInversionsBruteForce(invArr2)); // 4
const invArr3: number[] = [5, 4, 3, 2, 1];
console.log(countInversions(invArr3)); // 10
console.log(countInversionsBruteForce(invArr3)); // 10

export {};
