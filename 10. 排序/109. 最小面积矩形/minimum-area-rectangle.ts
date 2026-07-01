// ============================================================
// 109. 最小面积矩形
// ============================================================
// LeetCode 939. Minimum Area Rectangle
// 给定若干点（整数坐标），找出能组成的、边与坐标轴平行的最小面积矩形，
// 不存在则返回 0。

// 方法1：对角线 + 哈希集合（O(n^2) 时间，O(n) 空间）
// 枚举两点作为对角线（x、y 均不同），检查另两个对角点是否都存在。
function minAreaRect(points: number[][]): number {
  const pointSet = new Set<string>();
  for (const [x, y] of points) {
    pointSet.add(`${x},${y}`);
  }
  let minArea = Infinity;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[j];
      // 必须能构成对角线：不在同一行也不在同一列
      if (x1 !== x2 && y1 !== y2) {
        if (pointSet.has(`${x1},${y2}`) && pointSet.has(`${x2},${y1}`)) {
          const area = Math.abs(x1 - x2) * Math.abs(y1 - y2);
          if (area < minArea) minArea = area;
        }
      }
    }
  }
  return minArea === Infinity ? 0 : minArea;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 109. 最小面积矩形 =====");
console.log(minAreaRect([[1, 1], [1, 3], [3, 1], [3, 3], [2, 2]])); // 期望 4
console.log(minAreaRect([[1, 1], [1, 3], [3, 1], [3, 3], [4, 1], [4, 3]])); // 期望 2
console.log(minAreaRect([[1, 1], [1, 3], [3, 1], [3, 3], [1, 2], [3, 2]])); // 期望 2

export {};
