// ============================================================
// 062. 直线镜像
// ============================================================
// LeetCode 356. Line Reflection
// 给定二维平面上的点集，判断是否存在一条平行于 y 轴的直线，使所有点关于该直线对称。
// 时间复杂度：O(N)，空间复杂度：O(N)

// 点的表示
interface Point {
  x: number;
  y: number;
}

function isReflected(points: number[][]): boolean {
  if (points.length === 0) return true;

  // 找到最左与最右 x，确定对称轴 x = (minX + maxX) / 2
  let minX = Infinity;
  let maxX = -Infinity;
  const pointSet = new Set<string>();
  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    pointSet.add(`${x},${y}`);
  }
  const sum = minX + maxX; // 对称轴 x = sum / 2

  // 对每个点，检查其关于对称轴的镜像点是否在集合中
  for (const [x, y] of points) {
    // 镜像点 x' = sum - x
    const mirrorX = sum - x;
    if (!pointSet.has(`${mirrorX},${y}`)) {
      return false;
    }
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 062. 直线镜像 =====");

// 测试 1：关于 x = 0 对称
// 期望 true
console.log(
  "test1:",
  isReflected([
    [1, 1],
    [-1, 1],
  ]),
); // true

// 测试 2：不对称
// 期望 false
console.log(
  "test2:",
  isReflected([
    [1, 1],
    [-1, -1],
  ]),
); // false

// 测试 3：关于 x = 1 对称（含一个位于轴上的点）
// (0,0)<->(2,0) 互为镜像，(1,1) 在轴上 -> 期望 true
console.log(
  "test3:",
  isReflected([
    [0, 0],
    [2, 0],
    [1, 1],
  ]),
); // true

// 测试 4：空集
// 期望 true
console.log("test4:", isReflected([])); // true

export {};
