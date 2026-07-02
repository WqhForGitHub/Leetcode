// ============================================================
// 140. 有界数组中指定下标处的最大值
// ============================================================
// LeetCode 1802. Maximum Value at a Given Index in a Bounded Array
// 长度为 n 的正整数数组，相邻差不超过1，index 处最大值，总和不超过 maxSum。

// 方法1：二分查找 + 数学计算
function maxValue1802(n: number, index: number, maxSum: number): number {
  // 二分找 index 处的最大值
  let left = 1;
  let right = maxSum;
  while (left < right) {
    const mid = Math.floor((left + right + 1) / 2);
    if (canConstruct(n, index, mid, maxSum)) {
      left = mid;
    } else {
      right = mid - 1;
    }
  }
  return left;
}

function canConstruct(n: number, index: number, val: number, maxSum: number): boolean {
  // 左侧 [0, index-1]，右侧 [index+1, n-1]
  // 左侧从 val-1 递减到 1（最小为1）
  const leftCount = index;
  const rightCount = n - index - 1;
  const sum = val + leftSum(val - 1, leftCount) + leftSum(val - 1, rightCount);
  return sum <= maxSum;
}

function leftSum(maxVal: number, count: number): number {
  // 从 maxVal 开始递减 count 个数（最小为1）的和
  if (count === 0) return 0;
  if (maxVal >= count) {
    // 等差数列：maxVal + (maxVal-1) + ... + (maxVal-count+1)
    return count * maxVal - (count * (count - 1)) / 2;
  } else {
    // 部分 > 0 的等差数列 + 剩余的 1
    const positiveCount = maxVal;
    const ones = count - positiveCount;
    return (maxVal * (maxVal + 1)) / 2 + ones;
  }
}

// 方法2：二分查找 + 简化计算
function maxValue1802Alt(n: number, index: number, maxSum: number): number {
  let lo = 1;
  let hi = maxSum;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    // 计算最小总和
    const leftLen = Math.min(mid - 1, index);
    const leftSum = ((mid - 1 + mid - leftLen) * leftLen) / 2 + (index - leftLen);
    const rightLen = Math.min(mid - 1, n - index - 1);
    const rightSum = ((mid - 1 + mid - rightLen) * rightLen) / 2 + (n - index - 1 - rightLen);
    const total = mid + leftSum + rightSum;
    if (total <= maxSum) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 140. 有界数组中指定下标处的最大值 =====");
console.log("二分 4,2,6:", maxValue1802(4, 2, 6)); // 2
console.log("二分 6,1,10:", maxValue1802(6, 1, 10)); // 3
console.log("变体 4,2,6:", maxValue1802Alt(4, 2, 6)); // 2

export {};
