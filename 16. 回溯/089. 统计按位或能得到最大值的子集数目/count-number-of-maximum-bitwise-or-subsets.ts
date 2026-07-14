// ============================================================
// 089. 统计按位或能得到最大值的子集数目
// ============================================================
// LeetCode 2044. Count Number of Maximum Bitwise-OR Subsets
// 给定数组 nums，求按位或能得到最大值的非空子集数目。
// 时间复杂度：O(2^n), 空间复杂度：O(n)

// 方法1：回溯 (推荐)
// 对每个元素选/不选，记录当前 OR 值，到达末尾统计达到最大 OR 的子集数。
// 时间复杂度 O(2^n), 空间复杂度 O(n)
function countMaxOrSubsets(nums: number[]): number {
  // 全数组的 OR 一定是最大值
  let maxOr: number = 0;
  for (const x of nums) maxOr |= x;
  let count: number = 0;
  const n: number = nums.length;

  const backtrack = (idx: number, cur: number): void => {
    if (idx === n) {
      if (cur === maxOr) count++;
      return;
    }
    // 不选
    backtrack(idx + 1, cur);
    // 选
    backtrack(idx + 1, cur | nums[idx]);
  };

  backtrack(0, 0);
  return count;
}

// 方法2：位掩码枚举
// 枚举所有非空子集，计算其 OR 值，统计等于最大 OR 的数目。
// 时间复杂度 O(2^n * n), 空间复杂度 O(1)
function countMaxOrSubsets2(nums: number[]): number {
  let maxOr: number = 0;
  for (const x of nums) maxOr |= x;
  const n: number = nums.length;
  let count: number = 0;
  for (let mask = 1; mask < 1 << n; mask++) {
    let cur: number = 0;
    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) cur |= nums[i];
    }
    if (cur === maxOr) count++;
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 089. 统计按位或能得到最大值的子集数目 =====");
console.log(countMaxOrSubsets([3, 1])); // 期望结果: 2
console.log(countMaxOrSubsets2([3, 1])); // 期望结果: 2
console.log(countMaxOrSubsets([2, 2, 2])); // 期望结果: 7
console.log(countMaxOrSubsets2([2, 2, 2])); // 期望结果: 7

export {};
