// ============================================================
// 015. 最大矩形
// ============================================================
// LeetCode 85. Maximal Rectangle
// 给定一个二维二进制矩阵，其中只包含 '0' 和 '1'，找出只包含 '1' 的最大矩形面积。
// 时间复杂度 O(mn)，空间复杂度 O(n)

// 方法1：DP + 单调栈（推荐）
// 对每一行，将问题转化为柱状图最大矩形问题
// heights[j] 表示以第 i 行为底，第 j 列连续 '1' 的高度
// 对每一行的 heights 数组使用单调栈求最大矩形面积
// 时间复杂度 O(mn)，空间复杂度 O(n)
function maximalRectangle(matrix: string[][]): number {
  if (matrix.length === 0 || matrix[0].length === 0) return 0;

  const m: number = matrix.length;
  const n: number = matrix[0].length;
  // heights[j] 表示第 j 列的连续高度
  const heights: number[] = new Array<number>(n).fill(0);
  let maxArea: number = 0;

  for (let i: number = 0; i < m; i++) {
    // 更新每列的高度
    for (let j: number = 0; j < n; j++) {
      if (matrix[i][j] === "1") {
        heights[j] += 1; // 连续1，高度+1
      } else {
        heights[j] = 0; // 遇到0，高度归零
      }
    }
    // 对当前行的柱状图求最大矩形面积
    const area: number = largestRectangleArea(heights);
    maxArea = Math.max(maxArea, area);
  }

  return maxArea;
}

// 单调栈求柱状图最大矩形面积
function largestRectangleArea(heights: number[]): number {
  const n: number = heights.length;
  // 栈中存放下标，保持对应高度单调递增
  const stack: number[] = [];
  let maxArea: number = 0;

  for (let i: number = 0; i <= n; i++) {
    // 当前高度（最后一个位置高度为0，确保栈清空）
    const curHeight: number = i === n ? 0 : heights[i];
    // 当当前高度小于栈顶高度时，弹出栈顶并计算面积
    while (stack.length > 0 && curHeight < heights[stack[stack.length - 1]]) {
      const h: number = heights[stack.pop()!];
      // 宽度 = 当前位置 - 栈顶新元素位置 - 1
      const w: number = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, h * w);
    }
    stack.push(i);
  }

  return maxArea;
}

// 方法2：DP - 记录每个点左边连续1的个数
// left[j] 表示当前行第 j 列左边连续1的个数（含自身）
// 对每个位置，向上扩展，计算以该位置为右下角的最大矩形面积
// 时间复杂度 O(mn)，空间复杂度 O(n)
function maximalRectangle2(matrix: string[][]): number {
  if (matrix.length === 0 || matrix[0].length === 0) return 0;

  const m: number = matrix.length;
  const n: number = matrix[0].length;
  // left[j] 表示当前行第 j 列左边连续1的个数
  const left: number[] = new Array<number>(n).fill(0);
  // right[j] 表示当前行第 j 列右边连续1的右边界（不含）
  const right: number[] = new Array<number>(n).fill(n);
  // height[j] 表示当前行第 j 列的高度
  const height: number[] = new Array<number>(n).fill(0);
  let maxArea: number = 0;

  for (let i: number = 0; i < m; i++) {
    let curLeft: number = 0;
    let curRight: number = n;

    // 更新 height 数组
    for (let j: number = 0; j < n; j++) {
      if (matrix[i][j] === "1") {
        height[j] += 1;
      } else {
        height[j] = 0;
      }
    }

    // 更新 left 数组（从左到右）
    for (let j: number = 0; j < n; j++) {
      if (matrix[i][j] === "1") {
        left[j] = Math.max(left[j], curLeft);
      } else {
        left[j] = 0;
        curLeft = j + 1;
      }
    }

    // 更新 right 数组（从右到左）
    for (let j: number = n - 1; j >= 0; j--) {
      if (matrix[i][j] === "1") {
        right[j] = Math.min(right[j], curRight);
      } else {
        right[j] = n;
        curRight = j;
      }
    }

    // 计算最大面积
    for (let j: number = 0; j < n; j++) {
      const area: number = (right[j] - left[j]) * height[j];
      maxArea = Math.max(maxArea, area);
    }
  }

  return maxArea;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 015. 最大矩形 =====");
console.log(
  maximalRectangle([
    ["1", "0", "1", "0", "0"],
    ["1", "0", "1", "1", "1"],
    ["1", "1", "1", "1", "1"],
    ["1", "0", "0", "1", "0"],
  ]),
); // 期望结果: 6
console.log(maximalRectangle([["0"]])); // 期望结果: 0
console.log(maximalRectangle([["1"]])); // 期望结果: 1
console.log(
  maximalRectangle2([
    ["1", "0", "1", "0", "0"],
    ["1", "0", "1", "1", "1"],
    ["1", "1", "1", "1", "1"],
    ["1", "0", "0", "1", "0"],
  ]),
); // 期望结果: 6

export {};
