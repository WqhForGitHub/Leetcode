// ============================================================
// 106. 自整除排列的数量
// ============================================================
// LeetCode 2914. Count of Self-Dividing Permutations
// 统计 1..n 的排列中，满足 perm[i] % i == 0 或 i % perm[i] == 0 的排列数
// 时间复杂度：O(n!), 空间复杂度：O(n)

// 方法1：回溯（推荐）
// 逐位填入数字，检查整除条件，回溯计数
function countSelfDividingPermutations(n: number): number {
  const used: boolean[] = new Array(n + 1).fill(false);
  let count: number = 0;

  function backtrack(pos: number): void {
    if (pos > n) {
      count++;
      return;
    }
    for (let num: number = 1; num <= n; num++) {
      if (!used[num] && (num % pos === 0 || pos % num === 0)) {
        used[num] = true;
        backtrack(pos + 1);
        used[num] = false;
      }
    }
  }

  backtrack(1);
  return count;
}

// 方法2：状态压缩 DP
// dp[mask] 表示使用 mask 对应数字集合的合法排列数
function countSelfDividingPermutations2(n: number): number {
  const dp: number[] = new Array(1 << n).fill(0);
  dp[0] = 1;

  function popcount(x: number): number {
    let c: number = 0;
    while (x) {
      c++;
      x &= x - 1;
    }
    return c;
  }

  for (let mask: number = 0; mask < 1 << n; mask++) {
    if (dp[mask] === 0) continue;
    const pos: number = popcount(mask) + 1; // 下一个填入的位置（1-indexed）
    for (let num: number = 1; num <= n; num++) {
      if (!(mask & (1 << (num - 1)))) {
        if (num % pos === 0 || pos % num === 0) {
          dp[mask | (1 << (num - 1))] += dp[mask];
        }
      }
    }
  }
  return dp[(1 << n) - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 106. 自整除排列的数量 =====");
console.log(countSelfDividingPermutations(2)); // 期望结果: 2
console.log(countSelfDividingPermutations(3)); // 期望结果: 3
console.log("--- 方法2测试 ---");
console.log(countSelfDividingPermutations2(2)); // 期望结果: 2
console.log(countSelfDividingPermutations2(3)); // 期望结果: 3

export {};
