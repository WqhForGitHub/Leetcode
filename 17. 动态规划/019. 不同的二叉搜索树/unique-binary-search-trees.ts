// ============================================================
// 019. 不同的二叉搜索树
// ============================================================
// LeetCode 96. Unique Binary Search Trees
// 给定一个整数 n，求由 1..n 组成的结构不同的二叉搜索树的个数。
// 这是一个经典的卡特兰数问题。
// 时间复杂度 O(n^2) 或 O(n)

// 方法1：动态规划 - 卡特兰数（推荐）
// dp[i] 表示由 i 个节点组成的不同 BST 的个数
// 状态转移：dp[i] = sum(dp[j-1] * dp[i-j]) for j = 1..i
//   以 j 为根，左子树有 j-1 个节点，右子树有 i-j 个节点
// 时间复杂度 O(n^2)，空间复杂度 O(n)
function numTrees(n: number): number {
  if (n <= 1) return 1;

  // dp[i] 表示 i 个节点组成的不同 BST 个数
  const dp: number[] = new Array<number>(n + 1).fill(0);
  dp[0] = 1; // 空树有1种
  dp[1] = 1; // 1个节点有1种

  for (let i: number = 2; i <= n; i++) {
    // 以 j 为根节点，左子树 j-1 个节点，右子树 i-j 个节点
    for (let j: number = 1; j <= i; j++) {
      dp[i] += dp[j - 1] * dp[i - j];
    }
  }

  return dp[n];
}

// 方法2：数学公式 - 卡特兰数通项公式
// C(n) = C(2n, n) / (n + 1)
// 通过递推计算组合数避免溢出
// 时间复杂度 O(n)，空间复杂度 O(1)
function numTrees2(n: number): number {
  if (n <= 1) return 1;

  // 卡特兰数：C(n) = C(2n,n) / (n+1)
  // 利用递推：C(n) = C(n-1) * 2*(2n-1) / (n+1)
  let catalan: number = 1; // C(0) = 1
  for (let i: number = 1; i <= n; i++) {
    // C(i) = C(i-1) * 2 * (2*i - 1) / (i + 1)
    catalan = (catalan * 2 * (2 * i - 1)) / (i + 1);
  }

  return catalan;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 019. 不同的二叉搜索树 =====");
console.log(numTrees(3)); // 期望结果: 5
console.log(numTrees(1)); // 期望结果: 1
console.log(numTrees(4)); // 期望结果: 14
console.log(numTrees2(3)); // 期望结果: 5
console.log(numTrees2(4)); // 期望结果: 14

export {};
