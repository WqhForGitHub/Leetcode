// ============================================================
// 142. 最高频元素的频数
// ============================================================
// LeetCode 1838. Frequency of the Most Frequent Element
// 最多 k 次操作，每次将元素加1，求最高频元素的频率。

// 方法1：排序 + 滑动窗口
function maxFrequency(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  let left = 0;
  let sum = 0;
  let maxFreq = 1;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    // 窗口内所有元素都变成 nums[right] 需要的操作数
    // = nums[right] * (right - left + 1) - sum
    while (nums[right] * (right - left + 1) - sum > k) {
      sum -= nums[left++];
    }
    maxFreq = Math.max(maxFreq, right - left + 1);
  }
  return maxFreq;
}

// 方法2：排序 + 前缀和 + 二分查找
function maxFrequencyBinary(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  let maxFreq = 1;
  for (let right = 0; right < n; right++) {
    let lo = 0;
    let hi = right;
    let best = right;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      // 将 nums[mid..right] 都变成 nums[right] 需要的操作数
      const ops = nums[right] * (right - mid + 1) - (prefix[right + 1] - prefix[mid]);
      if (ops <= k) {
        best = mid;
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }
    maxFreq = Math.max(maxFreq, right - best + 1);
  }
  return maxFreq;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 142. 最高频元素的频数 =====");
console.log("滑窗 [1,2,4],5:", maxFrequency([1, 2, 4], 5)); // 3
console.log("滑窗 [1,4,8,13],5:", maxFrequency([1, 4, 8, 13], 5)); // 2
console.log("滑窗 [3,9,6],2:", maxFrequency([3, 9, 6], 2)); // 1
console.log("二分 [1,2,4],5:", maxFrequencyBinary([1, 2, 4], 5)); // 3

export {};
