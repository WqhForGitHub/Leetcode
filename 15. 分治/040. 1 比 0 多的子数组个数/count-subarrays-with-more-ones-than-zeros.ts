// ============================================================
// 040. 1 比 0 多的子数组个数
// ============================================================
// LeetCode 2031. Count Subarrays With More Ones Than Zeros
// 给定二进制数组 nums，统计其中 1 的数量严格大于 0 的数量的子数组个数。
// 结果对 10^9+7 取模。
// 时间复杂度：O(n log n), 空间复杂度：O(n)

const MOD3: number = 1e9 + 7;

// 方法1：前缀和 + 归并排序分治计数（推荐）
// 将 0 替换为 -1，计算前缀和 prefix（prefix[0]=0）。
// 子数组 [l, r] 中 1 比 0 多 等价于 prefix[r] > prefix[l-1]（l<=r，下标基于 1..n）。
// 即统计满足 i < j 且 prefix[i] < prefix[j] 的下标对数。
// 用归并排序在合并时统计，等价于"逆序对"的对偶问题。
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function subarraysWithMoreZerosThanOnes(nums: number[]): number {
  const n: number = nums.length;
  // 前缀和：prefix[0]=0, prefix[i]=prefix[i-1]+(nums[i-1]==1?1:-1)
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i: number = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + (nums[i] === 1 ? 1 : -1);
  }

  // 归并排序，统计 i<j 且 prefix[i]<prefix[j] 的对数
  let count: number = 0;
  function mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;
    const mid: number = Math.floor(arr.length / 2);
    const left: number[] = mergeSort(arr.slice(0, mid));
    const right: number[] = mergeSort(arr.slice(mid));

    // 统计：对于 right 中每个元素，left 中比它小的个数
    let i: number = 0;
    for (let r: number = 0; r < right.length; r++) {
      while (i < left.length && left[i] < right[r]) i++;
      count = (count + i) % MOD3;
    }

    // 合并两个有序数组
    const merged: number[] = [];
    i = 0;
    let j: number = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) merged.push(left[i++]);
      else merged.push(right[j++]);
    }
    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);
    return merged;
  }

  mergeSort(prefix);
  return count;
}

// 方法2：前缀和 + 树状数组（BIT）
// 同样转换为统计 i<j 且 prefix[i]<prefix[j] 的对数。
// 对 prefix 值离散化后，从左到右扫描，BIT 维护已出现前缀值的频次，
// 每次查询严格小于当前前缀值的累计频次并累加。
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function subarraysWithMoreZerosThanOnesBIT(nums: number[]): number {
  const n: number = nums.length;
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i: number = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + (nums[i] === 1 ? 1 : -1);
  }

  // 离散化
  const sorted: number[] = [...new Set(prefix)].sort((a: number, b: number) => a - b);
  const rank: Map<number, number> = new Map<number, number>();
  sorted.forEach((v: number, i: number) => rank.set(v, i + 1));
  const m: number = sorted.length;

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

  let count: number = 0;
  for (const v of prefix) {
    const r: number = rank.get(v)!;
    // 严格小于 v 的累计频次
    count = (count + query(r - 1)) % MOD3;
    update(r, 1);
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 040. 1 比 0 多的子数组个数 =====");
console.log(subarraysWithMoreZerosThanOnes([0, 1, 1, 0, 1])); // 期望结果: 9
console.log(subarraysWithMoreZerosThanOnes([0])); // 期望结果: 0
console.log(subarraysWithMoreZerosThanOnes([1, 0, 1, 0, 1])); // 期望结果: 6
console.log("--- 方法2测试 ---");
console.log(subarraysWithMoreZerosThanOnesBIT([0, 1, 1, 0, 1])); // 期望结果: 9
console.log(subarraysWithMoreZerosThanOnesBIT([0])); // 期望结果: 0
console.log(subarraysWithMoreZerosThanOnesBIT([1, 0, 1, 0, 1])); // 期望结果: 6

export {};
