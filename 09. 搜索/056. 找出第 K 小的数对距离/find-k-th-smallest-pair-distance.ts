// ============================================================
// 056. 找出第 K 小的数对距离
// ============================================================
// LeetCode 719. Find K-th Smallest Pair Distance
// 数组中所有数对距离（绝对差）升序排列后的第 k 小值。

// 方法1：二分查找 + 滑动窗口计数
function smallestDistancePair(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  let left = 0;
  let right = nums[nums.length - 1] - nums[0];
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    let count = 0;
    let j = 0;
    for (let i = 0; i < nums.length; i++) {
      while (j < nums.length && nums[j] - nums[i] <= mid) j++;
      count += j - i - 1;
    }
    if (count < k) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}

// 方法2：二分查找 + 二分计数
function smallestDistancePairBinary(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  let lo = 0;
  let hi = nums[nums.length - 1] - nums[0];
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let count = 0;
    for (let i = 0; i < nums.length; i++) {
      // 找最大的 j 使得 nums[j] - nums[i] <= mid
      let l = i + 1;
      let r = nums.length - 1;
      let maxJ = i;
      while (l <= r) {
        const m = Math.floor((l + r) / 2);
        if (nums[m] - nums[i] <= mid) {
          maxJ = m;
          l = m + 1;
        } else {
          r = m - 1;
        }
      }
      count += maxJ - i;
    }
    if (count < k) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 056. 找出第 K 小的数对距离 =====");
console.log("滑窗 [1,3,1],1:", smallestDistancePair([1, 3, 1], 1)); // 0
console.log("滑窗 [1,1,1],2:", smallestDistancePair([1, 1, 1], 2)); // 0
console.log("滑窗 [1,6,1],3:", smallestDistancePair([1, 6, 1], 3)); // 5
console.log("二分 [1,6,1],3:", smallestDistancePairBinary([1, 6, 1], 3)); // 5

export {};
