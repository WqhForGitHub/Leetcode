// ============================================================
// 001. 寻找两个正序数组的中位数
// ============================================================
// LeetCode 4. Median of Two Sorted Arrays
// 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。
// 请你找出并返回这两个正序数组的中位数。
// 时间复杂度：O(log(min(m,n))), 空间复杂度：O(1)

// 方法1：二分查找（推荐）
// 在较短数组上进行二分，找到分割线使左半部分元素 <= 右半部分元素
// 时间复杂度 O(log(min(m,n)))，空间复杂度 O(1)
function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  // 确保 nums1 是较短数组
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }

  const m: number = nums1.length;
  const n: number = nums2.length;
  const totalLeft: number = Math.floor((m + n + 1) / 2);

  let left: number = 0;
  let right: number = m;

  while (left < right) {
    const i: number = left + Math.floor((right - left + 1) / 2);
    const j: number = totalLeft - i;
    if (nums1[i - 1] > nums2[j]) {
      right = i - 1;
    } else {
      left = i;
    }
  }

  const i: number = left;
  const j: number = totalLeft - i;

  const nums1LeftMax: number = i === 0 ? -Infinity : nums1[i - 1];
  const nums1RightMin: number = i === m ? Infinity : nums1[i];
  const nums2LeftMax: number = j === 0 ? -Infinity : nums2[j - 1];
  const nums2RightMin: number = j === n ? Infinity : nums2[j];

  if ((m + n) % 2 === 1) {
    return Math.max(nums1LeftMax, nums2LeftMax);
  } else {
    return (Math.max(nums1LeftMax, nums2LeftMax) + Math.min(nums1RightMin, nums2RightMin)) / 2;
  }
}

// 方法2：合并数组后找中位数
// 将两个数组合并，然后直接取中位数
// 时间复杂度 O(m+n)，空间复杂度 O(m+n)
function findMedianSortedArraysMerge(nums1: number[], nums2: number[]): number {
  const merged: number[] = [];
  let i: number = 0;
  let j: number = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] <= nums2[j]) {
      merged.push(nums1[i]);
      i++;
    } else {
      merged.push(nums2[j]);
      j++;
    }
  }
  while (i < nums1.length) {
    merged.push(nums1[i]);
    i++;
  }
  while (j < nums2.length) {
    merged.push(nums2[j]);
    j++;
  }

  const len: number = merged.length;
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
console.log(findMedianSortedArrays([1, 3], [2])); // 期望结果: 2
console.log(findMedianSortedArrays([1, 2], [3, 4])); // 期望结果: 2.5
console.log(findMedianSortedArrays([0, 0], [0, 0])); // 期望结果: 0
console.log(findMedianSortedArrays([], [1])); // 期望结果: 1
console.log(findMedianSortedArrays([2], [])); // 期望结果: 2
console.log("--- 方法2测试 ---");
console.log(findMedianSortedArraysMerge([1, 3], [2])); // 期望结果: 2
console.log(findMedianSortedArraysMerge([1, 2], [3, 4])); // 期望结果: 2.5
console.log(findMedianSortedArraysMerge([0, 0], [0, 0])); // 期望结果: 0

export {};
