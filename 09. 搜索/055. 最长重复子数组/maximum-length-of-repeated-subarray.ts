// ============================================================
// 055. 最长重复子数组
// ============================================================
// LeetCode 718. Maximum Length of Repeated Subarray
// 两个整数数组中，最长的公共子数组长度。

// 方法1：动态规划（O(mn)）
function findLength(nums1: number[], nums2: number[]): number {
  const m = nums1.length;
  const n = nums2.length;
  const dp: number[][] = new Array(m + 1);
  for (let i = 0; i <= m; i++) dp[i] = new Array(n + 1).fill(0);
  let maxLen = 0;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (nums1[i - 1] === nums2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        maxLen = Math.max(maxLen, dp[i][j]);
      }
    }
  }
  return maxLen;
}

// 方法2：二分查找 + 滚动哈希（O((m+n) log(min(m,n)))）
function findLengthBinary(nums1: number[], nums2: number[]): number {
  const base = 101;
  const mod = 1_000_000_007;
  let lo = 0;
  let hi = Math.min(nums1.length, nums2.length);
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (hasCommon(nums1, nums2, mid, base, mod)) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  return lo;
}

function hasCommon(
  nums1: number[],
  nums2: number[],
  len: number,
  base: number,
  mod: number
): boolean {
  const set = new Set<number>();
  let hash = 0;
  let power = 1;
  for (let i = 0; i < len; i++) {
    hash = (hash * base + nums1[i]) % mod;
    power = (power * base) % mod;
  }
  set.add(hash);
  for (let i = len; i < nums1.length; i++) {
    hash = (hash * base + nums1[i] - nums1[i - len] * power) % mod;
    if (hash < 0) hash += mod;
    set.add(hash);
  }
  hash = 0;
  for (let i = 0; i < len; i++) {
    hash = (hash * base + nums2[i]) % mod;
  }
  if (set.has(hash)) return true;
  for (let i = len; i < nums2.length; i++) {
    hash = (hash * base + nums2[i] - nums2[i - len] * power) % mod;
    if (hash < 0) hash += mod;
    if (set.has(hash)) return true;
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 055. 最长重复子数组 =====");
console.log("DP [1,2,3,2,1],[3,2,1,4,7]:", findLength([1, 2, 3, 2, 1], [3, 2, 1, 4, 7])); // 3
console.log("DP [0,0,0,0,0],[0,0,0,0,0]:", findLength([0, 0, 0, 0, 0], [0, 0, 0, 0, 0])); // 5
console.log("二分 [1,2,3,2,1],[3,2,1,4,7]:", findLengthBinary([1, 2, 3, 2, 1], [3, 2, 1, 4, 7])); // 3

export {};
