// ============================================================
// 50. 最长连续递增序列
// ============================================================
// LeetCode 674. Longest Continuous Increasing Subsequence
// 给定未经排序的整数数组，找到最长连续递增子序列的长度。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：一次遍历（推荐）
function findLengthOfLCIS(nums: number[]): number {
  if (nums.length === 0) {
    return 0;
  }

  let maxLen = 1; // 全局最大长度
  let curLen = 1; // 当前递增序列长度

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      // 当前元素严格大于前一个，递增长度 +1
      curLen++;
      if (curLen > maxLen) {
        maxLen = curLen;
      }
    } else {
      // 递增中断，重置当前长度
      curLen = 1;
    }
  }

  return maxLen;
}

// 方法2：滑动窗口
function findLengthOfLCISSlidingWindow(nums: number[]): number {
  if (nums.length === 0) {
    return 0;
  }

  let maxLen = 1;
  let left = 0;

  for (let right = 1; right < nums.length; right++) {
    // 当递增被打破，移动左指针到右指针位置
    if (nums[right] <= nums[right - 1]) {
      left = right;
    }
    // 更新最大窗口长度
    const curLen = right - left + 1;
    if (curLen > maxLen) {
      maxLen = curLen;
    }
  }

  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 50. 最长连续递增序列 =====");
console.log("一次遍历:", findLengthOfLCIS([1, 3, 5, 4, 7])); // 期望结果: 3
console.log("一次遍历:", findLengthOfLCIS([2, 2, 2, 2, 2])); // 期望结果: 1
console.log("一次遍历:", findLengthOfLCIS([1, 3, 5, 7])); // 期望结果: 4
console.log("一次遍历:", findLengthOfLCIS([])); // 期望结果: 0
console.log("滑窗:", findLengthOfLCISSlidingWindow([1, 3, 5, 4, 7])); // 期望结果: 3
console.log("滑窗:", findLengthOfLCISSlidingWindow([2, 2, 2, 2, 2])); // 期望结果: 1
console.log("滑窗:", findLengthOfLCISSlidingWindow([1, 3, 5, 7])); // 期望结果: 4

export {};
