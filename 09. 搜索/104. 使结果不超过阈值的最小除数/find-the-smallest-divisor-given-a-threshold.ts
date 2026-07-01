// ============================================================
// 104. 使结果不超过阈值的最小除数
// ============================================================
// LeetCode 1283. Find the Smallest Divisor Given a Threshold
// 给定数组和阈值，找最小除数使得各元素除以除数向上取整的和不超过阈值。

// 方法1：二分查找
function smallestDivisor(nums: number[], threshold: number): number {
  let left = 1;
  let right = Math.max(...nums);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    let sum = 0;
    for (const num of nums) {
      sum += Math.ceil(num / mid);
    }
    if (sum <= threshold) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

// 方法2：二分查找（优化提前终止）
function smallestDivisorOpt(nums: number[], threshold: number): number {
  let lo = 1;
  let hi = Math.max(...nums);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let sum = 0;
    for (const num of nums) {
      sum += Math.ceil(num / mid);
      if (sum > threshold) break;
    }
    if (sum <= threshold) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 104. 使结果不超过阈值的最小除数 =====");
console.log("二分 [1,2,5,9,6],6:", smallestDivisor([1, 2, 5, 9, 6], 6)); // 5
console.log("二分 [2,3,5,7,11],11:", smallestDivisor([2, 3, 5, 7, 11], 11)); // 3
console.log("优化 [44,22,33,11,1],5:", smallestDivisorOpt([44, 22, 33, 11, 1], 5)); // 44

export {};
