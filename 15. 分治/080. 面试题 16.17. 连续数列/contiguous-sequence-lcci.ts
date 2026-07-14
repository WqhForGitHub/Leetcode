// ============================================================
// 080. 面试题 16.17. 连续数列
// ============================================================
// LeetCode 面试题 16.17 / 53. Contiguous Sequence
// 给定一个整数数组（含正负数），求一个连续子数组的最大和。
// 若所有元素都为负，允许空子数组，返回 0。
// 时间复杂度：O(n log n), 空间复杂度：O(log n)

// 方法1：分治 - 取左/右/跨越中点三者最大（推荐，体现分治主题）
// 最大子数组和或在左半、或在右半、或跨越中点
// 注意：空子数组和为 0，所以结果至少为 0
// 时间复杂度 O(n log n)，空间复杂度 O(log n) 递归栈
function maxSubArrayDnC(nums: number[]): number {
  function divideConquer(left: number, right: number): number {
    if (left > right) {
      return 0; // 空子数组和为 0
    }
    if (left === right) {
      return Math.max(0, nums[left]);
    }
    const mid: number = left + Math.floor((right - left) / 2);

    const leftMax: number = divideConquer(left, mid);
    const rightMax: number = divideConquer(mid + 1, right);

    // 跨越中点的最大和（左半向左延伸 + 右半向右延伸）
    // 向左延伸最大和（可以为空即 0）
    let leftCrossSum: number = 0;
    let sum: number = 0;
    for (let i: number = mid; i >= left; i--) {
      sum += nums[i];
      if (sum > leftCrossSum) {
        leftCrossSum = sum;
      }
    }
    // 向右延伸最大和（可以为空即 0）
    let rightCrossSum: number = 0;
    sum = 0;
    for (let i: number = mid + 1; i <= right; i++) {
      sum += nums[i];
      if (sum > rightCrossSum) {
        rightCrossSum = sum;
      }
    }
    const crossMax: number = leftCrossSum + rightCrossSum;

    return Math.max(leftMax, rightMax, crossMax, 0);
  }

  return divideConquer(0, nums.length - 1);
}

// 方法2：Kadane 算法（动态规划）
// 维护当前连续和，若为负则置零重新开始，允许空子数组
// 时间复杂度 O(n)，空间复杂度 O(1)
function maxSubArrayKadane(nums: number[]): number {
  let maxSum: number = 0;
  let curSum: number = 0;
  for (const num of nums) {
    curSum += num;
    if (curSum < 0) {
      curSum = 0;
    }
    if (curSum > maxSum) {
      maxSum = curSum;
    }
  }
  return maxSum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 080. 面试题 16.17. 连续数列 =====");
console.log(maxSubArrayDnC([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 期望结果: 6
console.log(maxSubArrayDnC([-1, -2, -3])); // 期望结果: 0 (空子数组)
console.log(maxSubArrayDnC([1, 2, 3])); // 期望结果: 6
console.log(maxSubArrayDnC([-2, -1])); // 期望结果: 0
console.log("--- 方法2测试 ---");
console.log(maxSubArrayKadane([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 期望结果: 6
console.log(maxSubArrayKadane([-1, -2, -3])); // 期望结果: 0
console.log(maxSubArrayKadane([1, 2, 3])); // 期望结果: 6

export {};
