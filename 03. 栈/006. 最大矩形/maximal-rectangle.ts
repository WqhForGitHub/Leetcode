// ============================================================
// 006. 最大矩形
// ============================================================
// LeetCode 85. Maximal Rectangle
// 给定一个仅包含 0 和 1 的二维二进制矩阵，找出只包含 1 的最大矩形，并返回其面积。

// ------------------------------------------------------------
// 方法1：柱状图 + 单调栈
// ------------------------------------------------------------
// 逐行累积高度（遇到 0 高度清零，否则 +1），每一行转化为柱状图，
// 复用「柱状图中最大的矩形」算法求最大面积。
// 时间 O(rows * cols)，空间 O(cols)。
function maximalRectangle(matrix: string[][]): number {
  if (matrix.length === 0 || matrix[0].length === 0) return 0;
  const cols = matrix[0].length;
  const heights = new Array(cols).fill(0);
  let maxArea = 0;
  for (const row of matrix) {
    for (let j = 0; j < cols; j++) {
      heights[j] = row[j] === '1' ? heights[j] + 1 : 0;
    }
    maxArea = Math.max(maxArea, largestRectangleArea(heights));
  }
  return maxArea;
}

// 柱状图最大矩形（单调栈）
function largestRectangleArea(heights: number[]): number {
  const stack: number[] = [];
  let maxArea = 0;
  const arr = [...heights, 0];
  for (let i = 0; i < arr.length; i++) {
    while (stack.length > 0 && arr[i] < arr[stack[stack.length - 1]]) {
      const h = arr[stack.pop()!];
      const w = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, h * w);
    }
    stack.push(i);
  }
  return maxArea;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log(
    '测试1:',
    maximalRectangle([
      ['1', '0', '1', '0', '0'],
      ['1', '0', '1', '1', '1'],
      ['1', '1', '1', '1', '1'],
      ['1', '0', '0', '1', '0'],
    ]),
    '期望: 6',
  );
  console.log('测试2:', maximalRectangle([]), '期望: 0');
  console.log('测试3:', maximalRectangle([['0']]), '期望: 0');
  console.log('测试4:', maximalRectangle([['1']]), '期望: 1');
}

test();

export {};
