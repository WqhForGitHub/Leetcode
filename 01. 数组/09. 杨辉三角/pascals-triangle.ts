// ============================================================
// 09. 杨辉三角
// ============================================================
// LeetCode 118. Pascal's Triangle
// 给定非负整数 numRows，生成杨辉三角的前 numRows 行。
// 时间复杂度：O(n²)，空间复杂度：O(n²)（n = numRows）

// 方法1：动态规划-逐行计算（推荐）
// 每行首尾为 1，中间元素等于上一行相邻两元素之和
function generate(numRows: number): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < numRows; i++) {
    const row: number[] = new Array(i + 1).fill(1);
    for (let j = 1; j < i; j++) {
      // 当前元素 = 上一行左上方 + 上一行右上方
      row[j] = result[i - 1][j - 1] + result[i - 1][j];
    }
    result.push(row);
  }
  return result;
}

// 方法2：递归
// 利用前 numRows-1 行的结果递归构造第 numRows 行
function generateRecursive(numRows: number): number[][] {
  if (numRows === 0) return [];
  if (numRows === 1) return [[1]];
  // 递归获取前 numRows-1 行
  const prevRows = generateRecursive(numRows - 1);
  const lastRow = prevRows[prevRows.length - 1];
  const newRow: number[] = new Array(numRows).fill(1);
  for (let i = 1; i < numRows - 1; i++) {
    newRow[i] = lastRow[i - 1] + lastRow[i];
  }
  prevRows.push(newRow);
  return prevRows;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 09. 杨辉三角 =====");
console.log("DP法 numRows=5:", generate(5)); // 期望结果 [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
console.log("DP法 numRows=1:", generate(1)); // 期望结果 [[1]]
console.log("DP法 numRows=0:", generate(0)); // 期望结果 []
console.log("递归法 numRows=5:", generateRecursive(5)); // 期望结果 [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
console.log("递归法 numRows=1:", generateRecursive(1)); // 期望结果 [[1]]

export {};
