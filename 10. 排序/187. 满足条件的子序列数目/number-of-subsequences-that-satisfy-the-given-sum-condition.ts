// ============================================================
// 187. 满足条件的子序列数目
// ============================================================
// LeetCode 1498. Number of Subsequences That Satisfy the Given Sum Condition
// 给定数组 nums 和 target，统计非空子序列中 min + max <= target 的数目，
// 结果对 1e9+7 取模。

const MOD_1498 = 1e9 + 7;

// 方法1：排序 + 双指针 + 预处理 2 的幂（O(n log n)）
function numSubseq(nums: number[], target: number): number {
  const n = nums.length;
  const sorted = [...nums].sort((a, b) => a - b);
  // 预处理 2 的幂
  const pow2: number[] = new Array(n + 1);
  pow2[0] = 1;
  for (let i = 1; i <= n; i++) {
    pow2[i] = (pow2[i - 1] * 2) % MOD_1498;
  }
  let left = 0;
  let right = n - 1;
  let result = 0;
  while (left <= right) {
    if (sorted[left] + sorted[right] <= target) {
      // 以 left 为最小值，从 [left+1, right] 中任选若干元素
      result = (result + pow2[right - left]) % MOD_1498;
      left++;
    } else {
      right--;
    }
  }
  return result;
}

// 方法2：排序 + 二分查找（O(n log n)）
// 对每个 i 作为最小值，二分找最大 j 使得 nums[i] + nums[j] <= target。
function numSubseq2(nums: number[], target: number): number {
  const n = nums.length;
  const sorted = [...nums].sort((a, b) => a - b);
  const pow2: number[] = new Array(n + 1);
  pow2[0] = 1;
  for (let i = 1; i <= n; i++) {
    pow2[i] = (pow2[i - 1] * 2) % MOD_1498;
  }
  let result = 0;
  for (let i = 0; i < n; i++) {
    if (sorted[i] * 2 > target) break; // 最小值自身超限
    // 找最大的 j，使得 sorted[i] + sorted[j] <= target
    let lo = i;
    let hi = n - 1;
    let j = i;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[i] + sorted[mid] <= target) {
        j = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    // 子序列数量 = 2^(j - i)
    result = (result + pow2[j - i]) % MOD_1498;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 187. 满足条件的子序列数目 =====");
console.log("方法1 [3,5,6,7], target=9:", numSubseq([3, 5, 6, 7], 9)); // 4
console.log("方法1 [2,3,3,4,6,7], target=12:", numSubseq([2, 3, 3, 4, 6, 7], 12)); // 61
console.log("方法2 [3,5,6,7], target=9:", numSubseq2([3, 5, 6, 7], 9)); // 4
console.log("方法2 [2,3,3,4,6,7], target=12:", numSubseq2([2, 3, 3, 4, 6, 7], 12)); // 61

export {};
