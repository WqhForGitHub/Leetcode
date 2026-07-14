// ============================================================
// 078. 最大连续1的个数 III
// ============================================================
// LeetCode 1004. Max Consecutive Ones III
// 给定二进制数组，可翻转最多 K 个 0 为 1，返回最长连续 1 的长度。

// 方法1：滑动窗口
function longestOnes(nums: number[], k: number): number {
  let left = 0;
  let zeroCount = 0;
  let maxLen = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeroCount++;
    while (zeroCount > k) {
      if (nums[left] === 0) zeroCount--;
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

// 方法2：前缀和 + 二分查找
function longestOnesBinary(nums: number[], k: number): number {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + (nums[i] === 0 ? 1 : 0);
  }
  let maxLen = 0;
  for (let i = 0; i < n; i++) {
    // 找最大的 j 使得 prefix[j+1] - prefix[i] <= k
    let lo = i;
    let hi = n - 1;
    let best = i - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (prefix[mid + 1] - prefix[i] <= k) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    maxLen = Math.max(maxLen, best - i + 1);
  }
  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 078. 最大连续1的个数 III =====");
console.log("滑窗 [1,1,1,0,0,0,1,1,1,1,0],2:", longestOnes([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2)); // 6
console.log(
  "滑窗 [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1],3:",
  longestOnes([0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3),
); // 10
console.log(
  "二分 [1,1,1,0,0,0,1,1,1,1,0],2:",
  longestOnesBinary([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2),
); // 6

export {};
