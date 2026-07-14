// ============================================================
// 022. 杨辉三角
// ============================================================
// LeetCode 118. Pascal's Triangle
// 给定 numRows，生成杨辉三角的前 numRows 行。
// 时间复杂度 O(n²)，空间复杂度 O(n²)

// 方法1：动态规划（推荐）
// dp[i][j] = dp[i-1][j-1] + dp[i-1][j]
// 每行首尾元素为 1
// 时间复杂度 O(n²)，空间复杂度 O(n²)
function generate(numRows: number): number[][] {
  const result: number[][] = [];

  for (let i: number = 0; i < numRows; i++) {
    const row: number[] = new Array<number>(i + 1).fill(1);
    // 中间元素等于上一行相邻两个元素之和
    for (let j: number = 1; j < i; j++) {
      row[j] = result[i - 1][j - 1] + result[i - 1][j];
    }
    result.push(row);
  }

  return result;
}

// 方法2：递推单行构建
// 逐行构建，每行基于上一行计算
// 时间复杂度 O(n²)，空间复杂度 O(n²)
function generate2(numRows: number): number[][] {
  if (numRows === 0) return [];
  const triangle: number[][] = [[1]];

  for (let i: number = 1; i < numRows; i++) {
    const prevRow: number[] = triangle[i - 1];
    const currRow: number[] = [1];
    // 计算中间元素
    for (let j: number = 1; j < prevRow.length; j++) {
      currRow.push(prevRow[j - 1] + prevRow[j]);
    }
    currRow.push(1);
    triangle.push(currRow);
  }

  return triangle;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 022. 杨辉三角 =====");
console.log(generate(5)); // 期望结果: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
console.log(generate(1)); // 期望结果: [[1]]
console.log(generate2(5)); // 期望结果: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
console.log(generate2(1)); // 期望结果: [[1]]
console.log(generate(3)); // 期望结果: [[1],[1,1],[1,2,1]]

export {};
