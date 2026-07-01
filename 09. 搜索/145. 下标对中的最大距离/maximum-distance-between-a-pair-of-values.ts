// ============================================================
// 145. 下标对中的最大距离
// ============================================================
// LeetCode 1855. Maximum Distance Between a Pair of Values
// 两个非递增数组，找 i <= j 使 nums1[i] <= nums2[j]，最大化 j - i。

// 方法1：双指针
function maxDistance1855(nums1: number[], nums2: number[]): number {
  let i = 0;
  let j = 0;
  let maxDist = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] <= nums2[j]) {
      maxDist = Math.max(maxDist, j - i);
      j++;
    } else {
      i++;
    }
  }
  return maxDist;
}

// 方法2：二分查找
function maxDistance1855Binary(nums1: number[], nums2: number[]): number {
  let maxDist = 0;
  for (let i = 0; i < nums1.length; i++) {
    // 在 nums2 中二分找最后一个 >= nums1[i] 的位置（非递增数组）
    let lo = i;
    let hi = nums2.length - 1;
    let best = -1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (nums2[mid] >= nums1[i]) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (best !== -1) {
      maxDist = Math.max(maxDist, best - i);
    }
  }
  return maxDist;
}

// 方法3：暴力（O(nm)）
function maxDistance1855Brute(nums1: number[], nums2: number[]): number {
  let maxDist = 0;
  for (let i = 0; i < nums1.length; i++) {
    for (let j = i; j < nums2.length; j++) {
      if (nums1[i] <= nums2[j]) {
        maxDist = Math.max(maxDist, j - i);
      }
    }
  }
  return maxDist;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 145. 下标对中的最大距离 =====");
console.log("双指针 [55,30,5,4,2],[100,20,10,10,5]:",
  maxDistance1855([55, 30, 5, 4, 2], [100, 20, 10, 10, 5])); // 2
console.log("双指针 [2,2,2],[10,10,1]:",
  maxDistance1855([2, 2, 2], [10, 10, 1])); // 1
console.log("二分 [55,30,5,4,2],[100,20,10,10,5]:",
  maxDistance1855Binary([55, 30, 5, 4, 2], [100, 20, 10, 10, 5])); // 2

export {};
