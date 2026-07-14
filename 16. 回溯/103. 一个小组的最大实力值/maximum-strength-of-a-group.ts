// ============================================================
// 103. 一个小组的最大实力值
// ============================================================
// LeetCode 2708. Maximum Strength of a Group
// 给定整数数组，选一个非空子集使其乘积(实力值)最大，返回该最大乘积
// 时间复杂度：O(2^n) 回溯 / O(n log n) 贪心; 空间复杂度：O(n)

// 方法1：回溯 (推荐理解)
// 枚举每个元素选/不选(至少选一个)，维护当前乘积，更新最大值
function maxStrength(nums: number[]): number {
  let result = -Infinity;
  const n = nums.length;

  const backtrack = (idx: number, product: number, picked: boolean): void => {
    if (idx === n) {
      if (picked) result = Math.max(result, product);
      return;
    }
    // 不选当前元素
    backtrack(idx + 1, product, picked);
    // 选当前元素
    backtrack(idx + 1, product * nums[idx], true);
  };

  backtrack(0, 1, false);
  return result;
}

// 方法2：贪心(分类讨论正负零)
// 正数全选；负数按绝对值从大到小成对选取；处理全零/单元素边界
function maxStrength2(nums: number[]): number {
  const n = nums.length;
  if (n === 1) return nums[0]; // 仅一个元素必须选它

  const positives: number[] = [];
  const negatives: number[] = [];
  let hasZero = false;
  for (const x of nums) {
    if (x > 0) positives.push(x);
    else if (x < 0) negatives.push(x);
    else hasZero = true;
  }

  let product = 1;
  let picked = false;
  // 正数全选
  for (const p of positives) {
    product *= p;
    picked = true;
  }
  // 负数升序(绝对值降序)排列，从前向后成对选取
  negatives.sort((a: number, b: number) => a - b);
  for (let i = 0; i + 1 < negatives.length; i += 2) {
    product *= negatives[i] * negatives[i + 1];
    picked = true;
  }
  // 没选任何元素：若有 0 返回 0，否则(仅 n==1 情形)返回唯一元素
  if (!picked) return hasZero ? 0 : nums[0];
  return product;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 103. 一个小组的最大实力值 =====");
console.log(maxStrength([3, -1, -5, 2, 5, -9])); // 期望结果: 1350
console.log(maxStrength([-4, -5, -4])); // 期望结果: 20
console.log("--- 方法2测试 ---");
console.log(maxStrength2([3, -1, -5, 2, 5, -9])); // 期望结果: 1350
console.log(maxStrength2([-4, -5, -4])); // 期望结果: 20

export {};
