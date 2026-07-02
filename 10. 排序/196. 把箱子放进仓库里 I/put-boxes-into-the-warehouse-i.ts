// ============================================================
// 196. 把箱子放进仓库里 I
// ============================================================
// LeetCode 1564. Put Boxes Into the Warehouse I
// 给定箱子高度数组 boxes 和仓库高度数组 warehouse，
// 从左到右依次放置箱子（仓库每个位置高度为从 0 到当前位置的最小值），
// 箱子高度 <= 当前仓库高度才能放置。返回最多能放置的箱子数。

// 方法1：箱子降序排序 + 贪心放置（O(n log n + m)）
function maxBoxesInWarehouse(boxes: number[], warehouse: number[]): number {
  const sortedBoxes = [...boxes].sort((a, b) => b - a);
  let boxIdx = 0;
  let count = 0;
  let minH = Infinity;
  for (let i = 0; i < warehouse.length; i++) {
    minH = Math.min(minH, warehouse[i]);
    // 仓库当前位置的有效高度为 minH
    while (boxIdx < sortedBoxes.length && sortedBoxes[boxIdx] > minH) {
      boxIdx++;
    }
    if (boxIdx < sortedBoxes.length) {
      count++;
      boxIdx++;
    } else {
      break;
    }
  }
  return count;
}

// 方法2：箱子降序排序 + 仓库前缀最小值 + 双指针（O(n log n + m)）
// 两个数组都是非递增的，用双指针匹配
function maxBoxesInWarehouse2(boxes: number[], warehouse: number[]): number {
  const n = warehouse.length;
  // 预处理仓库前缀最小值（非递增）
  const minWarehouse = new Array<number>(n);
  minWarehouse[0] = warehouse[0];
  for (let i = 1; i < n; i++) {
    minWarehouse[i] = Math.min(minWarehouse[i - 1], warehouse[i]);
  }
  const sortedBoxes = [...boxes].sort((a, b) => b - a);
  let boxIdx = 0;
  let count = 0;
  for (let i = 0; i < n && boxIdx < sortedBoxes.length; i++) {
    // 当前箱子放不下时跳过，尝试下一个更小的箱子
    while (boxIdx < sortedBoxes.length && sortedBoxes[boxIdx] > minWarehouse[i]) {
      boxIdx++;
    }
    if (boxIdx < sortedBoxes.length) {
      count++;
      boxIdx++;
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 196. 把箱子放进仓库里 I =====");
console.log("方法1:", maxBoxesInWarehouse([4, 3, 4, 1], [5, 3, 3, 4, 1])); // 3
console.log("方法2:", maxBoxesInWarehouse2([4, 3, 4, 1], [5, 3, 3, 4, 1])); // 3
console.log("方法1:", maxBoxesInWarehouse([1, 2, 3], [3, 2, 1])); // 3
console.log("方法2:", maxBoxesInWarehouse2([1, 2, 3], [3, 2, 1])); // 3
console.log("方法1:", maxBoxesInWarehouse([5, 5, 5], [1, 1, 1])); // 0
console.log("方法2:", maxBoxesInWarehouse2([5, 5, 5], [1, 1, 1])); // 0

export {};
