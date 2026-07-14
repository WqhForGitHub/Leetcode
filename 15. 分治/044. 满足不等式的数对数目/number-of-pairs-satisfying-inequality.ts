// ============================================================
// 044. 满足不等式的数对数目
// ============================================================
// LeetCode 2426. Number of Pairs Satisfying Inequality
// 给定长度相同的数组 nums1、nums2 和整数 diff。统计满足
// 0 <= i < j < n 且 nums1[i] - nums1[j] <= nums2[i] - nums2[j] + diff 的数对 (i, j) 数目。
// 等价变形：令 a[i] = nums1[i] - nums2[i]，则条件变为 a[i] - a[j] <= diff，
// 即 a[i] <= a[j] + diff。
// 时间复杂度：O(n log n), 空间复杂度：O(n)

// 方法1：归并排序分治计数（推荐）
// 在归并合并阶段，对右半每个元素 rj，用双指针统计左半中满足 a[i] <= rj + diff 的个数。
// 递归同时统计左半内部、右半内部的满足对数。时间复杂度 O(n log n)，空间复杂度 O(n)
function numberOfPairs(nums1: number[], nums2: number[], diff: number): number {
  const n: number = nums1.length;
  const a: number[] = new Array<number>(n);
  for (let i: number = 0; i < n; i++) a[i] = nums1[i] - nums2[i];

  let count: number = 0;
  function mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;
    const mid: number = Math.floor(arr.length / 2);
    const left: number[] = mergeSort(arr.slice(0, mid));
    const right: number[] = mergeSort(arr.slice(mid));
    // 统计：对右半每个 rj，左半中 a[i] <= rj + diff 的个数
    let p: number = 0;
    for (let r: number = 0; r < right.length; r++) {
      while (p < left.length && left[p] <= right[r] + diff) p++;
      count += p;
    }
    // 合并两个有序数组（升序，相等时左侧优先，保持稳定）
    const merged: number[] = [];
    let i: number = 0;
    let j: number = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) merged.push(left[i++]);
      else merged.push(right[j++]);
    }
    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);
    return merged;
  }
  mergeSort(a);
  return count;
}

// 方法2：树状数组（BIT）+ 离散化
// 从左到右扫描，BIT 维护已出现的 a 值频次。对每个 j，
// 统计已出现的 a[i] <= a[j] + diff 的个数，再把 a[j] 插入 BIT。
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function numberOfPairsBIT(nums1: number[], nums2: number[], diff: number): number {
  const n: number = nums1.length;
  const a: number[] = new Array<number>(n);
  for (let i: number = 0; i < n; i++) a[i] = nums1[i] - nums2[i];

  // 离散化：所有 a[i] 与 a[i] + diff
  const vals: number[] = [];
  for (let i: number = 0; i < n; i++) {
    vals.push(a[i]);
    vals.push(a[i] + diff);
  }
  const sorted: number[] = [...new Set<number>(vals)].sort((x: number, y: number): number => x - y);
  const rank: Map<number, number> = new Map<number, number>();
  sorted.forEach((v: number, i: number): void => {
    rank.set(v, i + 1);
  });
  const m: number = sorted.length;

  const tree: number[] = new Array<number>(m + 2).fill(0);
  function lowbit(x: number): number {
    return x & -x;
  }
  function update(i: number, d: number): void {
    for (; i <= m; i += lowbit(i)) tree[i] += d;
  }
  function query(i: number): number {
    let s: number = 0;
    for (; i > 0; i -= lowbit(i)) s += tree[i];
    return s;
  }

  let count: number = 0;
  for (let j: number = 0; j < n; j++) {
    // 已插入的 a[i] <= a[j] + diff 的个数
    const qr: number = rank.get(a[j] + diff)!;
    count += query(qr);
    update(rank.get(a[j])!, 1);
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 044. 满足不等式的数对数目 =====");
console.log(numberOfPairs([3, 2, 5], [2, 2, 1], 1)); // 期望结果: 3
console.log(numberOfPairs([3, -1], [-2, 2], -1)); // 期望结果: 0
console.log("--- 方法2测试 ---");
console.log(numberOfPairsBIT([3, 2, 5], [2, 2, 1], 1)); // 期望结果: 3
console.log(numberOfPairsBIT([3, -1], [-2, 2], -1)); // 期望结果: 0

export {};
