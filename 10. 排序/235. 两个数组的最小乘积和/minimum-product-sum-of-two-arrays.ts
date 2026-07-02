// ============================================================
// 235. 两个数组的最小乘积和
// ============================================================
// LeetCode 1875. Minimum Product Sum of Two Arrays
// 给定两个等长数组 nums1 和 nums2，将元素两两配对，
// 使所有配对的乘积之和最小。返回该最小和。
// 依据重排不等式：升序与降序配对可使乘积和最小。

// 方法1：一个升序 + 另一个降序后逐位配对（O(n log n)）
function minProductSum1(nums1: number[], nums2: number[]): number {
  const a = [...nums1].sort((x, y) => x - y); // 升序
  const b = [...nums2].sort((x, y) => y - x); // 降序
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

// 方法2：两个都升序 + 双指针反向配对（O(n log n)）
function minProductSum2(nums1: number[], nums2: number[]): number {
  const a = [...nums1].sort((x, y) => x - y);
  const b = [...nums2].sort((x, y) => x - y);
  let sum = 0;
  let i = 0;
  let j = b.length - 1;
  while (i < a.length) {
    sum += a[i] * b[j];
    i++;
    j--;
  }
  return sum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 235. 两个数组的最小乘积和 =====");
console.log("方法1 [5,3,4,2],[4,2,2,5]:", minProductSum1([5, 3, 4, 2], [4, 2, 2, 5])); // 40
console.log("方法2 [5,3,4,2],[4,2,2,5]:", minProductSum2([5, 3, 4, 2], [4, 2, 2, 5])); // 40
console.log("方法1 [2,1,3],[3,3,1]:", minProductSum1([2, 1, 3], [3, 3, 1])); // 12
console.log("方法2 [2,1,3],[3,3,1]:", minProductSum2([2, 1, 3], [3, 3, 1])); // 12

export {};
