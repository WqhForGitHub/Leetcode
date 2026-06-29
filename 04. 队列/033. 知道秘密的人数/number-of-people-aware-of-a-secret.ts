// ============================================================
// 033. 知道秘密的人数
// ============================================================
// LeetCode 2327. Number of People Aware of a Secret
// 第 1 天一个人知道秘密，知道秘密后经过 delay 天可以分享给新的人，
// 经过 forget 天后忘记。求第 n 天知道秘密的人数（模 10^9+7）。

// ------------------------------------------------------------
// 方法1：差分数组（队列思想）
// ------------------------------------------------------------
// 用 diff[i] 记录第 i 天新增知道秘密人数的变化，累积求和。
// 时间 O(n * (forget - delay))，空间 O(n)。
function peopleAwareOfSecret1(n: number, delay: number, forget: number): number {
  const MOD = 1e9 + 7;
  const diff: number[] = new Array(n + 2).fill(0);
  diff[1] = 1;
  diff[2] = -1;
  let know = 0;
  let share = 0;
  for (let i = 1; i <= n; i++) {
    share = (share + diff[i] + MOD) % MOD;
    know = (know + diff[i] + MOD) % MOD;
    // 在 i+delay 天开始能分享
    if (i + delay <= n) {
      diff[i + delay] = (diff[i + delay] + share) % MOD;
      if (i + forget <= n) {
        diff[i + forget] = (diff[i + forget] - share + MOD) % MOD;
      }
    }
    // i+forget 天忘记
    if (i + forget <= n + 1) {
      diff[i + forget] = (diff[i + forget] - diff[i] + MOD) % MOD;
    }
  }
  return Math.floor(know);
}

// ------------------------------------------------------------
// 方法2：队列 + 动态规划
// ------------------------------------------------------------
// dp[i] 表示第 i 天新知道秘密的人数，用前缀和优化。
// 时间 O(n)，空间 O(n)。
function peopleAwareOfSecret2(n: number, delay: number, forget: number): number {
  const MOD = 1e9 + 7;
  const dp: number[] = new Array(n + 1).fill(0);
  dp[1] = 1;
  let result = 0;
  for (let i = 2; i <= n; i++) {
    // 第 i 天新知道秘密的人 = sum(dp[i-forget+1 .. i-delay])
    for (let j = Math.max(1, i - forget + 1); j <= i - delay; j++) {
      dp[i] = (dp[i] + dp[j]) % MOD;
    }
  }
  for (let i = Math.max(1, n - forget + 1); i <= n; i++) {
    result = (result + dp[i]) % MOD;
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", peopleAwareOfSecret2(6, 2, 4), "期望: 5");
  console.log("测试2:", peopleAwareOfSecret2(4, 1, 3), "期望: 6");
  console.log("测试3:", peopleAwareOfSecret2(684, 18, 496), "期望: 653668527");
}

test();

export {};
