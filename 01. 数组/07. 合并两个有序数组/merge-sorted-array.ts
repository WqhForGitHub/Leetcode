// ============================================================
// 07. 合并两个有序数组
// ============================================================
// LeetCode 88. Merge Sorted Array
// 给定两个有序数组 nums1（有 m 个元素）和 nums2（有 n 个元素），合并到 nums1 中。
// nums1 末尾有足够空间。
// 时间复杂度：O(m+n)，空间复杂度：O(1)

// 方法1：双指针从后往前填充（推荐）
// 利用 nums1 末尾的空闲空间，从后往前比较填充，避免覆盖未处理元素
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let p1 = m - 1; // nums1 有效元素末尾
  let p2 = n - 1; // nums2 末尾
  let p = m + n - 1; // nums1 总末尾（待写入位置）
  while (p1 >= 0 && p2 >= 0) {
    if (nums1[p1] > nums2[p2]) {
      nums1[p] = nums1[p1];
      p1--;
    } else {
      nums1[p] = nums2[p2];
      p2--;
    }
    p--;
  }
  // 若 nums2 还有剩余，需复制到 nums1 前部（nums1 剩余已在正确位置无需处理）
  while (p2 >= 0) {
    nums1[p] = nums2[p2];
    p2--;
    p--;
  }
}

// 方法2：双指针从前往后（需额外空间）
// 先复制 nums1 的有效元素到临时数组，再从前往后合并
function mergeForward(nums1: number[], m: number, nums2: number[], n: number): void {
  const nums1Copy = nums1.slice(0, m); // 额外 O(m) 空间
  let p1 = 0;
  let p2 = 0;
  let p = 0;
  while (p1 < m && p2 < n) {
    if (nums1Copy[p1] <= nums2[p2]) {
      nums1[p] = nums1Copy[p1];
      p1++;
    } else {
      nums1[p] = nums2[p2];
      p2++;
    }
    p++;
  }
  // 处理剩余元素
  while (p1 < m) {
    nums1[p] = nums1Copy[p1];
    p1++;
    p++;
  }
  while (p2 < n) {
    nums1[p] = nums2[p2];
    p2++;
    p++;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 07. 合并两个有序数组 =====");
let test1 = [1, 2, 3, 0, 0, 0];
merge(test1, 3, [2, 5, 6], 3);
console.log("从后往前 [1,2,3,0,0,0] + [2,5,6]:", test1); // 期望结果 [1,2,2,3,5,6]

let test2 = [1, 2, 3, 0, 0, 0];
mergeForward(test2, 3, [2, 5, 6], 3);
console.log("从前往后 [1,2,3,0,0,0] + [2,5,6]:", test2); // 期望结果 [1,2,2,3,5,6]

let test3 = [0];
merge(test3, 0, [1], 1);
console.log("从后往前 [0] + [1]:", test3); // 期望结果 [1]

let test4 = [1];
merge(test4, 1, [], 0);
console.log("从后往前 [1] + []:", test4); // 期望结果 [1]

export {};
