// ============================================================
// 081. N 次操作后的最大分数和
// ============================================================
// LeetCode 1799. Maximize Score After N Operations
// 给定长度为 2n 的数组 nums，进行 n 次操作：每次选两个数移除并将 gcd * 操作序号 加入分数。
// 最大化总分数。
// 时间复杂度：O(2^n * n^2)。

// 计算 gcd
function gcd(a: number, b: number): number {
  while (b > 0) {
    const t: number = a % b;
    a = b;
    b = t;
  }
  return a;
}

// 计算 popcount
function popcount(x: number): number {
  let count: number = 0;
  while (x > 0) {
    count += x & 1;
    x >>= 1;
  }
  return count;
}

// 方法1：回溯+状态压缩 (推荐)
// 用 mask 表示已使用的数字集合，op 为当前操作序号。
// 每次选两个未使用的数字 i, j，得分 op * gcd(nums[i], nums[j])，递归。
// 用记忆化避免重复计算。
// 时间复杂度：O(2^n * n^2)，空间复杂度：O(2^n)
function maxScore1(nums: number[]): number {
  const n: number = nums.length;
  const memo: Map<number, number> = new Map();

  const backtrack = (mask: number, op: number): number => {
    if (op > n / 2) return 0;
    if (memo.has(mask)) return memo.get(mask)!;

    let best: number = 0;
    for (let i: number = 0; i < n; i++) {
      if (mask & (1 << i)) continue;
      for (let j: number = i + 1; j < n; j++) {
        if (mask & (1 << j)) continue;
        const newMask: number = mask | (1 << i) | (1 << j);
        const score: number = op * gcd(nums[i], nums[j]) + backtrack(newMask, op + 1);
        best = Math.max(best, score);
      }
    }
    memo.set(mask, best);
    return best;
  };

  return backtrack(0, 1);
}

// 方法2：状态压缩DP
// dp[mask] 表示已使用 mask 中的数字时能获得的最大分数。
// dp[mask] = max over (i, j) in mask: op * gcd(nums[i], nums[j]) + dp[mask ^ {i,j}]
// 其中 op = popcount(mask) / 2。
// 时间复杂度：O(2^n * n^2)，空间复杂度：O(2^n)
function maxScore2(nums: number[]): number {
  const n: number = nums.length;
  const fullMask: number = (1 << n) - 1;
  const dp: number[] = new Array(1 << n).fill(0);

  // 按状态从小到大处理（保证子状态已计算）
  for (let mask: number = 1; mask <= fullMask; mask++) {
    const bits: number = popcount(mask);
    if (bits % 2 !== 0) continue; // 只处理偶数个 1 的状态
    const op: number = bits / 2;
    let best: number = 0;
    for (let i: number = 0; i < n; i++) {
      if (!(mask & (1 << i))) continue;
      for (let j: number = i + 1; j < n; j++) {
        if (!(mask & (1 << j))) continue;
        const prevMask: number = mask ^ (1 << i) ^ (1 << j);
        const score: number = op * gcd(nums[i], nums[j]) + dp[prevMask];
        best = Math.max(best, score);
      }
    }
    dp[mask] = best;
  }

  return dp[fullMask];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 081. N 次操作后的最大分数和 =====");
console.log(maxScore1([1, 2])); // 期望结果: 1
console.log(maxScore1([3, 4, 6, 8])); // 期望结果: 11
console.log(maxScore1([1, 2, 3, 4, 5, 6])); // 期望结果: 14
console.log(maxScore2([1, 2])); // 期望结果: 1
console.log(maxScore2([3, 4, 6, 8])); // 期望结果: 11
console.log(maxScore2([1, 2, 3, 4, 5, 6])); // 期望结果: 14

export {};
