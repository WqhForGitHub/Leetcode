// ============================================================
// 130. 通过指令创建有序数组
// ============================================================
// LeetCode 1649. Create Sorted Array through Instructions
// 依次将 instructions 中元素插入有序数组，每次插入代价为 min(小于的个数, 大于的个数)。

// 方法1：树状数组（BIT）
function createSortedArray(instructions: number[]): number {
  const mod = 1_000_000_007;
  const maxVal = Math.max(...instructions);
  const bit = new Array(maxVal + 2).fill(0);

  function update(i: number): void {
    i++;
    while (i < bit.length) {
      bit[i]++;
      i += i & -i;
    }
  }

  function query(i: number): number {
    i++;
    let sum = 0;
    while (i > 0) {
      sum += bit[i];
      i -= i & -i;
    }
    return sum;
  }

  let cost = 0;
  for (let i = 0; i < instructions.length; i++) {
    const val = instructions[i];
    const less = query(val - 1);
    const greater = i - query(val);
    cost = (cost + Math.min(less, greater)) % mod;
    update(val);
  }
  return cost;
}

// 方法2：归并排序思想（线段树/CDQ分治）
function createSortedArrayMerge(instructions: number[]): number {
  const mod = 1_000_000_007;
  const n = instructions.length;
  let cost = 0;
  // 离散化
  const sorted = [...new Set(instructions)].sort((a, b) => a - b);
  const rank = new Map<number, number>();
  sorted.forEach((v, i) => rank.set(v, i + 1));
  const maxRank = sorted.length;
  const bit = new Array(maxRank + 1).fill(0);

  function update(i: number): void {
    while (i <= maxRank) {
      bit[i]++;
      i += i & -i;
    }
  }

  function query(i: number): number {
    let sum = 0;
    while (i > 0) {
      sum += bit[i];
      i -= i & -i;
    }
    return sum;
  }

  for (let i = 0; i < n; i++) {
    const r = rank.get(instructions[i])!;
    const less = query(r - 1);
    const greater = i - query(r);
    cost = (cost + Math.min(less, greater)) % mod;
    update(r);
  }
  return cost;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 130. 通过指令创建有序数组 =====");
console.log("BIT [1,5,6,2]:", createSortedArray([1, 5, 6, 2])); // 1
console.log("BIT [1,2,3,6,5,4]:", createSortedArray([1, 2, 3, 6, 5, 4])); // 3
console.log("BIT [1,3,3,3,2,4,2,5,1]:", createSortedArray([1, 3, 3, 3, 2, 4, 2, 5, 1])); // 4

export {};
