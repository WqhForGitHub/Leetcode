// ============================================================
// 19. 汇总区间
// ============================================================
// LeetCode 228. Summary Ranges
// 给定无重复元素的升序整数数组，返回最小范围的有序区间列表。
// 例如 [0,1,2,4,5,7] -> ["0->2","4->5","7"]
// 时间复杂度：O(n)，空间复杂度：O(1)（不计输出空间）

// 方法1：遍历维护区间起点（推荐）
function summaryRanges(nums: number[]): string[] {
  const result: string[] = [];
  if (nums.length === 0) return result;

  let start = nums[0]; // 当前区间起点

  for (let i = 1; i < nums.length; i++) {
    // 不连续（步长不为 1），则结束当前区间
    if (nums[i] !== nums[i - 1] + 1) {
      if (start === nums[i - 1]) {
        result.push(`${start}`); // 区间只有一个数
      } else {
        result.push(`${start}->${nums[i - 1]}`); // 区间有多个数
      }
      start = nums[i]; // 开启新区间
    }
  }

  // 处理最后一个区间
  if (start === nums[nums.length - 1]) {
    result.push(`${start}`);
  } else {
    result.push(`${start}->${nums[nums.length - 1]}`);
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 19. 汇总区间 =====");
console.log("描述:", summaryRanges([0, 1, 2, 4, 5, 7])); // 期望结果: ["0->2","4->5","7"]
console.log("描述:", summaryRanges([0, 2, 3, 4, 6, 8, 9])); // 期望结果: ["0","2->4","6","8->9"]
console.log("描述:", summaryRanges([])); // 期望结果: []
console.log("描述:", summaryRanges([-1])); // 期望结果: ["-1"]
console.log("描述:", summaryRanges([0, 1, 2, 3, 4])); // 期望结果: ["0->4"]

export {};
