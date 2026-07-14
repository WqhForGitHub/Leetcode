// ============================================================
// 160. 翻转卡片游戏
// ============================================================
// LeetCode 822. Card Flipping Game
// 有 N 张卡片，正面 fronts[i]、背面 backs[i]。每张卡片可选正面或背面朝上，
// 然后所有卡片展示的一面构成一个数集。无法选择使得某数同时出现在正反两面。
// 求最终数集中最小的可能数。
// 时间复杂度：O(n)；空间复杂度：O(n)

function flipgame(fronts: number[], backs: number[]): number {
  // 哈希集合：正反面相同的数，这些数不可能成为答案
  const impossible = new Set<number>();
  for (let i = 0; i < fronts.length; i++) {
    if (fronts[i] === backs[i]) {
      impossible.add(fronts[i]);
    }
  }

  // 遍历所有正反面，找不在 impossible 中的最小值
  let result = Infinity;
  for (let i = 0; i < fronts.length; i++) {
    if (!impossible.has(fronts[i])) {
      result = Math.min(result, fronts[i]);
    }
    if (!impossible.has(backs[i])) {
      result = Math.min(result, backs[i]);
    }
  }
  return result === Infinity ? 0 : result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 160. 翻转卡片游戏 =====");
console.log(flipgame([1, 2, 4, 4, 7], [1, 3, 4, 1, 3])); // 期望: 2
console.log(flipgame([1], [1])); // 期望: 0
console.log(flipgame([1, 1], [2, 2])); // 期望: 1

export {};
