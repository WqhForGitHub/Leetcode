// ============================================================
// 150. 可被三整除的最大和
// ============================================================
// LeetCode 1262. Greatest Sum Divisible by Three
// 从数组中选取若干元素（每个最多选一次），使总和最大且能被 3 整除。

// 方法1：DP 追踪余数（推荐，O(n)）
// dp[r] 表示当前已选元素和中余数为 r 的最大值，转移时把新数加入。
function maxSumDivThree(nums: number[]): number {
  // 初始：余数 0 的和为 0，余数 1、2 暂不可达
  let dp: number[] = [0, -Infinity, -Infinity];
  for (const num of nums) {
    const next: number[] = [...dp];
    for (let r = 0; r < 3; r++) {
      const nr: number = (r + num) % 3;
      next[nr] = Math.max(next[nr], dp[r] + num);
    }
    dp = next;
  }
  return dp[0];
}

// 方法2：贪心 + 按余数排序（O(n log n)）
// 先求总和 sum，若 sum % 3 == 0 直接返回。
// 否则需要从 sum 中减去若干最小元素使总和被 3 整除：
//   - 余 1：减去一个最小的余 1 元素，或两个最小的余 2 元素；
//   - 余 2：减去一个最小的余 2 元素，或两个最小的余 1 元素。
function maxSumDivThree2(nums: number[]): number {
  let sum: number = 0;
  const r1: number[] = [];
  const r2: number[] = [];
  for (const num of nums) {
    sum += num;
    const r: number = num % 3;
    if (r === 1) r1.push(num);
    else if (r === 2) r2.push(num);
  }
  r1.sort((a, b) => a - b);
  r2.sort((a, b) => a - b);

  const rem: number = sum % 3;
  if (rem === 0) return sum;

  let remove: number = Infinity;
  if (rem === 1) {
    if (r1.length >= 1) remove = Math.min(remove, r1[0]);
    if (r2.length >= 2) remove = Math.min(remove, r2[0] + r2[1]);
  } else {
    // rem === 2
    if (r2.length >= 1) remove = Math.min(remove, r2[0]);
    if (r1.length >= 2) remove = Math.min(remove, r1[0] + r1[1]);
  }
  return remove === Infinity ? 0 : sum - remove;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 150. 可被三整除的最大和 =====");
console.log("方法1:", maxSumDivThree([3, 6, 5, 1, 8])); // 期望: 18
console.log("方法1:", maxSumDivThree([4])); // 期望: 0
console.log("方法1:", maxSumDivThree([1, 2, 3, 4, 4])); // 期望: 12
console.log("方法2:", maxSumDivThree2([3, 6, 5, 1, 8])); // 期望: 18
console.log("方法2:", maxSumDivThree2([4])); // 期望: 0
console.log("方法2:", maxSumDivThree2([1, 2, 3, 4, 4])); // 期望: 12

export {};
