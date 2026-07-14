// ============================================================
// 008. 最大子数组和
// ============================================================
// LeetCode 53. Maximum Subarray
// 找出具有最大和的连续子数组，返回其最大和
// 时间复杂度 O(n)

// 方法1：动态规划 Kadane 算法（推荐）
// dp[i] 表示以 i 结尾的最大子数组和
// 状态转移：dp[i] = max(nums[i], dp[i-1] + nums[i])
// 空间优化为只用一个变量记录当前值
// 时间复杂度 O(n)，空间复杂度 O(1)
function maxSubArray(nums: number[]): number {
  // current 表示以当前元素结尾的最大子数组和
  let current: number = nums[0];
  let maxSum: number = nums[0];
  for (let i: number = 1; i < nums.length; i++) {
    // 要么单独成段，要么与前面拼接
    current = Math.max(nums[i], current + nums[i]);
    if (current > maxSum) maxSum = current;
  }
  return maxSum;
}

// 方法2：分治（可选第二种解法）
// 将数组分为左右两半，最大和可能：全在左半、全在右半、横跨中间
// 横跨中间时从中点向左右分别扩展求最大和
// 时间复杂度 O(n log n)，空间复杂度 O(log n)
function maxSubArray2(nums: number[]): number {
  const divide: (left: number, right: number) => number = (left: number, right: number): number => {
    if (left === right) return nums[left];
    const mid: number = Math.floor((left + right) / 2);
    // 左半部分最大和
    const leftSum: number = divide(left, mid);
    // 右半部分最大和
    const rightSum: number = divide(mid + 1, right);
    // 横跨中间的最大和：从中点向左扩展最大 + 向右扩展最大
    let leftCross: number = -Infinity;
    let temp: number = 0;
    for (let i: number = mid; i >= left; i--) {
      temp += nums[i];
      if (temp > leftCross) leftCross = temp;
    }
    let rightCross: number = -Infinity;
    temp = 0;
    for (let i: number = mid + 1; i <= right; i++) {
      temp += nums[i];
      if (temp > rightCross) rightCross = temp;
    }
    const crossSum: number = leftCross + rightCross;
    // 三者取最大
    return Math.max(leftSum, rightSum, crossSum);
  };
  return divide(0, nums.length - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 008. 最大子数组和 =====");
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 期望结果: 6
console.log(maxSubArray([1])); // 期望结果: 1
console.log(maxSubArray([5, 4, -1, 7, 8])); // 期望结果: 23
console.log(maxSubArray2([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 期望结果: 6

export {};
