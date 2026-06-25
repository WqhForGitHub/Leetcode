// ============================================================
// 41. 最长和谐子序列
// ============================================================
// LeetCode 594. Longest Harmonious Subsequence
// 给定整数数组 nums，返回最长和谐子序列的长度（最大值和最小值之差正好为1的子序列）。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：哈希表计数（推荐）
function findLHS(nums: number[]): number {
  const count = new Map<number, number>();
  // 统计每个数字出现的次数
  for (const num of nums) {
    count.set(num, (count.get(num) ?? 0) + 1);
  }

  let result = 0;
  // 对每个数字 num，检查 num+1 是否存在，若存在则和谐子序列长度为 count[num] + count[num+1]
  for (const [num, cnt] of count) {
    const nextCnt = count.get(num + 1);
    if (nextCnt !== undefined) {
      result = Math.max(result, cnt + nextCnt);
    }
  }
  return result;
}

// 方法2：排序后遍历
function findLHSSorted(nums: number[]): number {
  nums.sort((a, b) => a - b);

  let result = 0;
  let left = 0;
  // 滑动窗口：维护窗口内最大值与最小值之差 <= 1
  for (let right = 0; right < nums.length; right++) {
    // 当窗口内差值大于 1 时，移动左指针
    while (nums[right] - nums[left] > 1) {
      left++;
    }
    // 当差值正好为 1 时，更新结果
    if (nums[right] - nums[left] === 1) {
      result = Math.max(result, right - left + 1);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 41. 最长和谐子序列 =====");
console.log("哈希表:", findLHS([1, 3, 2, 2, 5, 2, 3, 7])); // 期望结果: 5
console.log("哈希表:", findLHS([1, 2, 3, 4])); // 期望结果: 2
console.log("哈希表:", findLHS([1, 1, 1, 1])); // 期望结果: 0
console.log("排序:", findLHSSorted([1, 3, 2, 2, 5, 2, 3, 7])); // 期望结果: 5
console.log("排序:", findLHSSorted([1, 2, 3, 4])); // 期望结果: 2

export {};
