// ============================================================
// 118. 满足条件的子序列数目
// ============================================================
// LeetCode 1498. Number of Subsequences That Satisfy the Given Sum Condition
// 非空子序列中最小值与最大值之和 <= target 的个数。

// 方法1：排序 + 双指针
function numSubseq(nums: number[], target: number): number {
  const mod = 1_000_000_007;
  nums.sort((a, b) => a - b);
  const n = nums.length;
  // 预计算 2 的幂
  const pow2 = new Array(n + 1).fill(1);
  for (let i = 1; i <= n; i++) {
    pow2[i] = (pow2[i - 1] * 2) % mod;
  }
  let result = 0;
  let left = 0;
  let right = n - 1;
  while (left <= right) {
    if (nums[left] + nums[right] <= target) {
      // 以 nums[left] 为最小值，right-left 个元素可选可不选
      result = (result + pow2[right - left]) % mod;
      left++;
    } else {
      right--;
    }
  }
  return result;
}

// 方法2：排序 + 二分查找
function numSubseqBinary(nums: number[], target: number): number {
  const mod = 1_000_000_007;
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const pow2 = new Array(n + 1).fill(1);
  for (let i = 1; i <= n; i++) {
    pow2[i] = (pow2[i - 1] * 2) % mod;
  }
  let result = 0;
  for (let i = 0; i < n; i++) {
    // 找最大的 j 使得 nums[i] + nums[j] <= target
    const maxVal = target - nums[i];
    if (maxVal < nums[i]) break;
    let lo = i;
    let hi = n - 1;
    let best = i;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (nums[mid] <= maxVal) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    result = (result + pow2[best - i]) % mod;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 118. 满足条件的子序列数目 =====");
console.log("双指针 [3,5,6,7],9:", numSubseq([3, 5, 6, 7], 9)); // 4
console.log("双指针 [3,3,6,8],10:", numSubseq([3, 3, 6, 8], 10)); // 6
console.log("二分 [2,3,3,4,6,7],12:", numSubseqBinary([2, 3, 3, 4, 6, 7], 12)); // 61

export {};
