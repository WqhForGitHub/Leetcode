// ============================================================
// 109. 破解锁的最少时间 I
// ============================================================
// 给定锁的强度数组 strengths 和初始钥匙强度 k。
// 破坏锁 i 需要花费 |strengths[i] - k| 的时间，破坏后钥匙强度 +1。
// 求破坏所有锁的最少总时间。
// 时间复杂度：O(n!), 空间复杂度：O(n)

// 方法1：回溯（全排列，逐一尝试每个锁）
// 枚举所有破坏顺序，记录最小时间
// 时间复杂度 O(n!), 空间复杂度 O(n)
function findMinimumTime(strengths: number[], k: number): number {
  const n: number = strengths.length;
  const used: boolean[] = new Array(n).fill(false);
  let minTime: number = Infinity;

  function backtrack(pos: number, keyStrength: number, totalTime: number): void {
    if (totalTime >= minTime) return; // 剪枝
    if (pos === n) {
      minTime = Math.min(minTime, totalTime);
      return;
    }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      used[i] = true;
      const cost: number = Math.abs(strengths[i] - keyStrength);
      backtrack(pos + 1, keyStrength + 1, totalTime + cost);
      used[i] = false;
    }
  }

  backtrack(0, k, 0);
  return minTime;
}

// 方法2：状态压缩 DP + 记忆化
// dp[mask] 表示已破坏锁的集合为 mask 时的最小时间
// 时间复杂度 O(2^n * n), 空间复杂度 O(2^n)
function findMinimumTimeDP(strengths: number[], k: number): number {
  const n: number = strengths.length;
  const full: number = (1 << n) - 1;
  const dp: number[] = new Array(1 << n).fill(Infinity);
  dp[0] = 0;

  for (let mask = 0; mask <= full; mask++) {
    if (dp[mask] === Infinity) continue;
    const keyStrength: number = k + popcount(mask);
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) continue;
      const cost: number = Math.abs(strengths[i] - keyStrength);
      const nextMask: number = mask | (1 << i);
      dp[nextMask] = Math.min(dp[nextMask], dp[mask] + cost);
    }
  }
  return dp[full];
}

function popcount(x: number): number {
  let count: number = 0;
  while (x > 0) {
    count += x & 1;
    x >>= 1;
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 109. 破解锁的最少时间 I =====");
console.log(findMinimumTime([3, 1, 1], 2)); // 期望结果: 5
console.log(findMinimumTime([2, 5, 3], 1)); // 期望结果: 9
console.log("--- 方法2测试 ---");
console.log(findMinimumTimeDP([3, 1, 1], 2)); // 期望结果: 5
console.log(findMinimumTimeDP([2, 5, 3], 1)); // 期望结果: 9

export {};
