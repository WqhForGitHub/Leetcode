// ============================================================
// 001. 寻找两个正序数组的中位数
// ============================================================
// LeetCode 4. Median of Two Sorted Arrays
// 给定两个大小分别为 m 和 n 的正序（从小到大）数组，返回它们的中位数。
// 要求时间复杂度 O(log(m+n))。

// 方法1：二分查找（推荐，O(log(min(m,n)))）
function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  // 保证 nums1 是较短的数组
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }
  const m = nums1.length;
  const n = nums2.length;
  let left = 0;
  let right = m;
  // 中位数位置：总长度的一半（左侧多一个）
  const halfLen = Math.floor((m + n + 1) / 2);

  while (left <= right) {
    const i = Math.floor((left + right) / 2); // nums1 切分点
    const j = halfLen - i; // nums2 切分点

    const nums1LeftMax = i === 0 ? -Infinity : nums1[i - 1];
    const nums1RightMin = i === m ? Infinity : nums1[i];
    const nums2LeftMax = j === 0 ? -Infinity : nums2[j - 1];
    const nums2RightMin = j === n ? Infinity : nums2[j];

    if (nums1LeftMax <= nums2RightMin && nums2LeftMax <= nums1RightMin) {
      // 找到正确切分点
      if ((m + n) % 2 === 1) {
        return Math.max(nums1LeftMax, nums2LeftMax);
      } else {
        return (Math.max(nums1LeftMax, nums2LeftMax) + Math.min(nums1RightMin, nums2RightMin)) / 2;
      }
    } else if (nums1LeftMax > nums2RightMin) {
      right = i - 1;
    } else {
      left = i + 1;
    }
  }
  return 0;
}

// 方法2：归并合并法（O(m+n)，简单直观）
function findMedianSortedArraysMerge(nums1: number[], nums2: number[]): number {
  const merged: number[] = [];
  let i = 0;
  let j = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] < nums2[j]) {
      merged.push(nums1[i++]);
    } else {
      merged.push(nums2[j++]);
    }
  }
  while (i < nums1.length) merged.push(nums1[i++]);
  while (j < nums2.length) merged.push(nums2[j++]);

  const len = merged.length;
  if (len % 2 === 1) {
    return merged[Math.floor(len / 2)];
  } else {
    return (merged[len / 2 - 1] + merged[len / 2]) / 2;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 001. 寻找两个正序数组的中位数 =====");
console.log("二分 [1,3],[2]:", findMedianSortedArrays([1, 3], [2])); // 2
console.log("二分 [1,2],[3,4]:", findMedianSortedArrays([1, 2], [3, 4])); // 2.5
console.log("归并 [1,3],[2]:", findMedianSortedArraysMerge([1, 3], [2])); // 2
console.log("归并 [1,2],[3,4]:", findMedianSortedArraysMerge([1, 2], [3, 4])); // 2.5

export {};
