// ============================================================
// 057. M 个非重叠子数组最大和 II
// ============================================================
// LeetCode 周赛题. M 个非重叠子数组最大和 II
// 在数组中选择 m 个不重叠子数组（长度任意），使其和最大。

// ------------------------------------------------------------
// 方法1：动态规划 + 单调队列
// ------------------------------------------------------------
// dp[j][i] = 前 i 个元素选 j 个子数组的最大和。
// 选子数组 [p, i-1] 时，dp[j][i] = dp[j-1][p] + sum(p, i-1)。
// 用前缀和转化：dp[j][i] = prefix[i] + max(dp[j-1][p] - prefix[p])。
// 用单调队列或优先队列维护 max(dp[j-1][p] - prefix[p])。
// 时间 O(n*m)，空间 O(n*m)。
function maxSumOfMSubarraysII1(nums: number[], m: number): number {
  const n = nums.length;
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  let prev: number[] = new Array(n + 1).fill(-Infinity);
  for (let i = 0; i <= n; i++) prev[i] = 0;

  for (let j = 1; j <= m; j++) {
    const curr: number[] = new Array(n + 1).fill(-Infinity);
    curr[0] = -Infinity;
    // 维护 max(prev[p] - prefix[p]) for p in [0, i-1]
    let best = -Infinity;
    for (let i = 1; i <= n; i++) {
      // 更新 best with p = i-1
      if (prev[i - 1] !== -Infinity) {
        best = Math.max(best, prev[i - 1] - prefix[i - 1]);
      }
      // 不选 [.., i-1] 结尾的子数组
      curr[i] = curr[i - 1];
      // 选 [p, i-1] 结尾的子数组
      if (best !== -Infinity) {
        curr[i] = Math.max(curr[i], prefix[i] + best);
      }
    }
    prev = curr;
  }
  return prev[n];
}

// ------------------------------------------------------------
// 方法2：动态规划 + 单调队列（允许负数子数组跳过）
// ------------------------------------------------------------
// 子数组可以为空（即不选），用 max(0, ...) 处理。
// 时间 O(n*m)，空间 O(n)。
function maxSumOfMSubarraysII2(nums: number[], m: number): number {
  const n = nums.length;
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  let prev: number[] = new Array(n + 1).fill(0);
  for (let j = 1; j <= m; j++) {
    const curr: number[] = new Array(n + 1).fill(0);
    let best = -Infinity;
    for (let i = 0; i <= n; i++) {
      if (i > 0) {
        curr[i] = curr[i - 1];
        if (best !== -Infinity) {
          curr[i] = Math.max(curr[i], prefix[i] + best);
        }
      }
      // 更新 best
      best = Math.max(best, prev[i] - prefix[i]);
    }
    prev = curr;
  }
  return prev[n];
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", maxSumOfMSubarraysII1([1, 2, 3, 4, 5], 2), "期望: 15");
  console.log("测试2:", maxSumOfMSubarraysII1([-1, -2, -3, -4, -5], 2), "期望: -3");
  console.log("测试3:", maxSumOfMSubarraysII2([1, 2, 3, 4, 5], 2), "期望: 15");
  console.log("测试4:", maxSumOfMSubarraysII2([-1, 2, -3, 4, -5], 2), "期望: 6");
}

test();

export {};
