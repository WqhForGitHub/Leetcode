// ============================================================
// 025. 直线上最多的点数
// ============================================================
// LeetCode 149. Max Points on a Line
// 给定平面上若干点，找出位于同一直线上的最多点数。
// 哈希表存储以每个点为基准的不同斜率对应的点数。
// 时间复杂度：O(n^2)，空间复杂度：O(n)

function maxPoints(points: number[][]): number {
  const n = points.length;
  if (n <= 2) {
    return n;
  }

  let result = 0;

  // 枚举每个点作为基准
  for (let i = 0; i < n; i++) {
    // 哈希表：斜率字符串 -> 该斜率上的点数（不含基准点）
    const slopeMap: Map<string, number> = new Map();
    // 与基准点重合的点数
    let duplicates = 0;
    // 当前基准点下的最大值
    let curMax = 0;

    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const x1 = points[i][0];
      const y1 = points[i][1];
      const x2 = points[j][0];
      const y2 = points[j][1];

      if (x1 === x2 && y1 === y2) {
        // 重合点
        duplicates++;
        continue;
      }

      // 计算斜率的最简分数 dy/dx，统一符号
      let dx = x2 - x1;
      let dy = y2 - y1;
      const g = gcd(Math.abs(dx), Math.abs(dy));
      dx = dx / g;
      dy = dy / g;
      // 统一符号：保证分母为正，避免负号位置不同
      if (dx < 0) {
        dx = -dx;
        dy = -dy;
      } else if (dx === 0) {
        // 垂直线 dx=0，统一 dy 为正
        dy = Math.abs(dy);
      }
      const slopeKey = `${dy}/${dx}`;
      slopeMap.set(slopeKey, (slopeMap.get(slopeKey) || 0) + 1);
      curMax = Math.max(curMax, slopeMap.get(slopeKey)!);
    }
    // 基准点本身 + 该斜率上的点 + 重合点
    result = Math.max(result, curMax + duplicates + 1);
  }

  return result;
}

// 求最大公约数（辗转相除法）
function gcd(a: number, b: number): number {
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 025. 直线上最多的点数 =====");
console.log(
  maxPoints([
    [1, 1],
    [2, 2],
    [3, 3],
  ]),
); // 3
console.log(
  maxPoints([
    [1, 1],
    [3, 2],
    [5, 3],
    [4, 1],
    [2, 3],
    [1, 4],
  ]),
); // 4
console.log(maxPoints([[0, 0]])); // 1
console.log(
  maxPoints([
    [1, 1],
    [1, 1],
    [2, 2],
    [2, 2],
  ]),
); // 4

export {};
