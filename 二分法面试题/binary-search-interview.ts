// ============================================================
// 二分法面试题 - TypeScript 解题合集
// 主题：查找元素 / 搜索插入位置 / 查找缺失的元素 /
//       查找元素的第一个和最后一个位置 / 寻找峰值 /
//       查找平方根 / 查找旋转排序数组的最小值 /
//       查找旋转排序数组的缺失元素
// ============================================================

// ============================================================
// 1. 查找元素
// ============================================================
// LeetCode 704. Binary Search
// 给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target，
// 写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1
// 时间复杂度：O(log n)，空间复杂度：O(1)

// 方法1：标准二分查找 — 左闭右闭区间（推荐）
function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2); // 防溢出
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

// 方法2：左闭右开区间
function searchOpenRight(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length; // 右开

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid; // 右开，不减1
    }
  }
  return -1;
}

// 方法3：递归写法
function searchRecursive(nums: number[], target: number): number {
  const binarySearch = (left: number, right: number): number => {
    if (left > right) return -1;
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) return binarySearch(mid + 1, right);
    return binarySearch(left, mid - 1);
  };
  return binarySearch(0, nums.length - 1);
}

// ============================================================
// 2. 搜索插入位置
// ============================================================
// LeetCode 35. Search Insert Position
// 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引
// 如果目标值不存在于数组中，返回它将会被按顺序插入的位置
// 时间复杂度：O(log n)，空间复杂度：O(1)

// 方法1：二分查找 — 找左边界（推荐）
function searchInsert(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  // 循环结束时 left 就是插入位置
  return left;
}

// 方法2：左闭右开写法
function searchInsertOpenRight(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}

// 方法3：使用 lower_bound 思想
function searchInsertLowerBound(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    // 找到第一个 >= target 的位置
    if (nums[mid] >= target) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

// ============================================================
// 3. 查找缺失的元素
// ============================================================
// LeetCode 268. Missing Number
// 给定一个包含 [0, n] 中 n 个数的数组 nums，找出那个缺失的数字
// 时间复杂度：O(log n) 或 O(n)，空间复杂度：O(1)

// 方法1：异或运算（推荐 — 最优雅）
// 原理：a ^ a = 0，将所有下标和值异或，成对的会消掉，剩下的就是缺失的数
function missingNumber(nums: number[]): number {
  let result = nums.length; // 初始为 n，因为下标只到 n-1
  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i];
  }
  return result;
}

// 方法2：数学求和公式
// 原理：0 到 n 的和为 n*(n+1)/2，减去数组元素之和即为缺失的数
function missingNumberMath(nums: number[]): number {
  const n = nums.length;
  const expectedSum = n * (n + 1) / 2;
  const actualSum = nums.reduce((sum, num) => sum + num, 0);
  return expectedSum - actualSum;
}

// 方法3：二分查找（适用于有序数组）
// 原理：如果数组有序，缺失元素之前的所有 nums[i] == i，之后的 nums[i] > i
function missingNumberBinarySearch(nums: number[]): number {
  nums.sort((a, b) => a - b); // 如果数组无序则先排序
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === mid) {
      // 缺失元素在右边
      left = mid + 1;
    } else {
      // 缺失元素在左边或就是 mid
      right = mid - 1;
    }
  }
  // left 就是缺失的数字
  return left;
}

// ============================================================
// 4. 查找元素的第一个和最后一个位置
// ============================================================
// LeetCode 34. Find First and Last Position of Element in Sorted Array
// 给定一个按照升序排列的整数数组 nums，和一个目标值 target
// 找出给定目标值在数组中的开始位置和结束位置
// 如果数组中不存在目标值，返回 [-1, -1]
// 时间复杂度：O(log n)，空间复杂度：O(1)

// 方法1：两次二分查找 — 分别找左右边界（推荐）
function searchRange(nums: number[], target: number): number[] {
  // 找左边界（第一个等于 target 的位置）
  const findLeft = (): number => {
    let left = 0;
    let right = nums.length - 1;
    let index = -1;

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      if (nums[mid] === target) {
        index = mid;
        right = mid - 1; // 继续向左找
      } else if (nums[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return index;
  };

  // 找右边界（最后一个等于 target 的位置）
  const findRight = (): number => {
    let left = 0;
    let right = nums.length - 1;
    let index = -1;

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      if (nums[mid] === target) {
        index = mid;
        left = mid + 1; // 继续向右找
      } else if (nums[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return index;
  };

  return [findLeft(), findRight()];
}

// 方法2：lower_bound / upper_bound
function searchRangeBound(nums: number[], target: number): number[] {
  // lower_bound: 第一个 >= target 的位置
  const lowerBound = (): number => {
    let left = 0;
    let right = nums.length;
    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);
      if (nums[mid] >= target) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    return left;
  };

  // upper_bound: 第一个 > target 的位置
  const upperBound = (): number => {
    let left = 0;
    let right = nums.length;
    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);
      if (nums[mid] > target) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    return left;
  };

  const leftIdx = lowerBound();
  const rightIdx = upperBound() - 1;

  // 验证 target 是否存在
  if (leftIdx <= rightIdx && leftIdx < nums.length && nums[leftIdx] === target) {
    return [leftIdx, rightIdx];
  }
  return [-1, -1];
}

// 方法3：先找到任意一个 target，再向两边扩展
function searchRangeExpand(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;
  let found = -1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) {
      found = mid;
      break;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  if (found === -1) return [-1, -1];

  // 从找到的位置向两边扩展
  let start = found;
  let end = found;
  while (start > 0 && nums[start - 1] === target) start--;
  while (end < nums.length - 1 && nums[end + 1] === target) end++;

  return [start, end];
}

// ============================================================
// 5. 寻找峰值
// ============================================================
// LeetCode 162. Find Peak Element
// 峰值元素是指其值严格大于左右相邻值的元素
// 给定一个整数数组 nums，找到峰值元素并返回其索引
// 数组可能包含多个峰值，返回任何一个峰值的位置即可
// 假设 nums[-1] = nums[n] = -∞
// 时间复杂度：O(log n)，空间复杂度：O(1)

// 方法1：二分查找 — 爬坡法（推荐）
// 原理：如果 mid 处于上坡（nums[mid] < nums[mid+1]），峰值在右边
//       如果 mid 处于下坡（nums[mid] > nums[mid+1]），峰值在左边（含 mid）
function findPeakElement(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] < nums[mid + 1]) {
      // 上坡，峰值在右边
      left = mid + 1;
    } else {
      // 下坡，峰值在左边（含 mid）
      right = mid;
    }
  }
  return left;
}

// 方法2：二分查找 — 与左侧比较
function findPeakElementLeft(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2) + 1; // 偏右取中
    if (nums[mid] > nums[mid - 1]) {
      // 上坡，峰值在右边（含 mid）
      left = mid;
    } else {
      // 下坡，峰值在左边
      right = mid - 1;
    }
  }
  return left;
}

// 方法3：线性扫描
function findPeakElementLinear(nums: number[]): number {
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] > nums[i + 1]) {
      return i; // 找到第一个下降点就是峰值
    }
  }
  return nums.length - 1; // 一直递增，最后一个元素是峰值
}

// ============================================================
// 6. 查找平方根
// ============================================================
// LeetCode 69. Sqrt(x)
// 给你一个非负整数 x，计算并返回 x 的算术平方根的整数部分
// 时间复杂度：O(log x)，空间复杂度：O(1)

// 方法1：二分查找（推荐）
function mySqrt(x: number): number {
  if (x === 0) return 0;
  let left = 1;
  let right = x;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const square = mid * mid;
    if (square === x) {
      return mid;
    } else if (square < x) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  // 循环结束时 right < left，right 就是平方根的整数部分
  return right;
}

// 方法2：二分查找 — 左闭右开
function mySqrtOpenRight(x: number): number {
  if (x === 0) return 0;
  let left = 1;
  let right = x + 1; // 右开

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (mid * mid <= x) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  // left - 1 是最大的满足 mid*mid <= x 的值
  return left - 1;
}

// 方法3：牛顿迭代法
// 原理：求 f(r) = r^2 - x = 0 的根，迭代公式 r = (r + x/r) / 2
function mySqrtNewton(x: number): number {
  if (x === 0) return 0;
  let r = x;
  while (r * r > x) {
    r = Math.floor((r + Math.floor(x / r)) / 2);
  }
  return r;
}

// ============================================================
// 7. 查找旋转排序数组的最小值
// ============================================================
// LeetCode 153. Find Minimum in Rotated Sorted Array
// 已知一个长度为 n 的数组，预先按照升序排列，经由 1 到 n 次旋转后，得到输入数组
// 找出数组中最小的元素
// 时间复杂度：O(log n)，空间复杂度：O(1)

// 方法1：二分查找 — 与右端点比较（推荐）
// 原理：如果 nums[mid] > nums[right]，最小值在右半部分
//       如果 nums[mid] <= nums[right]，最小值在左半部分（含 mid）
function findMin(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] > nums[right]) {
      // mid 在旋转点左侧，最小值在右边
      left = mid + 1;
    } else {
      // mid 在旋转点右侧或就是旋转点，最小值在左边（含 mid）
      right = mid;
    }
  }
  return nums[left];
}

// 方法2：二分查找 — 与左端点比较
function findMinCompareLeft(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;

  // 如果没有旋转
  if (nums[left] < nums[right]) return nums[left];

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] >= nums[0]) {
      // mid 在旋转点左侧
      left = mid + 1;
    } else {
      // mid 在旋转点右侧
      right = mid;
    }
  }
  return nums[left];
}

// 方法3：处理含重复元素的情况（LeetCode 154）
function findMinWithDuplicates(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else if (nums[mid] < nums[right]) {
      right = mid;
    } else {
      // nums[mid] === nums[right]，无法判断，收缩右边界
      right--;
    }
  }
  return nums[left];
}

// ============================================================
// 8. 查找旋转排序数组的缺失元素
// ============================================================
// 类似 LeetCode 153/154 的变体
// 旋转排序数组 [0, 1, 2, ..., n] 中缺失了一个元素，找出该元素
// 原理：在旋转排序数组中，旋转点之前的元素 >= nums[0]，之后的元素 < nums[0]
//       缺失元素之前的所有 nums[i] == (nums[0] + i) % (n+1)
//       缺失元素之后 nums[i] != (nums[0] + i) % (n+1)
// 时间复杂度：O(log n)，空间复杂度：O(1)

// 方法1：二分查找 — 先找旋转点，再利用有序性（推荐）
function findMissingInRotated(nums: number[]): number {
  const n = nums.length;

  // 如果数组只有一个元素或为空
  if (n === 0) return 0;
  if (n === 1) return nums[0] === 0 ? 1 : 0;

  // 先找旋转点（最小值的下标）
  let left = 0;
  let right = n - 1;

  // 如果数组没有旋转
  if (nums[left] < nums[right]) {
    // 在有序数组中找缺失元素
    return findMissingInSorted(nums);
  }

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  const pivot = left; // 旋转点

  // 在旋转点左侧（较大值部分）和右侧（较小值部分）分别二分查找缺失元素
  // 左侧应为 [nums[0], ..., nums[0] + pivot - 1]
  // 右侧应为 [nums[pivot], ..., nums[0] + n - 1]（但可能缺失一个）

  // 如果缺失元素在右侧
  const expectedStart = nums[pivot]; // 右侧的起始值
  left = pivot;
  right = n - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const expected = expectedStart + (mid - pivot);
    if (nums[mid] === expected) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  if (left < n && nums[left] !== expectedStart + (left - pivot)) {
    return expectedStart + (left - pivot);
  }

  // 如果缺失元素在左侧
  left = 0;
  right = pivot - 1;
  const leftStart = nums[0];
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const expected = leftStart + mid;
    if (nums[mid] === expected) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return leftStart + left;
}

// 辅助函数：在有序数组中找缺失元素
function findMissingInSorted(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === nums[0] + mid) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return nums[0] + left;
}

// 方法2：利用索引与值的映射关系
// 对于 [0..n] 旋转排序且缺失一个元素的情况
function findMissingInRotatedByIndex(nums: number[]): number {
  const n = nums.length;
  if (n === 0) return 0;

  // 找旋转点
  let left = 0;
  let right = n - 1;
  if (nums[left] < nums[right]) {
    // 未旋转，直接在有序数组中找
    return findMissingInSorted(nums);
  }

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  const pivot = left;

  // 确定原始数组的起始值
  // 旋转后，nums[pivot] 是原数组的第一个元素（或其附近）
  // 原数组应为 [start, start+1, ..., start+n]，缺失一个
  // nums[pivot] 应该是 start（如果不是缺失的那个）

  // 在左半部分二分
  left = 0;
  right = pivot - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    // 左半部分的值 = nums[0] + mid
    if (nums[mid] === nums[0] + mid) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  if (left < pivot && nums[left] !== nums[0] + left) {
    return nums[0] + left;
  }

  // 在右半部分二分
  left = pivot;
  right = n - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    // 右半部分的值 = nums[pivot] + (mid - pivot)
    if (nums[mid] === nums[pivot] + (mid - pivot)) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return nums[pivot] + (left - pivot);
}

// 方法3：求和法（简单但非二分）
// 原理：原数组的和 - 实际数组的和 = 缺失的元素
function findMissingBySum(nums: number[]): number {
  const n = nums.length;
  // 找出最小值，确定原数组的起始值
  const minVal = Math.min(...nums);
  const expectedSum = (minVal + minVal + n) * (n + 1) / 2; // 等差数列求和
  const actualSum = nums.reduce((sum, num) => sum + num, 0);
  return expectedSum - actualSum;
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 查找元素 =====");
console.log("标准二分 [1,2,3,4,5] target=3:", search([1, 2, 3, 4, 5], 3)); // 2
console.log("标准二分 [1,2,3,4,5] target=6:", search([1, 2, 3, 4, 5], 6)); // -1
console.log("左闭右开 [-1,0,3,5,9,12] target=9:", searchOpenRight([-1, 0, 3, 5, 9, 12], 9)); // 4
console.log("递归法 [-1,0,3,5,9,12] target=2:", searchRecursive([-1, 0, 3, 5, 9, 12], 2)); // -1

console.log("\n===== 2. 搜索插入位置 =====");
console.log("[1,3,5,6] target=5:", searchInsert([1, 3, 5, 6], 5)); // 2
console.log("[1,3,5,6] target=2:", searchInsert([1, 3, 5, 6], 2)); // 1
console.log("[1,3,5,6] target=7:", searchInsert([1, 3, 5, 6], 7)); // 4
console.log("[1,3,5,6] target=0:", searchInsert([1, 3, 5, 6], 0)); // 0
console.log("左闭右开 [1,3,5,6] target=2:", searchInsertOpenRight([1, 3, 5, 6], 2)); // 1
console.log("lower_bound [1,3,5,6] target=5:", searchInsertLowerBound([1, 3, 5, 6], 5)); // 2

console.log("\n===== 3. 查找缺失的元素 =====");
console.log("异或法 [3,0,1]:", missingNumber([3, 0, 1])); // 2
console.log("异或法 [0,1]:", missingNumber([0, 1])); // 2
console.log("异或法 [9,6,4,2,3,5,7,0,1]:", missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 8
console.log("数学法 [3,0,1]:", missingNumberMath([3, 0, 1])); // 2
console.log("二分法 [0,1,2,3,5]:", missingNumberBinarySearch([0, 1, 2, 3, 5])); // 4

console.log("\n===== 4. 查找元素的第一个和最后一个位置 =====");
console.log("[5,7,7,8,8,10] target=8:", searchRange([5, 7, 7, 8, 8, 10], 8)); // [3, 4]
console.log("[5,7,7,8,8,10] target=6:", searchRange([5, 7, 7, 8, 8, 10], 6)); // [-1, -1]
console.log("[] target=0:", searchRange([], 0)); // [-1, -1]
console.log("bound法 [5,7,7,8,8,10] target=8:", searchRangeBound([5, 7, 7, 8, 8, 10], 8)); // [3, 4]
console.log("扩展法 [5,7,7,8,8,8,10] target=8:", searchRangeExpand([5, 7, 7, 8, 8, 8, 10], 8)); // [3, 5]

console.log("\n===== 5. 寻找峰值 =====");
console.log("[1,2,3,1]:", findPeakElement([1, 2, 3, 1])); // 2
console.log("[1,2,1,3,5,6,4]:", findPeakElement([1, 2, 1, 3, 5, 6, 4])); // 1 或 5
console.log("与左比较 [1,2,3,1]:", findPeakElementLeft([1, 2, 3, 1])); // 2
console.log("线性扫描 [1,2,1,3,5,6,4]:", findPeakElementLinear([1, 2, 1, 3, 5, 6, 4])); // 1

console.log("\n===== 6. 查找平方根 =====");
console.log("x=4:", mySqrt(4)); // 2
console.log("x=8:", mySqrt(8)); // 2
console.log("x=0:", mySqrt(0)); // 0
console.log("x=1:", mySqrt(1)); // 1
console.log("x=2147395599:", mySqrt(2147395599)); // 46339
console.log("左闭右开 x=8:", mySqrtOpenRight(8)); // 2
console.log("牛顿法 x=8:", mySqrtNewton(8)); // 2

console.log("\n===== 7. 查找旋转排序数组的最小值 =====");
console.log("[3,4,5,1,2]:", findMin([3, 4, 5, 1, 2])); // 1
console.log("[4,5,6,7,0,1,2]:", findMin([4, 5, 6, 7, 0, 1, 2])); // 0
console.log("[1,2,3,4,5]:", findMin([1, 2, 3, 4, 5])); // 1 (未旋转)
console.log("与左比较 [3,4,5,1,2]:", findMinCompareLeft([3, 4, 5, 1, 2])); // 1
console.log("含重复 [2,2,2,0,1]:", findMinWithDuplicates([2, 2, 2, 0, 1])); // 0
console.log("含重复 [1,3,3]:", findMinWithDuplicates([1, 3, 3])); // 1

console.log("\n===== 8. 查找旋转排序数组的缺失元素 =====");
console.log("[4,5,6,7,0,1,3] (缺失2):", findMissingInRotated([4, 5, 6, 7, 0, 1, 3])); // 2
console.log("[3,4,5,1,2] (未缺失时):", findMissingInSorted([1, 2, 3, 4, 5])); // 6 (有序序列后)
console.log("[0,1,3] (缺失2):", findMissingInRotated([0, 1, 3])); // 2
console.log("索引映射 [4,5,6,7,0,1,3]:", findMissingInRotatedByIndex([4, 5, 6, 7, 0, 1, 3])); // 2
console.log("求和法 [4,5,6,7,0,1,3]:", findMissingBySum([4, 5, 6, 7, 0, 1, 3])); // 2

export {};
