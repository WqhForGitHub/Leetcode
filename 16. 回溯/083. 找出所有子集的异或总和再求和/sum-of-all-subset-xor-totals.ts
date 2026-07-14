// ============================================================
// 083. 找出所有子集的异或总和再求和
// ============================================================
// LeetCode 1863. Sum of All Subset XOR Totals
// 给定数组，求所有子集的异或总和之和。
// 时间复杂度：O(2^n)（回溯）或 O(n)（数学法）。

// 方法1：回溯 (推荐)
// 枚举所有子集，对每个子集计算 XOR 并累加。
// 时间复杂度：O(2^n)，空间复杂度：O(n) 递归栈
function subsetXORSum1(nums: number[]): number {
  let total: number = 0;

  const backtrack = (idx: number, currentXOR: number): void => {
    if (idx === nums.length) {
      total += currentXOR; // 空子集 XOR 为 0，不影响总和
      return;
    }
    // 不选当前元素
    backtrack(idx + 1, currentXOR);
    // 选当前元素
    backtrack(idx + 1, currentXOR ^ nums[idx]);
  };

  backtrack(0, 0);
  return total;
}

// 方法2：数学(按位统计)
// 对每一位 b：若数组中至少有一个元素在该位为 1，则该位对答案贡献 2^b * 2^(n-1)。
// 因为：设 k 个元素在该位为 1，选奇数个的方式有 2^(k-1) 种，其余 n-k 个任意选，
// 共 2^(k-1) * 2^(n-k) = 2^(n-1) 个子集在该位 XOR 为 1。
// 最终答案 = (所有元素的按位或) * 2^(n-1)。
// 时间复杂度：O(n)，空间复杂度：O(1)
function subsetXORSum2(nums: number[]): number {
  const n: number = nums.length;
  let orAll: number = 0;
  for (const x of nums) orAll |= x;
  return orAll * Math.pow(2, n - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 083. 找出所有子集的异或总和再求和 =====");
console.log(subsetXORSum1([1, 3])); // 期望结果: 6
console.log(subsetXORSum1([5, 1, 6])); // 期望结果: 28
console.log(subsetXORSum1([1, 1, 1])); // 期望结果: 4
console.log(subsetXORSum2([1, 3])); // 期望结果: 6
console.log(subsetXORSum2([5, 1, 6])); // 期望结果: 28
console.log(subsetXORSum2([1, 1, 1])); // 期望结果: 4

export {};
