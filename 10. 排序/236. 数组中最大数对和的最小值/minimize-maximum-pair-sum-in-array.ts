// ============================================================
// 236. 数组中最大数对和的最小值
// ============================================================
// LeetCode 1877. Minimize Maximum Pair Sum in Array
// 给定长度为 2n 的数组，将其分成 n 个数对，使最大数对和最小。
// 将最小与最大配对即可使最大数对和最小。

// 方法1：排序 + 最小与最大配对（O(n log n)）
function minPairSum1(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  let maxSum = 0;
  for (let i = 0; i < n / 2; i++) {
    maxSum = Math.max(maxSum, nums[i] + nums[n - 1 - i]);
  }
  return maxSum;
}

// 方法2：排序 + 双指针（O(n log n)）
function minPairSum2(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  let maxSum = 0;
  let i = 0;
  let j = sorted.length - 1;
  while (i < j) {
    maxSum = Math.max(maxSum, sorted[i] + sorted[j]);
    i++;
    j--;
  }
  return maxSum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 236. 数组中最大数对和的最小值 =====");
console.log("方法1 [3,5,2,3]:", minPairSum1([3, 5, 2, 3])); // 7
console.log("方法2 [3,5,2,3]:", minPairSum2([3, 5, 2, 3])); // 7
console.log("方法1 [3,5,4,2,4,6]:", minPairSum1([3, 5, 4, 2, 4, 6])); // 8
console.log("方法2 [3,5,4,2,4,6]:", minPairSum2([3, 5, 4, 2, 4, 6])); // 8

export {};
