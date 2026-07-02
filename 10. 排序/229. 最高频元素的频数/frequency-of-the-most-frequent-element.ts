// ============================================================
// 229. 最高频元素的频数
// ============================================================
// LeetCode 1838. Frequency of the Most Frequent Element
// 在最多 k 次操作中（每次操作使某元素 +1），使数组中某个元素的频数最大，返回该最大频数。

// 方法1：排序 + 滑动窗口（O(n log n)）
// 排序后维护窗口 [left, right]，窗口内所有元素都能在 k 次操作内提升到 nums[right]。
// 窗口代价 = nums[right] * 窗口长度 - 窗口元素和，超过 k 则左端右移。
function maxFrequency(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  let left = 0;
  let sum = 0;
  let best = 1;
  for (let right = 0; right < n; right++) {
    sum += nums[right];
    while (nums[right] * (right - left + 1) - sum > k) {
      sum -= nums[left];
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// 方法2：排序 + 前缀和 + 二分查找（O(n log n)）
// 排序后构建前缀和，对每个 right 二分查找最小的 left，
// 使得把 nums[left..right] 全部提升到 nums[right] 的代价 <= k。
function maxFrequency2(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  let best = 1;
  for (let right = 0; right < n; right++) {
    let lo = 0;
    let hi = right;
    let target = right;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const count = right - mid + 1;
      const cost = nums[right] * count - (prefix[right + 1] - prefix[mid]);
      if (cost <= k) {
        target = mid;
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }
    best = Math.max(best, right - target + 1);
  }
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 229. 最高频元素的频数 =====");
console.log("方法1 [1,2,4],5:", maxFrequency([1, 2, 4], 5));
console.log("方法2 [1,2,4],5:", maxFrequency2([1, 2, 4], 5));
console.log("方法1 [1,4,8,13],5:", maxFrequency([1, 4, 8, 13], 5));
console.log("方法2 [1,4,8,13],5:", maxFrequency2([1, 4, 8, 13], 5));
console.log("方法1 [3,9,6],2:", maxFrequency([3, 9, 6], 2));
console.log("方法2 [3,9,6],2:", maxFrequency2([3, 9, 6], 2));

export {};
