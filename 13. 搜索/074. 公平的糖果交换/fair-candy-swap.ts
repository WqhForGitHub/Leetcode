// ============================================================
// 074. 公平的糖果交换
// ============================================================
// LeetCode 888. Fair Candy Swap
// 两人交换一盒糖果使总糖果数相同，返回交换的糖果大小。

// 方法1：排序 + 二分查找
function fairCandySwap(aliceSizes: number[], bobSizes: number[]): number[] {
  const sumA = aliceSizes.reduce((a, b) => a + b, 0);
  const sumB = bobSizes.reduce((a, b) => a + b, 0);
  const diff = (sumA - sumB) / 2; // alice 需要给出比收到多 diff
  bobSizes.sort((a, b) => a - b);
  for (const a of aliceSizes) {
    const target = a - diff; // bob 需要给的
    let left = 0;
    let right = bobSizes.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (bobSizes[mid] === target) return [a, target];
      if (bobSizes[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
  }
  return [];
}

// 方法2：哈希集合
function fairCandySwapHash(aliceSizes: number[], bobSizes: number[]): number[] {
  const sumA = aliceSizes.reduce((a, b) => a + b, 0);
  const sumB = bobSizes.reduce((a, b) => a + b, 0);
  const diff = (sumA - sumB) / 2;
  const bobSet = new Set(bobSizes);
  for (const a of aliceSizes) {
    const b = a - diff;
    if (bobSet.has(b)) return [a, b];
  }
  return [];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 074. 公平的糖果交换 =====");
console.log("二分 [1,1],[2,2]:", fairCandySwap([1, 1], [2, 2])); // [1,2]
console.log("二分 [1,2],[2,3]:", fairCandySwap([1, 2], [2, 3])); // [1,2]
console.log("哈希 [2],[1,3]:", fairCandySwapHash([2], [1, 3])); // [2,3]

export {};
