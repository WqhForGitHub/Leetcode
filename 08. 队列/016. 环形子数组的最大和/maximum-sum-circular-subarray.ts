// ============================================================
// 016. 环形子数组的最大和
// ============================================================
// LeetCode 918. Maximum Sum Circular Subarray
// 给定一个环形整数数组 nums，返回子数组的最大可能和。

// ------------------------------------------------------------
// 方法1：Kadane + 最大子数组和 = max(普通最大和, 总和-最小子数组和)
// ------------------------------------------------------------
// 环形最大和要么是不跨边界的普通最大子数组和，要么是总和减去最小子数组和。
// 特例：全负时返回最大元素。
// 时间 O(n)，空间 O(1)。
function maxSubarraySumCircular1(nums: number[]): number {
  const n = nums.length;
  let totalSum = 0;
  let maxSum = -Infinity;
  let curMax = 0;
  let minSum = Infinity;
  let curMin = 0;
  let allNegative = true;
  let maxElem = -Infinity;
  for (let i = 0; i < n; i++) {
    totalSum += nums[i];
    curMax = Math.max(curMax + nums[i], nums[i]);
    maxSum = Math.max(maxSum, curMax);
    curMin = Math.min(curMin + nums[i], nums[i]);
    minSum = Math.min(minSum, curMin);
    if (nums[i] > 0) allNegative = false;
    maxElem = Math.max(maxElem, nums[i]);
  }
  if (allNegative) return maxElem;
  return Math.max(maxSum, totalSum - minSum);
}

// ------------------------------------------------------------
// 方法2：前缀和 + 单调队列
// ------------------------------------------------------------
// 将数组拼接，计算扩展前缀和，用单调队列维护长度 ≤ n 的最小前缀和。
// 时间 O(n)，空间 O(n)。
function maxSubarraySumCircular2(nums: number[]): number {
  const n = nums.length;
  const extended = [...nums, ...nums];
  const prefix: number[] = new Array(2 * n + 1).fill(0);
  for (let i = 0; i < 2 * n; i++) {
    prefix[i + 1] = prefix[i] + extended[i];
  }
  const deque: number[] = [0];
  let result = -Infinity;
  for (let i = 1; i <= 2 * n; i++) {
    while (deque.length > 0 && deque[0] < i - n) {
      deque.shift();
    }
    result = Math.max(result, prefix[i] - prefix[deque[0]]);
    while (deque.length > 0 && prefix[deque[deque.length - 1]] >= prefix[i]) {
      deque.pop();
    }
    deque.push(i);
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", maxSubarraySumCircular1([1, -2, 3, -2]), "期望: 3");
  console.log("测试2:", maxSubarraySumCircular1([5, -3, 5]), "期望: 10");
  console.log("测试3:", maxSubarraySumCircular1([-3, -2, -3]), "期望: -2");
  console.log("测试4:", maxSubarraySumCircular2([1, -2, 3, -2]), "期望: 3");
  console.log("测试5:", maxSubarraySumCircular2([5, -3, 5]), "期望: 10");
}

test();

export {};
