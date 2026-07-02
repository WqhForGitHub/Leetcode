// ============================================================
// 035. 通过指令创建有序数组
// ============================================================
// LeetCode 1649. Create Sorted Array through Instructions
// 给定整数数组 instructions，依次将每个元素插入到有序数组中。
// 每次插入代价 = min(严格小于该数的元素个数, 严格大于该数的元素个数)。
// 返回总代价对 10^9+7 取模的结果。
// 时间复杂度：O(n log m), 空间复杂度：O(m)

const MOD2: number = 1e9 + 7;

// 方法1：树状数组（BIT / Fenwick Tree）（推荐）
// 对值域离散化后，用 BIT 维护已插入元素的出现次数，
// 查询比当前数小的个数与比当前数大的个数，取较小者累加。
// 时间复杂度 O(n log m)，m 为值域大小，空间复杂度 O(m)
function createSortedArray(instructions: number[]): number {
  // 离散化：将值映射到 1..m
  const sorted: number[] = [...new Set(instructions)].sort((a: number, b: number) => a - b);
  const rank: Map<number, number> = new Map<number, number>();
  sorted.forEach((v: number, i: number) => rank.set(v, i + 1));
  const m: number = sorted.length;

  // 树状数组
  const tree: number[] = new Array(m + 2).fill(0);
  function lowbit(x: number): number {
    return x & -x;
  }
  function update(i: number, delta: number): void {
    for (; i <= m; i += lowbit(i)) tree[i] += delta;
  }
  function query(i: number): number {
    let sum: number = 0;
    for (; i > 0; i -= lowbit(i)) sum += tree[i];
    return sum;
  }

  let cost: number = 0;
  let totalInserted: number = 0;
  for (const v of instructions) {
    const r: number = rank.get(v)!;
    const lessCount: number = query(r - 1); // 严格小于 v 的个数
    const greaterCount: number = totalInserted - query(r); // 严格大于 v 的个数
    cost = (cost + Math.min(lessCount, greaterCount)) % MOD2;
    update(r, 1);
    totalInserted++;
  }
  return cost;
}

// 方法2：分治归并排序计数
// 类似计算逆序对的方法，分治统计每次插入时已存在元素中比它小的个数与大的个数。
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function createSortedArrayMerge(instructions: number[]): number {
  const n: number = instructions.length;
  // less[i] = 在 i 之前且严格小于 instructions[i] 的元素个数
  // greater[i] = 在 i 之前且严格大于 instructions[i] 的元素个数
  const less: number[] = new Array(n).fill(0);
  const greater: number[] = new Array(n).fill(0);

  // 带原始索引的元素数组
  const arr: { val: number; idx: number }[] = instructions.map((v: number, i: number) => ({
    val: v,
    idx: i,
  }));

  // 归并排序，统计在前半部分比后半部分当前元素小/大的个数
  function mergeSort(a: { val: number; idx: number }[]): { val: number; idx: number }[] {
    if (a.length <= 1) return a;
    const mid: number = Math.floor(a.length / 2);
    const left: { val: number; idx: number }[] = mergeSort(a.slice(0, mid));
    const right: { val: number; idx: number }[] = mergeSort(a.slice(mid));

    // 先统计：对于 right 中每个元素，left 中比它小的个数
    {
      let i: number = 0;
      for (const r of right) {
        while (i < left.length && left[i].val < r.val) i++;
        less[r.idx] += i;
      }
    }
    // 统计：对于 right 中每个元素，left 中比它大的个数
    {
      let j: number = left.length - 1;
      for (let k: number = right.length - 1; k >= 0; k--) {
        while (j >= 0 && left[j].val > right[k].val) j--;
        greater[right[k].idx] += left.length - 1 - j;
      }
    }

    // 合并两个有序数组
    const merged: { val: number; idx: number }[] = [];
    let i: number = 0;
    let j: number = 0;
    while (i < left.length && j < right.length) {
      if (left[i].val <= right[j].val) merged.push(left[i++]);
      else merged.push(right[j++]);
    }
    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);
    return merged;
  }

  mergeSort(arr);

  let cost: number = 0;
  for (let i: number = 0; i < n; i++) {
    cost = (cost + Math.min(less[i], greater[i])) % MOD2;
  }
  return cost;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 035. 通过指令创建有序数组 =====");
console.log(createSortedArray([1, 5, 6, 2])); // 期望结果: 1
console.log(createSortedArray([1, 2, 3, 6, 5, 4])); // 期望结果: 3
console.log(createSortedArray([1, 3, 3, 3, 2, 3, 2, 2, 2])); // 期望结果: 4
console.log("--- 方法2测试 ---");
console.log(createSortedArrayMerge([1, 5, 6, 2])); // 期望结果: 1
console.log(createSortedArrayMerge([1, 2, 3, 6, 5, 4])); // 期望结果: 3
console.log(createSortedArrayMerge([1, 3, 3, 3, 2, 3, 2, 2, 2])); // 期望结果: 4

export {};
