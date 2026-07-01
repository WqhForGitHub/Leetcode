// ============================================================
// 008. 合并两个有序数组
// ============================================================
// LeetCode 88. Merge Sorted Array
// 将 nums2 合并到 nums1 中，使合并后的数组有序。
// nums1 末尾预留了足够空间（用 0 占位），m 和 n 分别为有效元素个数。

// 方法1：双指针从后往前填充（推荐，时间 O(m+n)，空间 O(1)）
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let i = m - 1; // nums1 有效元素末尾
  let j = n - 1; // nums2 末尾
  let k = m + n - 1; // 合并后数组末尾

  while (i >= 0 && j >= 0) {
    if (nums1[i] > nums2[j]) {
      nums1[k] = nums1[i];
      i--;
    } else {
      nums1[k] = nums2[j];
      j--;
    }
    k--;
  }

  // 若 nums2 还有剩余，直接拷贝（nums1 剩余无需处理，已在原位）
  while (j >= 0) {
    nums1[k] = nums2[j];
    j--;
    k--;
  }
}

// 方法2：合并后排序（时间 O((m+n)*log(m+n))，空间 O(log(m+n)) 排序栈）
function merge2(nums1: number[], m: number, nums2: number[], n: number): void {
  for (let i = 0; i < n; i++) {
    nums1[m + i] = nums2[i];
  }
  nums1.sort((a, b) => a - b);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 008. 合并两个有序数组 =====");
const test1 = [1, 2, 3, 0, 0, 0];
merge(test1, 3, [2, 5, 6], 3);
console.log("方法1:", test1); // 期望: [1,2,2,3,5,6]

const test2 = [1];
merge(test2, 1, [], 0);
console.log("方法1:", test2); // 期望: [1]

const test3 = [0];
merge(test3, 0, [1], 1);
console.log("方法1:", test3); // 期望: [1]

const test4 = [1, 2, 3, 0, 0, 0];
merge2(test4, 3, [2, 5, 6], 3);
console.log("方法2:", test4); // 期望: [1,2,2,3,5,6]

export {};
