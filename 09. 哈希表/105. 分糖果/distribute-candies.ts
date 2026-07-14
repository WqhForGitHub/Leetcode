// ============================================================
// 105. 分糖果
// ============================================================
// LeetCode 575. Distribute Candies
// 给定长度为 2n 的整数数组，表示 n 种不同类型的糖果，
// 将糖果平均分给弟弟和妹妹（各 n 颗），妹妹最多能拿到多少种不同糖果。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 思路：哈希表统计糖果种类数
// 妹妹最多拿 n 颗，所以最多 n 种；种类数与 n 取较小值
function distributeCandies(candyType: number[]): number {
  const types = new Set<number>();
  for (const c of candyType) {
    types.add(c);
  }
  const n = candyType.length / 2;
  return Math.min(types.size, n);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 105. 分糖果 =====");
// 测试 1
console.log(distributeCandies([1, 1, 2, 2, 3, 3])); // 期望: 3
// 测试 2
console.log(distributeCandies([1, 1, 2, 3])); // 期望: 2
// 测试 3
console.log(distributeCandies([6, 6, 6, 6])); // 期望: 1

export {};
