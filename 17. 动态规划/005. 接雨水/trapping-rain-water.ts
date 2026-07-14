// ============================================================
// 005. 接雨水
// ============================================================
// LeetCode 42. Trapping Rain Water
// 给定 n 个非负整数表示柱子高度，计算能接多少雨水
// 时间复杂度 O(n)

// 方法1：动态规划（推荐）
// 预处理 leftMax[i] 和 rightMax[i] 数组
// 每个位置能接水量 = min(leftMax[i], rightMax[i]) - height[i]
// 时间复杂度 O(n)，空间复杂度 O(n)
function trap(height: number[]): number {
  const n: number = height.length;
  if (n === 0) return 0;
  // leftMax[i] 表示 height[0..i] 中的最大值
  const leftMax: number[] = new Array<number>(n).fill(0);
  // rightMax[i] 表示 height[i..n-1] 中的最大值
  const rightMax: number[] = new Array<number>(n).fill(0);
  leftMax[0] = height[0];
  for (let i: number = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], height[i]);
  }
  rightMax[n - 1] = height[n - 1];
  for (let i: number = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], height[i]);
  }
  // 每个位置接水量为左右最大值的较小值减去当前高度
  let water: number = 0;
  for (let i: number = 0; i < n; i++) {
    water += Math.min(leftMax[i], rightMax[i]) - height[i];
  }
  return water;
}

// 方法2：双指针（可选第二种解法）
// 左右指针向中间靠拢，维护左侧最大值和右侧最大值
// 较矮的一侧计算水量并移动指针
// 时间复杂度 O(n)，空间复杂度 O(1)
function trap2(height: number[]): number {
  let left: number = 0;
  let right: number = height.length - 1;
  let leftMax: number = 0;
  let rightMax: number = 0;
  let water: number = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      // 左侧较低，水量取决于 leftMax
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        water += leftMax - height[left];
      }
      left++;
    } else {
      // 右侧较低，水量取决于 rightMax
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        water += rightMax - height[right];
      }
      right--;
    }
  }
  return water;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 005. 接雨水 =====");
console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // 期望结果: 6
console.log(trap([4, 2, 0, 3, 2, 5])); // 期望结果: 9
console.log(trap2([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // 期望结果: 6
console.log(trap2([4, 2, 0, 3, 2, 5])); // 期望结果: 9

export {};
