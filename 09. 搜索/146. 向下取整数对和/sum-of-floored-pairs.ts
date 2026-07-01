// ============================================================
// 146. 向下取整数对和
// ============================================================
// LeetCode 1862. Sum of Floored Pairs
// 对所有数对 (i,j)，求 floor(nums[i]/nums[j]) 之和。

// 方法1：计数 + 前缀和
function sumOfFlooredPairs(nums: number[]): number {
  const mod = 1_000_000_007;
  const maxVal = Math.max(...nums);
  const count = new Array(maxVal + 1).fill(0);
  for (const num of nums) count[num]++;
  // 前缀和
  const prefix = new Array(maxVal + 1).fill(0);
  for (let i = 1; i <= maxVal; i++) {
    prefix[i] = prefix[i - 1] + count[i];
  }
  let result = 0;
  for (let d = 1; d <= maxVal; d++) {
    if (count[d] === 0) continue;
    // 对于除数 d，计算所有 floor(num/d) 的和
    for (let k = 1; k * d <= maxVal; k++) {
      const lo = k * d;
      const hi = Math.min((k + 1) * d - 1, maxVal);
      const cnt = prefix[hi] - prefix[lo - 1];
      result = (result + k * cnt * count[d]) % mod;
    }
  }
  return result;
}

// 方法2：暴力（O(n²)，仅用于验证）
function sumOfFlooredPairsBrute(nums: number[]): number {
  const mod = 1_000_000_007;
  let result = 0;
  for (const a of nums) {
    for (const b of nums) {
      result = (result + Math.floor(a / b)) % mod;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 146. 向下取整数对和 =====");
console.log("计数 [2,5,9]:", sumOfFlooredPairs([2, 5, 9])); // 10
console.log("计数 [7,7,7,7,7,7,7]:", sumOfFlooredPairs([7, 7, 7, 7, 7, 7, 7])); // 49
console.log("暴力 [2,5,9]:", sumOfFlooredPairsBrute([2, 5, 9])); // 10

export {};
