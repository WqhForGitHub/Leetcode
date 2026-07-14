// ============================================================
// 49. 图片平滑器
// ============================================================
// LeetCode 661. Image Smoother
// 给定 m x n 整数矩阵 img，对每个单元格，将其值替换为周围8个单元格和自身的平均值（向下取整）。
// 时间复杂度：O(m*n)，空间复杂度：O(m*n)（结果数组）

// 方法1：遍历每个格子计算周围平均值（推荐）
function imageSmoother(img: number[][]): number[][] {
  const m = img.length;
  const n = img[0].length;
  // 结果矩阵，避免原地修改影响后续计算
  const result: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));

  // 8 个方向偏移量（含自身共 9 个）
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      let count = 0;
      // 遍历当前格子周围所有有效方向
      for (const [di, dj] of directions) {
        const ni = i + di;
        const nj = j + dj;
        if (ni >= 0 && ni < m && nj >= 0 && nj < n) {
          sum += img[ni][nj];
          count++;
        }
      }
      // 向下取整
      result[i][j] = Math.floor(sum / count);
    }
  }

  return result;
}

// 方法2：位运算原地修改
// 由于 img[i][j] 范围为 0..255，仅占用低 8 位，可利用高 8 位存储平滑后的值
function imageSmootherInPlace(img: number[][]): number[][] {
  const m = img.length;
  const n = img[0].length;

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  // 第一遍：将平滑后的结果写入高 8 位
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      let count = 0;
      for (const [di, dj] of directions) {
        const ni = i + di;
        const nj = j + dj;
        if (ni >= 0 && ni < m && nj >= 0 && nj < n) {
          // 取低 8 位的原始值
          sum += img[ni][nj] & 255;
          count++;
        }
      }
      // 平滑值左移 8 位写入高位
      img[i][j] |= Math.floor(sum / count) << 8;
    }
  }

  // 第二遍：右移 8 位取出平滑结果
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      img[i][j] >>= 8;
    }
  }

  return img;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 49. 图片平滑器 =====");
console.log(
  "遍历:",
  JSON.stringify(
    imageSmoother([
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ]),
  ),
);
// 期望结果: [[0,0,0],[0,0,0],[0,0,0]]
console.log(
  "遍历:",
  JSON.stringify(
    imageSmoother([
      [100, 200, 100],
      [200, 50, 200],
      [100, 200, 100],
    ]),
  ),
);
// 期望结果: [[137,141,137],[141,138,141],[137,141,137]]
console.log(
  "位运算:",
  JSON.stringify(
    imageSmootherInPlace(
      [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ].map((row) => row.slice()),
    ),
  ),
);
// 期望结果: [[0,0,0],[0,0,0],[0,0,0]]
console.log(
  "位运算:",
  JSON.stringify(
    imageSmootherInPlace(
      [
        [100, 200, 100],
        [200, 50, 200],
        [100, 200, 100],
      ].map((row) => row.slice()),
    ),
  ),
);
// 期望结果: [[137,141,137],[141,138,141],[137,141,137]]

export {};
