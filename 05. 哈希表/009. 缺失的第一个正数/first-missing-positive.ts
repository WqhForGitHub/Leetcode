// ============================================================
// 009. 缺失的第一个正数
// ============================================================
// LeetCode 41. First Missing Positive
// 找未排序数组中缺失的最小正整数。原地哈希 O(n)。
// 将值 x 放到下标 x-1 的位置，再扫描第一个位置不匹配的。
// 时间复杂度：O(n)，空间复杂度：O(1)

function firstMissingPositive(nums: number[]): number {
  const n = nums.length;
  // 原地哈希：把数字 x 放到下标 x-1 处
  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const correct = nums[i] - 1;
      [nums[i], nums[correct]] = [nums[correct], nums[i]];
    }
  }
  // 找到第一个位置不匹配的
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) {
      return i + 1;
    }
  }
  return n + 1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 009. 缺失的第一个正数 =====");
console.log("测试1:", firstMissingPositive([1, 2, 0])); // 预期: 3
console.log("测试2:", firstMissingPositive([3, 4, -1, 1])); // 预期: 2
console.log("测试3:", firstMissingPositive([7, 8, 9, 11, 12])); // 预期: 1
console.log("测试4:", firstMissingPositive([1, 2, 3])); // 预期: 4

export {};
