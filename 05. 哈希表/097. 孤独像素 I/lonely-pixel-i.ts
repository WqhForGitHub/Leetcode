// ============================================================
// 097. 孤独像素 I
// ============================================================
// LeetCode 531. Lonely Pixel I
// 给定一个由 'B' 和 'W' 组成的图片矩阵，找出孤独黑色像素的数量。
// 孤独像素：该 'B' 所在行和所在列都只有它一个 'B'。
// 时间复杂度：O(m*n)，空间复杂度：O(m+n)

function findLonelyPixel(picture: string[][]): number {
  const m = picture.length;
  const n = picture[0].length;
  // 哈希表统计每行、每列的黑色像素数量
  const rowCount = new Array<number>(m).fill(0);
  const colCount = new Array<number>(n).fill(0);

  // 第一次遍历：统计行、列计数
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (picture[i][j] === "B") {
        rowCount[i]++;
        colCount[j]++;
      }
    }
  }

  // 第二次遍历：判断每个 'B' 是否孤独
  let lonely = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (picture[i][j] === "B" && rowCount[i] === 1 && colCount[j] === 1) {
        lonely++;
      }
    }
  }
  return lonely;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 097. 孤独像素 I =====");
// 测试 1:
//  [['W','W','B'],
//   ['W','B','W'],
//   ['B','W','W']] -> 3
console.log(
  findLonelyPixel([
    ["W", "W", "B"],
    ["W", "B", "W"],
    ["B", "W", "W"],
  ]),
);
// 期望: 3
// 测试 2:
//  [['B','B'],
//   ['B','B']] -> 0
console.log(
  findLonelyPixel([
    ["B", "B"],
    ["B", "B"],
  ]),
);
// 期望: 0
// 测试 3:
//  [['B','W','W'],
//   ['W','W','B'],
//   ['W','W','W']] -> 2
console.log(
  findLonelyPixel([
    ["B", "W", "W"],
    ["W", "W", "B"],
    ["W", "W", "W"],
  ]),
);
// 期望: 2

export {};
