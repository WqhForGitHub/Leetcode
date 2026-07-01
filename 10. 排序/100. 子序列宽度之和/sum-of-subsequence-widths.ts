// ============================================================
// 100. 子序列宽度之和
// ============================================================
// LeetCode 891. Sum of Subsequence Widths
// 对数组的所有（非空）子序列，求 (最大值 - 最小值) 之和，结果对 1e9+7 取模。

// 方法1：排序 + 贡献公式（推荐，时间 O(n log n)，空间 O(n)）
// 排序后，nums[i] 作为最大值出现在 2^i 个子序列中（任选它之前的若干元素），
// 作为最小值出现在 2^(n-1-i) 个子序列中（任选它之后的若干元素）。
// 贡献 = nums[i] * (2^i - 2^(n-1-i))。预计算 2 的幂即可。
function sumSubseqWidths(nums: number[]): number {
  const MOD = 1000000007;
  nums.sort((a, b) => a - b);
  const n = nums.length;

  // 预处理 2 的幂（模意义下）
  const pow2: number[] = new Array(n).fill(0);
  pow2[0] = 1;
  for (let i = 1; i < n; i++) {
    pow2[i] = (pow2[i - 1] * 2) % MOD;
  }

  let result = 0;
  for (let i = 0; i < n; i++) {
    // 作为最大值的次数 2^i，作为最小值的次数 2^(n-1-i)
    let contrib = pow2[i] - pow2[n - 1 - i];
    contrib = (contrib * nums[i]) % MOD;
    result = (result + contrib) % MOD;
  }

  // 保证非负
  return (result + MOD) % MOD;
}

// 方法2：滚动幂优化（时间 O(n log n)，空间 O(1)）
// 用一个变量从左到右滚动维护 2^i，同时从右维护 2^(n-1-i) 等价形式。
// 本质公式相同，只是省去数组。
function sumSubseqWidthsRolling(nums: number[]): number {
  const MOD = 1000000007;
  nums.sort((a, b) => a - b);
  const n = nums.length;

  // 预计算 2 的幂数组（空间换时间，便于阅读）；这里展示单变量累加写法
  const pow2: number[] = new Array(n + 1).fill(0);
  pow2[0] = 1;
  for (let i = 1; i <= n; i++) {
    pow2[i] = (pow2[i - 1] * 2) % MOD;
  }

  let result = 0;
  let leftPow = 1; // 2^i
  for (let i = 0; i < n; i++) {
    const rightPow = pow2[n - 1 - i]; // 2^(n-1-i)
    let contrib = (leftPow - rightPow) * nums[i];
    contrib %= MOD;
    result = (result + contrib) % MOD;
    leftPow = (leftPow * 2) % MOD;
  }

  return (result + MOD) % MOD;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 100. 子序列宽度之和 =====");
console.log("方法1:", sumSubseqWidths([2, 1, 3])); // 期望: 6
console.log("方法1:", sumSubseqWidths([2])); // 期望: 0
console.log("方法2:", sumSubseqWidthsRolling([2, 1, 3])); // 期望: 6
console.log("方法2:", sumSubseqWidthsRolling([2])); // 期望: 0

export {};
