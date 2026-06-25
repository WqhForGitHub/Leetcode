// ============================================================
// 10. 杨辉三角 II
// ============================================================
// LeetCode 119. Pascal's Triangle II
// 给定非负整数 rowIndex，返回杨辉三角的第 rowIndex 行（从0开始）。
// 时间复杂度：O(n²)，空间复杂度：O(n)（n = rowIndex）

// 方法1：一维数组原地更新-从后往前（推荐）
// 利用从后往前更新避免覆盖，只需 O(rowIndex) 额外空间
function getRow(rowIndex: number): number[] {
  // 第 rowIndex 行有 rowIndex+1 个元素，初始全为 1
  const row: number[] = new Array(rowIndex + 1).fill(1);
  for (let i = 2; i <= rowIndex; i++) {
    // 从后往前更新，避免覆盖上一行所需数据
    for (let j = i - 1; j > 0; j--) {
      row[j] = row[j] + row[j - 1];
    }
  }
  return row;
}

// 方法2：二维数组
// 完整生成前 rowIndex+1 行，返回最后一行。空间复杂度 O(n²)
function getRow2D(rowIndex: number): number[] {
  if (rowIndex === 0) return [1];
  const triangle: number[][] = [[1]];
  for (let i = 1; i <= rowIndex; i++) {
    const row: number[] = new Array(i + 1).fill(1);
    for (let j = 1; j < i; j++) {
      row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
    }
    triangle.push(row);
  }
  return triangle[rowIndex];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 10. 杨辉三角 II =====");
console.log("一维数组 rowIndex=3:", getRow(3)); // 期望结果 [1,3,3,1]
console.log("一维数组 rowIndex=0:", getRow(0)); // 期望结果 [1]
console.log("一维数组 rowIndex=1:", getRow(1)); // 期望结果 [1,1]
console.log("一维数组 rowIndex=4:", getRow(4)); // 期望结果 [1,4,6,4,1]
console.log("二维数组 rowIndex=3:", getRow2D(3)); // 期望结果 [1,3,3,1]
console.log("二维数组 rowIndex=0:", getRow2D(0)); // 期望结果 [1]
console.log("二维数组 rowIndex=4:", getRow2D(4)); // 期望结果 [1,4,6,4,1]

export {};
