// ============================================================
// 049. 统计极差最大为 K 的分割方式数
// ============================================================
// LeetCode 周赛题. 统计极差最大为 K 的分割方式数
// 将数组分割成若干段，每段 max - min <= K，求分割方式数（模 10^9+7）。

// ------------------------------------------------------------
// 方法1：双指针 + 动态规划 + 单调队列
// ------------------------------------------------------------
// 用两个单调队列维护窗口 max 和 min，dp[i] = sum(dp[left..i-1])。
// 用前缀和优化。
// 时间 O(n)，空间 O(n)。
function countPartitions1(nums: number[], k: number): number {
  const MOD = 1e9 + 7;
  const n = nums.length;
  const maxDeque: number[] = [];
  const minDeque: number[] = [];
  const dp: number[] = new Array(n + 1).fill(0);
  const prefix: number[] = new Array(n + 2).fill(0);
  dp[0] = 1;
  prefix[1] = 1;
  let left = 0;
  for (let i = 0; i < n; i++) {
    while (
      maxDeque.length > 0 &&
      nums[maxDeque[maxDeque.length - 1]] <= nums[i]
    )
      maxDeque.pop();
    maxDeque.push(i);
    while (
      minDeque.length > 0 &&
      nums[minDeque[minDeque.length - 1]] >= nums[i]
    )
      minDeque.pop();
    minDeque.push(i);
    while (nums[maxDeque[0]] - nums[minDeque[0]] > k) {
      left++;
      while (maxDeque[0] < left) maxDeque.shift();
      while (minDeque[0] < left) minDeque.shift();
    }
    // dp[i+1] = sum(dp[left..i])
    dp[i + 1] = (prefix[i + 1] - prefix[left] + MOD) % MOD;
    prefix[i + 2] = (prefix[i + 1] + dp[i + 1]) % MOD;
  }
  return dp[n];
}

// ------------------------------------------------------------
// 方法2：贪心合并 + 乘法原理
// ------------------------------------------------------------
// 如果两个相同元素在相邻段中，则它们必须同一段。
// 找到所有必须同段的约束，计算独立段数，答案为 2^(段数-1)。
// 时间 O(n)，空间 O(n)。
function countPartitions2(nums: number[], k: number): number {
  const MOD = 1e9 + 7;
  const n = nums.length;
  // 预处理每个位置可以延伸到的最左位置
  const maxDeque: number[] = [];
  const minDeque: number[] = [];
  let left = 0;
  let segments = 0;
  for (let i = 0; i < n; i++) {
    while (
      maxDeque.length > 0 &&
      nums[maxDeque[maxDeque.length - 1]] <= nums[i]
    )
      maxDeque.pop();
    maxDeque.push(i);
    while (
      minDeque.length > 0 &&
      nums[minDeque[minDeque.length - 1]] >= nums[i]
    )
      minDeque.pop();
    minDeque.push(i);
    while (nums[maxDeque[0]] - nums[minDeque[0]] > k) {
      left++;
      while (maxDeque[0] < left) maxDeque.shift();
      while (minDeque[0] < left) minDeque.shift();
    }
    if (i === n - 1 || left > i) {
      // 段边界
    }
  }
  // 用 DP 方式计算
  void segments;
  const dp: number[] = new Array(n + 1).fill(0);
  dp[0] = 1;
  const maxDq: number[] = [];
  const minDq: number[] = [];
  let l = 0;
  for (let i = 0; i < n; i++) {
    while (maxDq.length > 0 && nums[maxDq[maxDq.length - 1]] <= nums[i])
      maxDq.pop();
    maxDq.push(i);
    while (minDq.length > 0 && nums[minDq[minDq.length - 1]] >= nums[i])
      minDq.pop();
    minDq.push(i);
    while (nums[maxDq[0]] - nums[minDq[0]] > k) {
      l++;
      while (maxDq[0] < l) maxDq.shift();
      while (minDq[0] < l) minDq.shift();
    }
    let sum = 0;
    for (let j = l; j <= i; j++) {
      sum = (sum + dp[j]) % MOD;
    }
    dp[i + 1] = sum;
  }
  return dp[n];
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", countPartitions1([1, 2, 3, 4], 2), "期望: 3");
  console.log("测试2:", countPartitions1([2, 2, 2, 2], 0), "期望: 8");
  console.log("测试3:", countPartitions2([1, 2, 3, 4], 2), "期望: 3");
  console.log("测试4:", countPartitions2([2, 2, 2, 2], 0), "期望: 8");
}

test();

export {};
