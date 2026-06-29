// ============================================================
// 056. M 个非重叠子数组最大和 I
// ============================================================
// LeetCode 689. Maximum Sum of M Non-Overlapping Subarrays
// 在数组中选择 m 个长度为 k 的不重叠子数组，使其和最大，返回起始下标。

// ------------------------------------------------------------
// 方法1：动态规划 + 前缀和
// ------------------------------------------------------------
// dp[i][j] = 前 i 个元素中选 j 个子数组的最大和。
// 时间 O(n*m)，空间 O(n*m)。
function maxSumOfMSubarrays1(nums: number[], m: number, k: number): number[] {
  const n = nums.length;
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  const windowSum = (i: number): number => prefix[i + k] - prefix[i];

  // dp[j][i] = 前 i 个位置选 j 个子数组的最大和
  const dp: number[][] = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));
  const path: number[][][] = new Array(m + 1)
    .fill(0)
    .map(() => new Array(n + 1).fill(0).map(() => []));

  for (let j = 1; j <= m; j++) {
    for (let i = k; i <= n; i++) {
      // 不选以 i-k 为起点的子数组
      dp[j][i] = dp[j][i - 1];
      path[j][i] = [...path[j][i - 1]];
      // 选以 i-k 为起点的子数组
      const candidate = dp[j - 1][i - k] + windowSum(i - k);
      if (candidate > dp[j][i]) {
        dp[j][i] = candidate;
        path[j][i] = [...path[j - 1][i - k], i - k];
      }
    }
  }
  return path[m][n];
}

// ------------------------------------------------------------
// 方法2：滑动窗口 + 单调队列优化
// ------------------------------------------------------------
// 对每个 j，用单调队列维护 dp[j-1][i-k] 的最大值。
// 时间 O(n*m)，空间 O(n*m)。
function maxSumOfMSubarrays2(nums: number[], m: number, k: number): number[] {
  const n = nums.length;
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  const windowSum = (i: number): number => prefix[i + k] - prefix[i];

  let prev: number[] = new Array(n + 1).fill(0);
  let prevPath: number[][] = new Array(n + 1).fill(0).map(() => []);

  for (let j = 1; j <= m; j++) {
    const curr: number[] = new Array(n + 1).fill(0);
    const currPath: number[][] = new Array(n + 1).fill(0).map(() => []);
    for (let i = k * j; i <= n; i++) {
      curr[i] = curr[i - 1];
      currPath[i] = [...currPath[i - 1]];
      const candidate = prev[i - k] + windowSum(i - k);
      if (candidate > curr[i]) {
        curr[i] = candidate;
        currPath[i] = [...prevPath[i - k], i - k];
      }
    }
    prev = curr;
    prevPath = currPath;
  }
  return prevPath[n];
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log(
    "测试1:",
    JSON.stringify(maxSumOfMSubarrays1([1, 2, 3, 4, 5, 6, 7, 8], 2, 2)),
    "期望: [0,3] 或类似",
  );
  console.log(
    "测试2:",
    JSON.stringify(maxSumOfMSubarrays1([1, 1, 1, 1, 1], 2, 1)),
    "期望: [0,2] 或类似",
  );
  console.log(
    "测试3:",
    JSON.stringify(maxSumOfMSubarrays2([1, 2, 3, 4, 5, 6, 7, 8], 2, 2)),
    "期望: [0,3] 或类似",
  );
}

test();

export {};
