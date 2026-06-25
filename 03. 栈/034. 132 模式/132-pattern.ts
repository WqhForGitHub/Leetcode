// ============================================================
// 034. 132 模式
// ============================================================
// LeetCode 456. 132 Pattern
// 给你一个整数数组 nums，判断是否存在 132 模式（i<j<k 且 nums[i]<nums[k]<nums[j]）。

// ------------------------------------------------------------
// 方法1：单调栈
// ------------------------------------------------------------
// 从右往左维护单调递减栈，栈中元素作为 nums[j]（次大的 3），
// 用 third 记录弹出的最大值作为 nums[k]（2）。只要找到 nums[i] < third 即返回。
// 时间 O(n)，空间 O(n)。
function find132pattern(nums: number[]): boolean {
  const stack: number[] = []; // 单调递减栈，存候选 nums[j]
  let third = -Infinity; // 最大的 nums[k]
  for (let i = nums.length - 1; i >= 0; i--) {
    if (nums[i] < third) return true; // nums[i] 作为 1
    while (stack.length > 0 && stack[stack.length - 1] < nums[i]) {
      third = stack.pop()!;
    }
    stack.push(nums[i]);
  }
  return false;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1:', find132pattern([1, 2, 3, 4]), '期望: false');
  console.log('测试2:', find132pattern([3, 1, 4, 2]), '期望: true');
  console.log('测试3:', find132pattern([-1, 3, 2, 0]), '期望: true');
}

test();

export {};
