// ============================================================
// 159. 未排序数组中的可被二分查找的数
// ============================================================
// LeetCode 1966. Binary Searchable Numbers in an Unsorted Array
// 数组中能用二分搜索找到的元素个数（从两端向中间搜索时能找到）。

// 方法1：前缀最大 + 后缀最小
function binarySearchableNumbers(nums: number[]): number {
  const n = nums.length;
  if (n === 0) return 0;
  // leftMax[i] = nums[0..i] 的最大值
  const leftMax = new Array(n).fill(-Infinity);
  leftMax[0] = nums[0];
  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], nums[i]);
  }
  // rightMin[i] = nums[i..n-1] 的最小值
  const rightMin = new Array(n).fill(Infinity);
  rightMin[n - 1] = nums[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    rightMin[i] = Math.min(rightMin[i + 1], nums[i]);
  }
  // 可被二分搜索的条件：左边都 < nums[i] 且右边都 > nums[i]
  let count = 0;
  for (let i = 0; i < n; i++) {
    if ((i === 0 || leftMax[i - 1] < nums[i]) && (i === n - 1 || rightMin[i + 1] > nums[i])) {
      count++;
    }
  }
  return count;
}

// 方法2：单调栈
function binarySearchableNumbersStack(nums: number[]): number {
  const n = nums.length;
  let count = 0;
  const stack: number[] = []; // 存储候选元素
  let rightMin = Infinity;
  for (let i = n - 1; i >= 0; i--) {
    if (nums[i] < rightMin) {
      // nums[i] 比右边所有元素都小
      while (stack.length > 0 && stack[stack.length - 1] > nums[i]) {
        stack.pop(); // 被弹出的是左边的，但它们 > nums[i]，不符合
      }
      stack.push(nums[i]);
    }
    rightMin = Math.min(rightMin, nums[i]);
  }
  return stack.length;
}

// 方法3：暴力模拟（O(n²)）
function binarySearchableNumbersBrute(nums: number[]): number {
  const n = nums.length;
  let count = 0;
  for (let target = 0; target < n; target++) {
    let lo = 0;
    let hi = n - 1;
    let found = false;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (nums[mid] === nums[target]) {
        found = true;
        break;
      }
      if (nums[mid] < nums[target]) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (found) count++;
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 159. 未排序数组中的可被二分查找的数 =====");
console.log("前缀后缀 [7]:", binarySearchableNumbers([7])); // 1
console.log("前缀后缀 [-1,1,0]:", binarySearchableNumbers([-1, 1, 0])); // 2
console.log("栈 [-1,1,0]:", binarySearchableNumbersStack([-1, 1, 0])); // 2

export {};
