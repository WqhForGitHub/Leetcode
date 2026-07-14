// ============================================================
// 005. 柱状图中最大的矩形
// ============================================================
// LeetCode 84. Largest Rectangle in Histogram
// 给定 n 个非负整数，用来表示柱状图中各个柱子的高度。求柱状图中能勾勒出的最大矩形面积。

// ------------------------------------------------------------
// 方法1：单调栈
// ------------------------------------------------------------
// 维护单调递增栈（存下标），当遇到比栈顶小的柱子时，弹出栈顶作为高度，
// 宽度为当前下标到新栈顶下标的距离。最后处理栈中剩余元素。
// 时间 O(n)，空间 O(n)。
function largestRectangleArea(heights: number[]): number {
  const stack: number[] = [];
  let maxArea = 0;
  // 末尾加 0 哨兵，强制清空栈
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
  console.log("测试1:", largestRectangleArea([2, 1, 5, 6, 2, 3]), "期望: 10");
  console.log("测试2:", largestRectangleArea([2, 4]), "期望: 4");
  console.log("测试3:", largestRectangleArea([1]), "期望: 1");
}

test();

export {};
