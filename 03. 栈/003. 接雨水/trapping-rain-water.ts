// ============================================================
// 003. 接雨水
// ============================================================
// LeetCode 42. Trapping Rain Water
// 给定 n 个非负整数表示每个柱子的高度，计算按此排列的柱子，下雨之后能接多少雨水。

// ------------------------------------------------------------
// 方法1：单调栈
// ------------------------------------------------------------
// 维护一个单调递减栈（存下标），当遇到比栈顶高的柱子时，
// 弹出栈顶作为「底部」，左右边界为新的栈顶和当前下标，计算可接雨水。
// 时间 O(n)，空间 O(n)。
function trap(height: number[]): number {
  const stack: number[] = [];
  let water = 0;
  for (let i = 0; i < height.length; i++) {
    while (stack.length > 0 && height[i] > height[stack[stack.length - 1]]) {
      const bottom = stack.pop()!;
      if (stack.length === 0) break;
      const left = stack[stack.length - 1];
      const w = i - left - 1;
      const h = Math.min(height[left], height[i]) - height[bottom];
      water += w * h;
    }
    stack.push(i);
  }
  return water;
}

// ------------------------------------------------------------
// 方法2：双指针
// ------------------------------------------------------------
// 左右指针向中间靠拢，记录左侧最大值 leftMax 和右侧最大值 rightMax。
// 哪边的最大值更小，就处理哪边。时间 O(n)，空间 O(1)。
function trapTwoPointer(height: number[]): number {
  let left = 0,
    right = height.length - 1;
  let leftMax = 0,
    rightMax = 0,
    water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else water += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else water += rightMax - height[right];
      right--;
    }
  }
  return water;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1 - 栈法:', trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), '期望: 6');
  console.log('测试2 - 栈法:', trap([4, 2, 0, 3, 2, 5]), '期望: 9');
  console.log('测试3 - 双指针:', trapTwoPointer([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), '期望: 6');
}

test();

export {};
