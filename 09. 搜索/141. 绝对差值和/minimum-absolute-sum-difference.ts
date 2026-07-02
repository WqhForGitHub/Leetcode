// ============================================================
// 141. 绝对差值和
// ============================================================
// LeetCode 1818. Minimum Absolute Sum Difference
// 可替换 nums1 中一个元素为 nums1 中另一个元素，最小化绝对差值和。

// 方法1：排序 + 二分查找
function minAbsoluteSumDiff(nums1: number[], nums2: number[]): number {
  const mod = 1_000_000_007;
  const n = nums1.length;
  const sorted = [...nums1].sort((a, b) => a - b);
  let totalDiff = 0;
  let maxImprovement = 0;
  for (let i = 0; i < n; i++) {
    const diff = Math.abs(nums1[i] - nums2[i]);
    totalDiff = (totalDiff + diff) % mod;
    if (diff === 0) continue;
    // 二分找 nums1 中最接近 nums2[i] 的值
    let lo = 0;
    let hi = n - 1;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (sorted[mid] < nums2[i]) lo = mid + 1;
      else hi = mid;
    }
    let bestDiff = Math.abs(sorted[lo] - nums2[i]);
    if (lo > 0) {
      bestDiff = Math.min(bestDiff, Math.abs(sorted[lo - 1] - nums2[i]));
    }
    maxImprovement = Math.max(maxImprovement, diff - bestDiff);
  }
  return (totalDiff - maxImprovement + mod) % mod;
}

// 方法2：暴力（O(n²)，仅用于验证）
function minAbsoluteSumDiffBrute(nums1: number[], nums2: number[]): number {
  const mod = 1_000_000_007;
  const n = nums1.length;
  let totalDiff = 0;
  for (let i = 0; i < n; i++) {
    totalDiff += Math.abs(nums1[i] - nums2[i]);
  }
  let minSum = totalDiff;
  for (let i = 0; i < n; i++) {
    const origDiff = Math.abs(nums1[i] - nums2[i]);
    for (let j = 0; j < n; j++) {
      const newDiff = Math.abs(nums1[j] - nums2[i]);
      minSum = Math.min(minSum, totalDiff - origDiff + newDiff);
    }
  }
  return minSum % mod;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 141. 绝对差值和 =====");
console.log("二分 [1,7,5],[2,3,5]:", minAbsoluteSumDiff([1, 7, 5], [2, 3, 5])); // 3
console.log(
  "二分 [2,4,6,8,10],[2,4,6,8,10]:",
  minAbsoluteSumDiff([2, 4, 6, 8, 10], [2, 4, 6, 8, 10]),
); // 0

export {};
