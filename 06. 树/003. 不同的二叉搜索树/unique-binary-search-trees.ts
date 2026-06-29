// ============================================================
// 003. 不同的二叉搜索树
// ============================================================
// LeetCode 96. Unique Binary Search Trees
// 给你一个整数 n，求恰由 n 个节点组成且节点值从 1 到 n 互不相同的不同二叉搜索树有多少种。
// 时间复杂度：O(n^2) DP / O(n) 卡塔兰公式，空间复杂度：O(n)

// 方法1：动态规划（推荐）
// dp[i] = sum(dp[j-1] * dp[i-j]) for j in 1..i
// 以 j 为根，左子树有 j-1 个节点，右子树有 i-j 个节点
function numTrees(n: number): number {
  const dp: number[] = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      dp[i] += dp[j - 1] * dp[i - j];
    }
  }
  return dp[n];
}

// 方法2：卡塔兰数公式
// C(n) = C(2n, n) / (n+1) = (2n)! / ((n+1)! * n!)
// C(n) = C(n-1) * 2*(2n-1) / (n+1)
function numTreesCatalan(n: number): number {
  // 使用递推公式避免阶乘溢出
  let c = 1;
  for (let i = 0; i < n; i++) {
    // C(i+1) = C(i) * 2*(2i+1) / (i+2)
    c = (c * 2 * (2 * i + 1)) / (i + 2);
  }
  return c;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 003. 不同的二叉搜索树 =====");
console.log("n=3 (DP):", numTrees(3)); // 5
console.log("n=1 (DP):", numTrees(1)); // 1
console.log("n=4 (DP):", numTrees(4)); // 14
console.log("n=5 (DP):", numTrees(5)); // 42
console.log("n=3 (Catalan):", numTreesCatalan(3)); // 5
console.log("n=4 (Catalan):", numTreesCatalan(4)); // 14
console.log("n=5 (Catalan):", numTreesCatalan(5)); // 42

export {};
