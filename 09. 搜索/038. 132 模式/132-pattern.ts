// ============================================================
// 038. 132 模式
// ============================================================
// LeetCode 456. 132 Pattern
// 判断数组中是否存在 132 模式：i < j < k 且 nums[i] < nums[k] < nums[j]。

// 方法1：单调栈（O(n)）
function find132pattern(nums: number[]): boolean {
  const n = nums.length;
  const stack: number[] = [];
  let secondMax = -Infinity; // nums[k] 的最大可能值
  // 从右往左遍历，栈维护递减序列
  for (let i = n - 1; i >= 0; i--) {
    if (nums[i] < secondMax) {
      return true; // nums[i] 作为 nums[i] < nums[k] < nums[j]
    }
    while (stack.length > 0 && stack[stack.length - 1] < nums[i]) {
      secondMax = Math.max(secondMax, stack.pop()!);
    }
    stack.push(nums[i]);
  }
  return false;
}

// 方法2：前缀最小值 + 二分查找（O(n log n)）
function find132patternPrefix(nums: number[]): boolean {
  const n = nums.length;
  if (n < 3) return false;
  // minBefore[i] = nums[0..i] 的最小值
  const minBefore = new Array(n).fill(nums[0]);
  for (let i = 1; i < n; i++) {
    minBefore[i] = Math.min(minBefore[i - 1], nums[i]);
  }
  // 单调递减栈
  const stack: number[] = [];
  for (let i = n - 1; i >= 0; i--) {
    if (nums[i] > minBefore[i]) {
      // 弹出栈中小于等于 minBefore[i] 的元素
      while (stack.length > 0 && stack[stack.length - 1] <= minBefore[i]) {
        stack.pop();
      }
      // 如果栈顶元素 < nums[i]，且 > minBefore[i]，找到 132 模式
      if (stack.length > 0 && stack[stack.length - 1] < nums[i]) {
        return true;
      }
      stack.push(nums[i]);
    }
  }
  return false;
}

// 方法3：暴力三重循环（O(n³)，仅用于验证）
function find132patternBrute(nums: number[]): boolean {
  const n = nums.length;
  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 1; j < n - 1; j++) {
      if (nums[j] <= nums[i]) continue;
      for (let k = j + 1; k < n; k++) {
        if (nums[i] < nums[k] && nums[k] < nums[j]) return true;
      }
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 038. 132 模式 =====");
console.log("栈 [1,2,3,4]:", find132pattern([1, 2, 3, 4])); // false
console.log("栈 [3,1,4,2]:", find132pattern([3, 1, 4, 2])); // true
console.log("栈 [-1,3,2,0]:", find132pattern([-1, 3, 2, 0])); // true
console.log("前缀 [3,1,4,2]:", find132patternPrefix([3, 1, 4, 2])); // true

export {};
