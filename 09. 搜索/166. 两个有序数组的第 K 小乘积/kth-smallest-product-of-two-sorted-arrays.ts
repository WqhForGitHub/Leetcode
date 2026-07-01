// ============================================================
// 166. 两个有序数组的第 K 小乘积
// ============================================================
// LeetCode 2040. Kth Smallest Product of Two Sorted Arrays
// 给定两个有序数组 nums1 和 nums2，返回所有 nums1[i]*nums2[j] 中第 k 小的乘积。
// 二分答案法，对每个候选值 mid 统计乘积 <= mid 的对数。

// 方法1：二分答案 + 逐元素二分统计
function kthSmallestProduct(nums1: number[], nums2: number[], k: number): number {
  // 统计乘积 <= mid 的对数
  function countLessEqual(mid: number): number {
    let count = 0;
    for (const a of nums1) {
      if (a === 0) {
        // 0 * anything = 0
        if (mid >= 0) count += nums2.length;
      } else if (a > 0) {
        // a * b <= mid => b <= mid / a
        const target = mid / a;
        let lo = 0;
        let hi = nums2.length;
        while (lo < hi) {
          const m = Math.floor((lo + hi) / 2);
          if (nums2[m] <= target) lo = m + 1;
          else hi = m;
        }
        count += lo;
      } else {
        // a < 0, a * b <= mid => b >= mid / a（不等号翻转）
        const target = mid / a;
        let lo = 0;
        let hi = nums2.length;
        while (lo < hi) {
          const m = Math.floor((lo + hi) / 2);
          if (nums2[m] < target) lo = m + 1;
          else hi = m;
        }
        count += nums2.length - lo;
      }
    }
    return count;
  }

  // 二分范围：乘积的最小值到最大值
  const candidates = [
    nums1[0] * nums2[0],
    nums1[0] * nums2[nums2.length - 1],
    nums1[nums1.length - 1] * nums2[0],
    nums1[nums1.length - 1] * nums2[nums2.length - 1],
  ];
  let left = Math.min(...candidates);
  let right = Math.max(...candidates);

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (countLessEqual(mid) >= k) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 166. 两个有序数组的第 K 小乘积 =====");
console.log("[2,5],[3,4],2:", kthSmallestProduct([2, 5], [3, 4], 2)); // 8
console.log("[-4,-2,0,3],[2,4],6:", kthSmallestProduct([-4, -2, 0, 3], [2, 4], 6)); // 0
console.log("[-2,-1,0,1,2],[-3,-1,2,4,5],3:", kthSmallestProduct([-2, -1, 0, 1, 2], [-3, -1, 2, 4, 5], 3)); // -6

export {};
