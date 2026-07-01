// ============================================================
// 099. 公平的糖果交换
// ============================================================
// LeetCode 888. Fair Candy Swap
// Alice 和 Bob 各自交换一颗糖果后两人糖果总数相等，返回 [Alice给出, Bob给出]。
// 设总和 SA、SB，交换 a、b 满足 SA - a + b = SB - b + a，
// 即 a - b = (SA - SB) / 2。

// 方法1：哈希集合（推荐，时间 O(n + m)，空间 O(m)）
// 把 Bob 的糖果放入集合，遍历 Alice 每颗糖果 a，查 b = a - diff 是否在集合中。
function fairCandySwap(aliceSizes: number[], bobSizes: number[]): number[] {
  const sumA = aliceSizes.reduce((s, x) => s + x, 0);
  const sumB = bobSizes.reduce((s, x) => s + x, 0);
  const diff = (sumA - sumB) / 2; // a - b = diff

  const bobSet = new Set<number>(bobSizes);
  for (const a of aliceSizes) {
    const b = a - diff;
    if (bobSet.has(b)) {
      return [a, b];
    }
  }
  return [];
}

// 方法2：排序 + 双指针（时间 O(n log n + m log m)，空间 O(log n + log m)）
// 两数组排序后，用双指针寻找 a - b == diff 的一对。
function fairCandySwapTwoPointers(aliceSizes: number[], bobSizes: number[]): number[] {
  const sumA = aliceSizes.reduce((s, x) => s + x, 0);
  const sumB = bobSizes.reduce((s, x) => s + x, 0);
  const diff = (sumA - sumB) / 2;

  const a = [...aliceSizes].sort((x, y) => x - y);
  const b = [...bobSizes].sort((x, y) => x - y);

  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    const delta = a[i] - b[j];
    if (delta === diff) {
      return [a[i], b[j]];
    } else if (delta < diff) {
      i++; // 需要 a 更大
    } else {
      j++; // 需要 b 更大
    }
  }
  return [];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 099. 公平的糖果交换 =====");
console.log("方法1:", fairCandySwap([1, 1], [2, 2])); // 期望: [1,2]
console.log("方法1:", fairCandySwap([1, 2], [2, 3])); // 期望: [1,2]
console.log("方法1:", fairCandySwap([2], [1, 3])); // 期望: [2,3]
console.log("方法2:", fairCandySwapTwoPointers([1, 1], [2, 2])); // 期望: [1,2]
console.log("方法2:", fairCandySwapTwoPointers([1, 2, 5], [2, 4])); // 期望: [5,4]

export {};
