// ============================================================
// 238. 统计数对
// ============================================================
// LeetCode 1885. Count Pairs in Two Arrays
// 给定两个等长数组 nums1 和 nums2，统计满足 i < j 且
// nums1[i] + nums1[j] > nums2[i] + nums2[j] 的数对 (i,j) 数量。
// 令 diff[i] = nums1[i] - nums2[i]，问题等价于统计 diff[i]+diff[j] > 0 的数对。

// 方法1：差分数组 + 排序 + 双指针（O(n log n)）
function countPairs1(nums1: number[], nums2: number[]): number {
  const n = nums1.length;
  const diff = nums1.map((v, i) => v - nums2[i]).sort((a, b) => a - b);
  let count = 0;
  let l = 0;
  let r = n - 1;
  while (l < r) {
    if (diff[l] + diff[r] > 0) {
      // diff[r] 与 diff[l..r-1] 配对均 > 0（diff 升序）
      count += r - l;
      r--;
    } else {
      l++;
    }
  }
  return count;
}

// 方法2：差分数组 + 排序 + 二分查找（O(n log n)）
function countPairs2(nums1: number[], nums2: number[]): number {
  const n = nums1.length;
  const diff = nums1.map((v, i) => v - nums2[i]).sort((a, b) => a - b);
  let count = 0;
  for (let i = 0; i < n; i++) {
    // 统计 j > i 且 diff[j] > -diff[i]
    const target = -diff[i];
    let lo = 0;
    let hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (diff[mid] <= target) lo = mid + 1;
      else hi = mid;
    }
    const start = Math.max(lo, i + 1);
    if (start < n) count += n - start;
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 238. 统计数对 =====");
console.log("方法1 [3,2,5],[2,2,1]:", countPairs1([3, 2, 5], [2, 2, 1])); // 3
console.log("方法2 [3,2,5],[2,2,1]:", countPairs2([3, 2, 5], [2, 2, 1])); // 3
console.log("方法1 [2,-7,10],[3,-2,5]:", countPairs1([2, -7, 10], [3, -2, 5])); // 1
console.log("方法2 [2,-7,10],[3,-2,5]:", countPairs2([2, -7, 10], [3, -2, 5])); // 1

export {};
