// ============================================================
// 092. 优美的排列
// ============================================================
// LeetCode 526. Beautiful Arrangement
// 1 到 n 的排列，第 i 个位置满足 nums[i] 能被 i 整除
// 或 i 能被 nums[i] 整除。求满足条件的排列数。
// 时间复杂度：O(n * 2^n)，空间复杂度：O(2^n)

// 方法1：DP + 位掩码（推荐）
// dp[mask] 表示已使用数字集合为 mask 时的合法排列数
// 时间复杂度 O(n * 2^n)，空间复杂度 O(2^n)
function countArrangement(n: number): number {
  const total: number = 1 << n;
  // dp[mask] 表示已使用数字集合为 mask 时的合法排列数
  const dp: number[] = new Array(total).fill(0);
  dp[0] = 1;

  for (let mask: number = 0; mask < total; mask++) {
    // 计算已使用的数字个数（即当前位置）
    let pos: number = 0;
    for (let i: number = 0; i < n; i++) {
      if (mask & (1 << i)) pos++;
    }
    // 下一个要填的位置是 pos + 1

    for (let i: number = 0; i < n; i++) {
      // 如果数字 i+1 还没被使用
      if ((mask & (1 << i)) === 0) {
        const num: number = i + 1;
        const position: number = pos + 1;
        // 检查是否满足优美排列条件
        if (num % position === 0 || position % num === 0) {
          dp[mask | (1 << i)] += dp[mask];
        }
      }
    }
  }

  return dp[total - 1];
}

// 方法2：回溯 DFS
// 逐个位置尝试放置数字
// 时间复杂度 O(k)，k 为合法排列数，空间复杂度 O(n)
function countArrangementBacktrack(n: number): number {
  let count: number = 0;
  const used: boolean[] = new Array(n + 1).fill(false);

  const backtrack = (pos: number): void => {
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
  };

  backtrack(1);
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 092. 优美的排列 =====");
console.log(countArrangement(2)); // 期望结果: 2
console.log(countArrangement(1)); // 期望结果: 1
console.log(countArrangement(3)); // 期望结果: 3
console.log(countArrangement(4)); // 期望结果: 8
console.log("--- 方法2测试 ---");
console.log(countArrangementBacktrack(2)); // 期望结果: 2
console.log(countArrangementBacktrack(4)); // 期望结果: 8

export {};
