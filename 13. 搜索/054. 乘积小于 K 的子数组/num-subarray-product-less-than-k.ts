// ============================================================
// 054. 乘积小于 K 的子数组
// ============================================================
// LeetCode 713. Subarray Product Less Than K
// 给定正整数数组，返回乘积小于 k 的连续子数组个数。

// 方法1：滑动窗口（O(n)）
function numSubarrayProductLessThanK(nums: number[], k: number): number {
  if (k <= 1) return 0;
  let product = 1;
  let count = 0;
  let left = 0;
  for (let right = 0; right < nums.length; right++) {
    product *= nums[right];
    while (product >= k) {
      product /= nums[left++];
    }
    count += right - left + 1;
  }
  return count;
}

// 方法2：对数 + 前缀和 + 二分（O(n log n)）
function numSubarrayProductLessThanKLog(nums: number[], k: number): number {
  if (k <= 1) return 0;
  const logK = Math.log(k);
  const prefix = [0];
  for (const num of nums) {
    prefix.push(prefix[prefix.length - 1] + Math.log(num));
  }
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    // 找最大的 j 使得 prefix[j+1] - prefix[i] < logK
    let lo = i + 1;
    let hi = nums.length;
    let maxJ = i;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (prefix[mid] - prefix[i] < logK) {
        maxJ = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    count += maxJ - i;
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 054. 乘积小于 K 的子数组 =====");
console.log("滑窗 [10,5,2,6],100:", numSubarrayProductLessThanK([10, 5, 2, 6], 100)); // 8
console.log("滑窗 [1,2,3],0:", numSubarrayProductLessThanK([1, 2, 3], 0)); // 0
console.log("对数 [10,5,2,6],100:", numSubarrayProductLessThanKLog([10, 5, 2, 6], 100)); // 8

export {};
