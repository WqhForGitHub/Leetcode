// ============================================================
// 066. 划分二进制字符串的最小费用
// ============================================================
// LeetCode（竞赛题）. Minimum Cost to Split Binary String
// 给定二进制字符串 s，将其划分为连续非空子串。每个子串的费用为 (0 的个数) * (1 的个数)。
// 求所有划分方案中的最小总费用。必须至少划分为 2 部分。
// 注意：单个字符的子串费用为 0（0 的个数或 1 的个数必有一个为 0），
//       因此当 n >= 2 时逐字符划分总费用为 0，即答案为 0。DP 仍正确处理一般情形。
// 时间复杂度：O(n^2), 空间复杂度：O(n)

// 方法1：动态规划（推荐）
// dp[i] = 将 s[0..i] 划分为 >=1 部分的最小费用
// dp[i] = min(cost(0,i), min_{0<=j<i}(dp[j] + cost(j+1,i)))
// 答案（>=2 部分）= min_{0<=j<=n-2}(dp[j] + cost(j+1, n-1))
// 时间复杂度 O(n^2)，空间复杂度 O(n)
function minCostToSplitBinaryString(s: string): number {
  const n: number = s.length;
  if (n < 2) return 0; // 无法划分为 >=2 部分

  // 前缀和：zeros[i], ones[i] 分别表示 s[0..i-1] 中 0/1 的个数
  const zeros: number[] = new Array<number>(n + 1).fill(0);
  const ones: number[] = new Array<number>(n + 1).fill(0);
  for (let i: number = 0; i < n; i++) {
    zeros[i + 1] = zeros[i] + (s[i] === "0" ? 1 : 0);
    ones[i + 1] = ones[i] + (s[i] === "1" ? 1 : 0);
  }

  function cost(l: number, r: number): number {
    const z: number = zeros[r + 1] - zeros[l];
    const o: number = ones[r + 1] - ones[l];
    return z * o;
  }

  const dp: number[] = new Array<number>(n).fill(0);
  for (let i: number = 0; i < n; i++) {
    dp[i] = cost(0, i); // 整体作为一部分
    for (let j: number = 0; j < i; j++) {
      const cand: number = dp[j] + cost(j + 1, i);
      if (cand < dp[i]) dp[i] = cand;
    }
  }

  // 答案：>=2 部分 = 最后一段切分点 j in [0, n-2]
  let ans: number = Infinity;
  for (let j: number = 0; j <= n - 2; j++) {
    const cand: number = dp[j] + cost(j + 1, n - 1);
    if (cand < ans) ans = cand;
  }
  return ans;
}

// 方法2：分治 + 记忆化（递归版 DP）
// solve(i) = 将 s[0..i] 划分为 >=1 部分的最小费用，按最后一个切分点分治：
// solve(i) = min(cost(0,i), min_{0<=j<i}(solve(j) + cost(j+1,i)))
// 时间复杂度 O(n^2)，空间复杂度 O(n)
function minCostToSplitBinaryStringDC(s: string): number {
  const n: number = s.length;
  if (n < 2) return 0;

  const zeros: number[] = new Array<number>(n + 1).fill(0);
  const ones: number[] = new Array<number>(n + 1).fill(0);
  for (let i: number = 0; i < n; i++) {
    zeros[i + 1] = zeros[i] + (s[i] === "0" ? 1 : 0);
    ones[i + 1] = ones[i] + (s[i] === "1" ? 1 : 0);
  }

  function cost(l: number, r: number): number {
    const z: number = zeros[r + 1] - zeros[l];
    const o: number = ones[r + 1] - ones[l];
    return z * o;
  }

  const memo: number[] = new Array<number>(n).fill(-1);

  function solve(i: number): number {
    if (memo[i] !== -1) return memo[i];
    let best: number = cost(0, i); // 不再切分（作为单一部分）
    for (let j: number = 0; j < i; j++) {
      // 在 j 处做最后一次切分：s[0..j] 递归分治，s[j+1..i] 作为最后一段
      const cand: number = solve(j) + cost(j + 1, i);
      if (cand < best) best = cand;
    }
    memo[i] = best;
    return best;
  }

  // 答案：>=2 部分
  let ans: number = Infinity;
  for (let j: number = 0; j <= n - 2; j++) {
    const cand: number = solve(j) + cost(j + 1, n - 1);
    if (cand < ans) ans = cand;
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 066. 划分二进制字符串的最小费用 =====");
console.log("方法1:");
console.log(minCostToSplitBinaryString("01")); // 期望结果: 0 (切为 "0"|"1")
console.log(minCostToSplitBinaryString("0011")); // 期望结果: 0 (切为 "0"|"0"|"1"|"1")
console.log(minCostToSplitBinaryString("0101")); // 期望结果: 0 (逐字符切分)
console.log(minCostToSplitBinaryString("10")); // 期望结果: 0
console.log(minCostToSplitBinaryString("0110")); // 期望结果: 0
console.log("方法2:");
console.log(minCostToSplitBinaryStringDC("01")); // 期望结果: 0
console.log(minCostToSplitBinaryStringDC("0011")); // 期望结果: 0
console.log(minCostToSplitBinaryStringDC("0101")); // 期望结果: 0
console.log(minCostToSplitBinaryStringDC("10")); // 期望结果: 0
console.log(minCostToSplitBinaryStringDC("0110")); // 期望结果: 0

export {};
