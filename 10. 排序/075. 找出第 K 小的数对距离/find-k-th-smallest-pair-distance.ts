// ============================================================
// 075. 找出第 K 小的数对距离
// ============================================================
// LeetCode 719. Find K-th Smallest Pair Distance
// 找出所有数对 |nums[i]-nums[j]| 中第 k 小的距离。

// 方法1：排序 + 二分距离 + 滑动窗口计数（O(n log n + n log W)，W 为最大距离）
// 思路：对答案距离 d 二分。判定 <= d 的数对数量时用双指针滑动窗口：
// 对每个右端点 right，左端点 left 不断右移直到 nums[right]-nums[left] <= d，
// 该窗口贡献 (right - left) 个数对。
function smallestDistancePair(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  let lo = 0;
  let hi = nums[nums.length - 1] - nums[0];
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    let count = 0;
    let left = 0;
    for (let right = 0; right < nums.length; right++) {
      while (nums[right] - nums[left] > mid) {
        left++;
      }
      count += right - left;
    }
    if (count >= k) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return lo;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 075. 找出第 K 小的数对距离 =====");
console.log("结果:", smallestDistancePair([1, 3, 1], 1)); // 期望 0
console.log("结果:", smallestDistancePair([1, 1, 1], 2)); // 期望 0
console.log("结果:", smallestDistancePair([1, 6, 1], 3)); // 期望 5

export {};
