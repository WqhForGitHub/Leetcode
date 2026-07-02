// ============================================================
// 089. 带因子的二叉树
// ============================================================
// LeetCode 823. Binary Trees With Factors
// 给定唯一整数数组 arr（均 > 1），统计可以构造的二叉树数量。
// 规则：每个非叶节点的值等于其左右子节点值之积，且两个子节点都必须在 arr 中。
// 返回数量对 10^9 + 7 取模。

// 方法1：排序 + 动态规划 + 哈希表（推荐，O(n^2) 时间，O(n) 空间）
// 先排序，dp[x] 表示以 x 为根的二叉树数量。
// 对每个根 x，自身作为叶子贡献 1；再遍历更小的因子 y，
// 若 y | x 且 z = x / y 也在表中，则 dp[x] += dp[y] * dp[z]。
const MOD823 = 1e9 + 7;

function numFactoredBinaryTrees(arr: number[]): number {
  arr.sort((a, b) => a - b);
  const n = arr.length;
  const dp = new Map<number, number>();
  let total = 0;
  for (let i = 0; i < n; i++) {
    const x = arr[i];
    let count = 1; // 自身作为单节点树
    for (let j = 0; j < i; j++) {
      const y = arr[j];
      if (x % y === 0) {
        const z = x / y;
        if (dp.has(z)) {
          count = (count + ((dp.get(y)! * dp.get(z)!) % MOD823)) % MOD823;
        }
      }
    }
    dp.set(x, count);
    total = (total + count) % MOD823;
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 089. 带因子的二叉树 =====");
console.log("[2,4]:", numFactoredBinaryTrees([2, 4])); // 期望 3
console.log("[2,4,5,10]:", numFactoredBinaryTrees([2, 4, 5, 10])); // 期望 7
console.log("[18,3,6,2]:", numFactoredBinaryTrees([18, 3, 6, 2])); // 期望 12
console.log("[2]:", numFactoredBinaryTrees([2])); // 期望 1

export {};
