// ============================================================
// 085. 最大连续 1 的个数 II
// ============================================================
// LeetCode 487. Max Consecutive Ones II
// 给定二进制数组，允许翻转一个 0 为 1，求最大连续 1 的个数
// 时间复杂度：O(n)

// 方法1：动态规划（推荐）
// prev 记录上一个 0 之前的连续 1 长度
// cur 记录上一个 0 之后的连续 1 长度
// 翻转上一个 0 后，连续长度 = prev + 1 + cur
// 时间复杂度 O(n)，空间复杂度 O(1)
function findMaxConsecutiveOnes(nums: number[]): number {
  let prev: number = 0; // 上一个 0 之前的连续 1 长度
  let cur: number = 0; // 上一个 0 之后的连续 1 长度
  let maxLen: number = 0;

  for (const num of nums) {
    if (num === 1) {
      cur++;
    } else {
      // 遇到新的 0，之前的 cur 变成 prev
      prev = cur;
      cur = 0;
    }
    // 翻转上一个 0：连续长度 = prev + 1（翻转的0）+ cur
    // 若数组中没有 0，prev + cur + 1 会多算 1，用 min 修正
    maxLen = Math.max(maxLen, prev + cur + 1);
  }

  // 若全为 1，则 maxLen 会超过数组长度，取 min 修正
  return Math.min(maxLen, nums.length);
}

// 方法2：滑动窗口
// 维护窗口内最多包含一个 0，窗口长度即为可能的最大连续 1
// 时间复杂度 O(n)，空间复杂度 O(1)
function findMaxConsecutiveOnesWindow(nums: number[]): number {
  let left: number = 0;
  let zeroCount: number = 0; // 窗口内 0 的个数
  let maxLen: number = 0;

  for (let right: number = 0; right < nums.length; right++) {
    if (nums[right] === 0) {
      zeroCount++;
    }
    // 窗口内 0 超过 1 个，左边界右移
    while (zeroCount > 1) {
      if (nums[left] === 0) {
        zeroCount--;
      }
      left++;
    }
    // 窗口 [left..right] 内最多 1 个 0（翻转后全为 1）
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 085. 最大连续 1 的个数 II =====");
console.log(findMaxConsecutiveOnes([1, 0, 1, 1, 0])); // 期望结果: 4
console.log(findMaxConsecutiveOnes([1, 0, 1, 1, 0, 1, 1, 1])); // 期望结果: 6
console.log(findMaxConsecutiveOnes([1, 1, 1])); // 期望结果: 3
console.log(findMaxConsecutiveOnes([0, 0, 0])); // 期望结果: 1
console.log(findMaxConsecutiveOnes([1])); // 期望结果: 1

console.log(findMaxConsecutiveOnesWindow([1, 0, 1, 1, 0])); // 期望结果: 4
console.log(findMaxConsecutiveOnesWindow([1, 0, 1, 1, 0, 1, 1, 1])); // 期望结果: 6
console.log(findMaxConsecutiveOnesWindow([1, 1, 1])); // 期望结果: 3

export {};
