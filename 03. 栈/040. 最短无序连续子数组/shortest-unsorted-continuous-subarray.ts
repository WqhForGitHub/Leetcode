// ============================================================
// 040. 最短无序连续子数组
// ============================================================
// LeetCode 581. Shortest Unsorted Continuous Subarray
// 找到一个最短连续子数组，若将其升序排序，整个数组就变为升序。返回其长度。

// ------------------------------------------------------------
// 方法1：单调栈
// ------------------------------------------------------------
// 从左找最右一个破坏升序的位置（栈找第一个不递增的右边界）；
// 从右找最左一个破坏降序的位置。两者之差即长度。
// 时间 O(n)，空间 O(n)。
function findUnsortedSubarray(nums: number[]): number {
  const n = nums.length;
  let left = n;
  let right = -1;
  // 从左到右找右边界
  const stack: number[] = [];
  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && nums[stack[stack.length - 1]] > nums[i]) {
      left = Math.min(left, stack.pop()!);
    }
    stack.push(i);
  }
  // 从右到左找左边界
  stack.length = 0;
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
      right = Math.max(right, stack.pop()!);
    }
    stack.push(i);
  }
  return right - left >= 0 ? right - left + 1 : 0;
}

// ------------------------------------------------------------
// 方法2：双指针 O(1) 空间
// ------------------------------------------------------------
function findUnsortedSubarrayO1(nums: number[]): number {
  const n = nums.length;
  let max = -Infinity,
    min = Infinity;
  let right = -1,
    left = n;
  for (let i = 0; i < n; i++) {
    if (nums[i] < max) right = i;
    else max = nums[i];
  }
  for (let i = n - 1; i >= 0; i--) {
    if (nums[i] > min) left = i;
    else min = nums[i];
  }
  return right - left >= 0 ? right - left + 1 : 0;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1 - 栈法:", findUnsortedSubarray([2, 6, 4, 8, 10, 9, 15]), "期望: 5");
  console.log("测试2 - 栈法:", findUnsortedSubarray([1, 2, 3, 4]), "期望: 0");
  console.log("测试3 - O1法:", findUnsortedSubarrayO1([1, 3, 2, 2, 2]), "期望: 4");
}

test();

export {};
