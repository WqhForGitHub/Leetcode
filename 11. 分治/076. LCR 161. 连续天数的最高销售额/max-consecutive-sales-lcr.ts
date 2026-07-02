// ============================================================
// 076. LCR 161. 连续天数的最高销售额
// ============================================================
// LeetCode 53. Maximum Subarray
// 给定数组 sales，找出连续子数组的最大和（至少包含一个元素）。
// 时间复杂度：O(n log n), 空间复杂度：O(log n)

// 方法1：分治 - 取左/右/跨越中点三者最大（推荐，体现分治主题）
// 将数组一分为二，最大子数组或在左半、或在右半、或跨越中点
// 时间复杂度 O(n log n)，空间复杂度 O(log n) 递归栈
function maxSalesDnC(sales: number[]): number {
  function divideConquer(left: number, right: number): number {
    if (left === right) {
      return sales[left];
    }
    const mid: number = left + Math.floor((right - left) / 2);

    // 左半最大子数组和
    const leftMax: number = divideConquer(left, mid);
    // 右半最大子数组和
    const rightMax: number = divideConquer(mid + 1, right);

    // 跨越中点的最大子数组和：从中点向左延伸最大 + 中点向右延伸最大
    let leftCrossSum: number = -Infinity;
    let sum: number = 0;
    for (let i: number = mid; i >= left; i--) {
      sum += sales[i];
      if (sum > leftCrossSum) {
        leftCrossSum = sum;
      }
    }
    let rightCrossSum: number = -Infinity;
    sum = 0;
    for (let i: number = mid + 1; i <= right; i++) {
      sum += sales[i];
      if (sum > rightCrossSum) {
        rightCrossSum = sum;
      }
    }
    const crossMax: number = leftCrossSum + rightCrossSum;

    return Math.max(leftMax, rightMax, crossMax);
  }

  return divideConquer(0, sales.length - 1);
}

// 方法2：Kadane 算法（动态规划）
// 维护当前连续和，若为负则舍弃从当前重新开始
// 时间复杂度 O(n)，空间复杂度 O(1)
function maxSalesKadane(sales: number[]): number {
  let maxSum: number = sales[0];
  let curSum: number = sales[0];
  for (let i: number = 1; i < sales.length; i++) {
    curSum = Math.max(sales[i], curSum + sales[i]);
    maxSum = Math.max(maxSum, curSum);
  }
  return maxSum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 076. LCR 161. 连续天数的最高销售额 =====");
console.log(maxSalesDnC([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 期望结果: 6
console.log(maxSalesDnC([1])); // 期望结果: 1
console.log(maxSalesDnC([5, 4, -1, 7, 8])); // 期望结果: 23
console.log(maxSalesDnC([-1])); // 期望结果: -1
console.log("--- 方法2测试 ---");
console.log(maxSalesKadane([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 期望结果: 6
console.log(maxSalesKadane([1])); // 期望结果: 1
console.log(maxSalesKadane([5, 4, -1, 7, 8])); // 期望结果: 23

export {};
