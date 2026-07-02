// ============================================================
// 197. 把箱子放进仓库里 II
// ============================================================
// LeetCode 1580. Put Boxes Into the Warehouse II
// 给定箱子高度数组 boxes 和仓库高度数组 warehouse，
// 可以从仓库两端任意一端放置箱子，仓库每个位置只能放一个箱子，
// 从某一端推进时该方向到当前位置的仓库高度单调递减（取前缀/后缀最小值）。
// 返回最多能放置的箱子数。

// 方法1：箱子降序排序 + 贪心从两端放置（O(n log n + m)）
function maxBoxesInWarehouseII(boxes: number[], warehouse: number[]): number {
  const n = warehouse.length;
  // 预处理从左和从右的前缀最小值
  const leftMin = new Array<number>(n);
  const rightMin = new Array<number>(n);
  leftMin[0] = warehouse[0];
  for (let i = 1; i < n; i++) {
    leftMin[i] = Math.min(leftMin[i - 1], warehouse[i]);
  }
  rightMin[n - 1] = warehouse[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    rightMin[i] = Math.min(rightMin[i + 1], warehouse[i]);
  }

  const sortedBoxes = [...boxes].sort((a, b) => b - a);
  let left = 0;
  let right = n - 1;
  let count = 0;
  for (const box of sortedBoxes) {
    // 选择较高的一端放置
    if (left <= right) {
      if (box <= leftMin[left] && box <= rightMin[right]) {
        // 两端都可行，选择较高的一端
        if (leftMin[left] >= rightMin[right]) {
          count++;
          left++;
        } else {
          count++;
          right--;
        }
      } else if (box <= leftMin[left]) {
        count++;
        left++;
      } else if (box <= rightMin[right]) {
        count++;
        right--;
      }
      // 都不行则跳过此箱子
    } else {
      break;
    }
  }
  return count;
}

// 方法2：箱子降序排序 + 双指针选较大端（O(n log n + m)）
function maxBoxesInWarehouseII2(boxes: number[], warehouse: number[]): number {
  const n = warehouse.length;
  const leftMin = new Array<number>(n);
  const rightMin = new Array<number>(n);
  leftMin[0] = warehouse[0];
  for (let i = 1; i < n; i++) {
    leftMin[i] = Math.min(leftMin[i - 1], warehouse[i]);
  }
  rightMin[n - 1] = warehouse[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    rightMin[i] = Math.min(rightMin[i + 1], warehouse[i]);
  }

  const sortedBoxes = [...boxes].sort((a, b) => b - a);
  let left = 0;
  let right = n - 1;
  let count = 0;
  let i = 0;
  while (i < sortedBoxes.length && left <= right) {
    const box = sortedBoxes[i];
    // 选择当前有效高度较高的一端
    if (leftMin[left] < rightMin[right]) {
      if (box <= rightMin[right]) {
        count++;
        right--;
      }
    } else {
      if (box <= leftMin[left]) {
        count++;
        left++;
      }
    }
    i++;
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 197. 把箱子放进仓库里 II =====");
console.log("方法1:", maxBoxesInWarehouseII([1, 2, 3], [3, 2, 1])); // 3
console.log("方法2:", maxBoxesInWarehouseII2([1, 2, 3], [3, 2, 1])); // 3
console.log("方法1:", maxBoxesInWarehouseII([3, 8, 2], [5, 6, 4])); // 2
console.log("方法2:", maxBoxesInWarehouseII2([3, 8, 2], [5, 6, 4])); // 2

export {};
