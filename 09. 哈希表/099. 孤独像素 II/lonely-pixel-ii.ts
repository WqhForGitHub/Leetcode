// ============================================================
// 099. 孤独像素 II
// ============================================================
// LeetCode 533. Lonely Pixel II
// 给定一个由 'B' 和 'W' 组成的图片矩阵和目标列 N，
// 找出满足以下所有条件的孤独黑色像素数量：
// 1. picture[i][j] == 'B'
// 2. 第 i 行中 'B' 的数量等于 N
// 3. 第 j 列中 'B' 的数量等于 N
// 4. 第 j 列中所有 'B' 所在的行，其 'B' 的排列模式完全一致
// 时间复杂度：O(m*n)，空间复杂度：O(m+n)

function findBlackPixel(picture: string[][], target: number): number {
  const m = picture.length;
  const n = picture[0].length;

  // 哈希表统计每行、每列的黑色像素数量
  const rowCount = new Array<number>(m).fill(0);
  const colCount = new Array<number>(n).fill(0);
  // 将每行转为字符串作为模式签名，便于比较
  const rowPattern = picture.map((row) => row.join(""));

  // 统计行列的 'B' 数量
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (picture[i][j] === "B") {
        rowCount[i]++;
        colCount[j]++;
      }
    }
  }

  let lonely = 0;
  // 遍历每个像素，检查孤独像素的四个条件
  for (let i = 0; i < m; i++) {
    // 条件 2：第 i 行 'B' 的数量必须等于 target
    if (rowCount[i] !== target) continue;
    for (let j = 0; j < n; j++) {
      if (picture[i][j] !== "B") continue;
      // 条件 3：第 j 列 'B' 的数量必须等于 target
      if (colCount[j] !== target) continue;
      // 条件 4：第 j 列中所有 'B' 所在行的模式必须一致
      let samePattern = true;
      for (let r = 0; r < m; r++) {
        if (picture[r][j] === "B") {
          if (rowPattern[r] !== rowPattern[i]) {
            samePattern = false;
            break;
          }
        }
      }
      if (samePattern) lonely++;
    }
  }
  return lonely;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 099. 孤独像素 II =====");
// 测试 1:
//  [['W','B','W','B','B','W'],
//   ['W','B','W','B','B','W'],
//   ['W','B','W','B','B','W'],
//   ['W','W','B','W','B','W']], target=3 -> 6
console.log(
  findBlackPixel(
    [
      ["W", "B", "W", "B", "B", "W"],
      ["W", "B", "W", "B", "B", "W"],
      ["W", "B", "W", "B", "B", "W"],
      ["W", "W", "B", "W", "B", "W"],
    ],
    3,
  ),
);
// 期望: 6
// 测试 2:
//  [['B','W','B'],
//   ['W','B','W'],
//   ['B','W','B']], target=2 -> 0
console.log(
  findBlackPixel(
    [
      ["B", "W", "B"],
      ["W", "B", "W"],
      ["B", "W", "B"],
    ],
    2,
  ),
);
// 期望: 0

export {};
