// ============================================================
// 012. 长度最小的子数组
// ============================================================
// LeetCode 209. Minimum Size Subarray Sum
// 给定正整数数组和正整数 target，找出该数组中满足其和 ≥ target 的长度最小的连续子数组。

// 方法1：滑动窗口（推荐）
function minSubArrayLen(target: number, nums: number[]): number {
  let left = 0;
  let sum = 0;
  let minLen = Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      sum -= nums[left++];
    }
  }
  return minLen === Infinity ? 0 : minLen;
}

// 方法2：前缀和 + 二分查找（O(n log n)）
function minSubArrayLenBinary(target: number, nums: number[]): number {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  let minLen = Infinity;
  for (let i = 0; i < n; i++) {
    // 找到第一个 prefix[j] >= prefix[i] + target
    const need = prefix[i] + target;
    let left = i + 1;
    let right = n;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (prefix[mid] >= need) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    if (left <= n) {
      minLen = Math.min(minLen, left - i);
    }
  }
  return minLen === Infinity ? 0 : minLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 012. 长度最小的子数组 =====");
console.log("滑窗 7,[2,3,1,2,4,3]:", minSubArrayLen(7, [2, 3, 1, 2, 4, 3])); // 2
console.log("滑窗 4,[1,4,4]:", minSubArrayLen(4, [1, 4, 4])); // 1
console.log("二分 7,[2,3,1,2,4,3]:", minSubArrayLenBinary(7, [2, 3, 1, 2, 4, 3])); // 2

export {};
