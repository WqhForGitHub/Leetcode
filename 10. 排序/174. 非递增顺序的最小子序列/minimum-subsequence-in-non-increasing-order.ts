// ============================================================
// 174. 非递增顺序的最小子序列
// ============================================================
// LeetCode 1403. Minimum Subsequence in Non-Increasing Order
// 从数组中选最小长度子序列，使其和严格大于剩余元素和，
// 结果按非递增顺序返回。可能有多种解，返回任一即可。

// 方法1：降序排序 + 贪心（O(n log n)）
// 排序后从大到小依次取，累加和 > 总和一半即返回。
function minSubsequence(nums: number[]): number[] {
  nums.sort((a, b) => b - a);
  const total = nums.reduce((a, b) => a + b, 0);
  let sum = 0;
  const result: number[] = [];
  for (const x of nums) {
    sum += x;
    result.push(x);
    if (sum > total - sum) break;
  }
  return result;
}

// 方法2：降序排序 + 前缀和数组（O(n log n)）
// 预计算前缀和数组，用二分或线性查找首个满足条件的位置。
function minSubsequence2(nums: number[]): number[] {
  nums.sort((a, b) => b - a);
  const n = nums.length;
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  const total = prefix[n];
  for (let i = 1; i <= n; i++) {
    if (prefix[i] > total - prefix[i]) {
      return nums.slice(0, i);
    }
  }
  return nums.slice();
}

// ============================================================
// 测试
// ============================================================
console.log("===== 174. 非递增顺序的最小子序列 =====");
console.log("方法1 [4,3,10,9,8]:", minSubsequence([4, 3, 10, 9, 8])); // [10,9,8]
console.log("方法1 [4,4,7,6,7]:", minSubsequence([4, 4, 7, 6, 7])); // [7,7,6]
console.log("方法2 [4,3,10,9,8]:", minSubsequence2([4, 3, 10, 9, 8])); // [10,9,8]
console.log("方法2 [4,4,7,6,7]:", minSubsequence2([4, 4, 7, 6, 7])); // [7,7,6]
console.log("方法2 [6]:", minSubsequence2([6])); // [6]

export {};
