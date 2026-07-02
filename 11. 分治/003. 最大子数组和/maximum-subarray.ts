// ============================================================
// 003. 最大子数组和
// ============================================================
// LeetCode 53. Maximum Subarray
// 给你一个整数数组 nums，请你找出一个具有最大和的连续子数组
// （子数组最少包含一个元素），返回其最大和。
// 时间复杂度：O(n log n), 空间复杂度：O(log n)

// 方法1：分治法（推荐，契合分治主题）
// 将数组分成左右两半，最大子数组可能：
// 1) 完全在左半部分 2) 完全在右半部分 3) 跨越中点
// 时间复杂度 O(n log n)，空间复杂度 O(log n)（递归栈）
function maxSubArray(nums: number[]): number {
  // 分治：返回 nums[left..right] 的最大子数组和
  function divide(left: number, right: number): number {
    if (left === right) return nums[left];
    const mid: number = left + Math.floor((right - left) / 2);

    // 1. 左半部分最大子数组和
    const leftMax: number = divide(left, mid);
    // 2. 右半部分最大子数组和
    const rightMax: number = divide(mid + 1, right);
    // 3. 跨越中点的最大子数组和
    //    从 mid 向左扩展的最大和
    let leftCrossMax: number = -Infinity;
    let sum: number = 0;
    for (let i: number = mid; i >= left; i--) {
      sum += nums[i];
      leftCrossMax = Math.max(leftCrossMax, sum);
    }
    //    从 mid+1 向右扩展的最大和
    let rightCrossMax: number = -Infinity;
    sum = 0;
    for (let i: number = mid + 1; i <= right; i++) {
      sum += nums[i];
      rightCrossMax = Math.max(rightCrossMax, sum);
    }
    const crossMax: number = leftCrossMax + rightCrossMax;

    return Math.max(leftMax, rightMax, crossMax);
  }

  return divide(0, nums.length - 1);
}

// 方法2：Kadane 算法（动态规划）
// 维护当前连续和，若为负则重新开始
// 时间复杂度 O(n)，空间复杂度 O(1)
function maxSubArrayKadane(nums: number[]): number {
  let maxSum: number = nums[0];
  let currentSum: number = nums[0];
  for (let i: number = 1; i < nums.length; i++) {
    // 当前和要么延续，要么从当前元素重新开始
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 003. 最大子数组和 =====");
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 期望结果: 6
console.log(maxSubArray([1])); // 期望结果: 1
console.log(maxSubArray([5, 4, -1, 7, 8])); // 期望结果: 23
console.log(maxSubArray([-1])); // 期望结果: -1
console.log("--- 方法2测试 ---");
console.log(maxSubArrayKadane([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 期望结果: 6
console.log(maxSubArrayKadane([1])); // 期望结果: 1
console.log(maxSubArrayKadane([5, 4, -1, 7, 8])); // 期望结果: 23

export {};
