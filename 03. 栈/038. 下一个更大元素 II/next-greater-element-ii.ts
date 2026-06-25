// ============================================================
// 038. 下一个更大元素 II
// ============================================================
// LeetCode 503. Next Greater Element II
// 给定一个循环数组 nums，返回每个元素的下一个更大元素（可循环），不存在则 -1。

// ------------------------------------------------------------
// 方法1：单调栈（遍历两圈）
// ------------------------------------------------------------
// 对长度 2n 的虚拟展开数组用单调递减栈处理，下标取模。
// 时间 O(n)，空间 O(n)。
function nextGreaterElements(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack: number[] = []; // 存下标
  for (let i = 0; i < 2 * n; i++) {
    const num = nums[i % n];
    while (stack.length > 0 && nums[stack[stack.length - 1]] < num) {
      result[stack.pop()!] = num;
    }
    if (i < n) stack.push(i);
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1:', nextGreaterElements([1, 2, 1]), '期望: [2,-1,2]');
  console.log('测试2:', nextGreaterElements([1, 2, 3, 4, 3]), '期望: [2,3,4,-1,4]');
}

test();

export {};
