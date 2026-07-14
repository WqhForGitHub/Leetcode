// ============================================================
// 074. 等差数列划分 II - 子序列
// ============================================================
// LeetCode 446. Arithmetic Slices II - Subsequence
// 给定整数数组，返回所有等差子序列（长度>=3）的个数。
// 等差数列：相邻元素差值相同，子序列不要求连续。
// 时间复杂度 O(n^2)

// 方法1：DP - HashMap 记录公差（推荐）
// dp[i] 是一个 Map，dp[i].get(d) 表示以 nums[i] 结尾、公差为 d 的等差子序列（长度>=2）的个数。
// 状态转移：对于 j < i, d = nums[i] - nums[j]
//   - dp[j].get(d) 表示以 nums[j] 结尾、公差为 d 的等差子序列（长度>=2）的个数
//   - 这些子序列加上 nums[i] 后长度>=3，都是有效的等差子序列，加入答案
//   - dp[i].set(d, dp[i].get(d) + dp[j].get(d) + 1)
//     其中 +1 是 nums[j] 和 nums[i] 组成的长度为 2 的等差子序列
// 时间复杂度 O(n^2)，空间复杂度 O(n^2)
function numberOfArithmeticSlices(nums: number[]): number {
  const n: number = nums.length;
  if (n < 3) return 0;
  let count: number = 0;
  // dp[i] 是一个 Map，key 为公差 d，value 为以 nums[i] 结尾、公差为 d 的等差子序列（长度>=2）个数
  const dp: Map<number, number>[] = new Array(n);
  for (let i: number = 0; i < n; i++) {
    dp[i] = new Map<number, number>();
  }
  // 遍历每个元素作为等差子序列的末尾
  for (let i: number = 0; i < n; i++) {
    for (let j: number = 0; j < i; j++) {
      // 计算公差 d = nums[i] - nums[j]
      const d: number = nums[i] - nums[j];
      // dp[j] 中公差为 d 的子序列个数（长度>=2），加上 nums[i] 后长度>=3，计入答案
      const cntJ: number = dp[j].get(d) ?? 0;
      count += cntJ;
      // 更新 dp[i]：加上 dp[j].get(d)（长度>=2 的延伸）加上 1（nums[j], nums[i] 新增长度=2）
      const cntI: number = dp[i].get(d) ?? 0;
      dp[i].set(d, cntI + cntJ + 1);
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 074. 等差数列划分 II - 子序列 =====");
console.log(numberOfArithmeticSlices([2, 4, 6, 8, 10])); // 期望结果: 7
console.log(numberOfArithmeticSlices([7, 7, 7, 7, 7])); // 期望结果: 16
console.log(numberOfArithmeticSlices([0, 1, 2, 3])); // 期望结果: 5
console.log(numberOfArithmeticSlices([1, 2, 3])); // 期望结果: 1
console.log(numberOfArithmeticSlices([1, 1, 1, 1])); // 期望结果: 5

export {};
