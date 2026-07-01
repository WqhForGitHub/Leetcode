// ============================================================
// 178. 统计数组中好三元组数目
// ============================================================
// LeetCode 2179. Count Good Triplets in an Array
// 给定两个 [0,1,...,n-1] 的排列 nums1 和 nums2，
// 统计三元组 (x,y,z) 使得在两个数组中都满足 x < y < z（位置递增）。

// 方法1：树状数组（BIT）
function goodTriplets(nums1: number[], nums2: number[]): number {
  const n = nums1.length;
  // pos2[v] = v 在 nums2 中的位置
  const pos2 = new Array(n).fill(0);
  for (let i = 0; i < n; i++) pos2[nums2[i]] = i;

  // mapped[i] = nums1[i] 在 nums2 中的位置
  // 问题转化为：统计三元组 i < j < k 使得 mapped[i] < mapped[j] < mapped[k]
  const mapped = new Array(n).fill(0);
  for (let i = 0; i < n; i++) mapped[i] = pos2[nums1[i]];

  // BIT
  const bit = new Array(n + 1).fill(0);
  function update(i: number, val: number): void {
    for (i++; i <= n; i += i & -i) bit[i] += val;
  }
  function query(i: number): number {
    let sum = 0;
    for (i++; i > 0; i -= i & -i) sum += bit[i];
    return sum;
  }

  // left[i] = i 左侧且 mapped 值小于 mapped[i] 的元素个数
  const left = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    left[i] = query(mapped[i] - 1);
    update(mapped[i], 1);
  }

  // 重置 BIT，从右往左
  bit.fill(0);
  // right[i] = i 右侧且 mapped 值大于 mapped[i] 的元素个数
  const right = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    right[i] = query(n - 1) - query(mapped[i]);
    update(mapped[i], 1);
  }

  let result = 0;
  for (let i = 0; i < n; i++) {
    result += left[i] * right[i];
  }
  return result;
}

// 方法2：归并排序求逆序对变体（仅示意思路）
// 思路类似但用归并排序统计，时间复杂度同为 O(n log n)
// 此处省略，方法1 已是最优解法

// ============================================================
// 测试
// ============================================================
console.log("===== 178. 统计数组中好三元组数目 =====");
console.log("BIT [2,0,1,3],[0,1,2,3]:", goodTriplets([2, 0, 1, 3], [0, 1, 2, 3])); // 1
console.log("BIT [4,0,1,3,2],[4,1,0,2,3]:", goodTriplets([4, 0, 1, 3, 2], [4, 1, 0, 2, 3])); // 4
console.log("BIT [13,14,10,2,12,3,9,11,15,8,4,7,0,6,5,1],[9,2,10,15,12,11,14,8,13,6,4,7,3,5,1,0]:",
  goodTriplets([13, 14, 10, 2, 12, 3, 9, 11, 15, 8, 4, 7, 0, 6, 5, 1], [9, 2, 10, 15, 12, 11, 14, 8, 13, 6, 4, 7, 3, 5, 1, 0])); // 77

export {};
