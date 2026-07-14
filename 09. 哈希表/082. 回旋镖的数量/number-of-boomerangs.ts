// ============================================================
// 082. 回旋镖的数量
// ============================================================
// LeetCode 447. Number of Boomerangs
// 给定平面上 n 个点，找出回旋镖 (i, j, k) 的数量，使得 dist(i,j) == dist(i,k) 且 j != k
// 思路：以每个点为中心，用哈希表统计到其他点各距离的数量，对每个距离计数 n 贡献 n*(n-1)
// 时间复杂度：O(n^2)，空间复杂度：O(n)

function numberOfBoomerangs(points: number[][]): number {
  let result = 0;

  for (let i = 0; i < points.length; i++) {
    // 哈希表：距离平方 -> 该距离的点数
    const distMap = new Map<number, number>();

    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      const dx = points[i][0] - points[j][0];
      const dy = points[i][1] - points[j][1];
      // 用距离平方避免浮点误差
      const dist = dx * dx + dy * dy;
      distMap.set(dist, (distMap.get(dist) ?? 0) + 1);
    }

    // 对于每个距离有 count 个点，排列数为 count * (count - 1)
    for (const count of distMap.values()) {
      result += count * (count - 1);
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 082. 回旋镖的数量 =====");
console.log(
  numberOfBoomerangs([
    [0, 0],
    [1, 0],
    [2, 0],
  ]),
); // 期望输出: 2
console.log(
  numberOfBoomerangs([
    [1, 1],
    [2, 2],
    [3, 3],
  ]),
); // 期望输出: 2
console.log(numberOfBoomerangs([[1, 1]])); // 期望输出: 0

export {};
