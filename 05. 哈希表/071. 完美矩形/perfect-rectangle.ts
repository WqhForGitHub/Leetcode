// ============================================================
// 071. 完美矩形
// ============================================================
// LeetCode 391. Perfect Rectangle
// 给定一组矩形，判断它们是否恰好覆盖一个矩形区域（无重叠、无间隙）
// 思路：哈希集合记录顶点出现奇偶次数，最终只剩外接矩形四个角；
//       同时所有小矩形面积之和需等于外接矩形面积
// 时间复杂度：O(n)，空间复杂度：O(n)

function isRectangleCover(rectangles: number[][]): boolean {
  let areaSum = 0;
  // 顶点集合：出现偶数次自动抵消，奇数次保留
  const corners = new Set<string>();

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const [x1, y1, x2, y2] of rectangles) {
    // 累计小矩形面积
    areaSum += (x2 - x1) * (y2 - y1);

    // 更新外接矩形边界
    minX = Math.min(minX, x1);
    minY = Math.min(minY, y1);
    maxX = Math.max(maxX, x2);
    maxY = Math.max(maxY, y2);

    // 四个顶点加入/移出集合（模拟异或）
    const pts = [`${x1},${y1}`, `${x1},${y2}`, `${x2},${y1}`, `${x2},${y2}`];
    for (const p of pts) {
      if (corners.has(p)) corners.delete(p);
      else corners.add(p);
    }
  }

  // 面积校验
  const boundingArea = (maxX - minX) * (maxY - minY);
  if (areaSum !== boundingArea) return false;

  // 最终应只剩外接矩形的四个角
  const expected = [
    `${minX},${minY}`,
    `${minX},${maxY}`,
    `${maxX},${minY}`,
    `${maxX},${maxY}`,
  ];
  if (corners.size !== 4) return false;
  for (const p of expected) {
    if (!corners.has(p)) return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 071. 完美矩形 =====");
// 测试 1：5 个小矩形恰好拼成 (1,1)-(4,4) 大矩形
console.log(
  isRectangleCover([
    [1, 1, 3, 3],
    [3, 1, 4, 2],
    [3, 2, 4, 4],
    [1, 3, 2, 4],
    [2, 3, 3, 4],
  ]),
); // 期望输出: true

// 测试 2：存在空隙
console.log(
  isRectangleCover([
    [1, 1, 2, 3],
    [1, 3, 2, 1],
    [3, 1, 4, 2],
    [3, 2, 4, 4],
  ]),
); // 期望输出: false

// 测试 3：存在重叠
console.log(
  isRectangleCover([
    [1, 1, 3, 3],
    [3, 1, 4, 2],
    [1, 3, 2, 4],
    [2, 2, 4, 4],
  ]),
); // 期望输出: false

// 测试 4：单个 2x2 正方形由 4 个 1x1 拼成
console.log(
  isRectangleCover([
    [0, 0, 1, 1],
    [1, 0, 2, 1],
    [0, 1, 1, 2],
    [1, 1, 2, 2],
  ]),
); // 期望输出: true

export {};
