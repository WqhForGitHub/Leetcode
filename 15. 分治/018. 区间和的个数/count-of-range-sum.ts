// ============================================================
// 018. 区间和的个数
// ============================================================
// LeetCode 327. Count of Range Sum
// 给定整数数组 nums 以及区间 [lower, upper]，
// 返回区间和位于 [lower, upper] 内的子数组个数。
// 时间复杂度：O(n log n), 空间复杂度：O(n)

// 方法1：归并排序（分治）统计前缀和在范围内的个数（推荐）
// 区间和 nums[i..j] = prefix[j+1] - prefix[i]
// 对前缀和数组归并排序，统计跨越左右两半且差值落在 [lower, upper] 的对数
function countRangeSum1(nums: number[], lower: number, upper: number): number {
  const n: number = nums.length;
  if (n === 0) return 0;
  // prefix[i] = nums[0..i-1] 的和，prefix[0] = 0
  const prefix: number[] = new Array(n + 1);
  prefix[0] = 0;
  for (let i: number = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  const temp: number[] = new Array(n + 1);
  return mergeCount(prefix, temp, 0, n, lower, upper);
}

function mergeCount(
  prefix: number[],
  temp: number[],
  left: number,
  right: number,
  lower: number,
  upper: number,
): number {
  if (left >= right) return 0;
  const mid: number = (left + right) >> 1;
  let count: number =
    mergeCount(prefix, temp, left, mid, lower, upper) +
    mergeCount(prefix, temp, mid + 1, right, lower, upper);

  // 统计跨越的对：左半每个 prefix[i]，找右半中满足 lower <= prefix[j]-prefix[i] <= upper 的 j
  let lo: number = mid + 1;
  let hi: number = mid + 1;
  for (let i: number = left; i <= mid; i++) {
    while (lo <= right && prefix[lo] - prefix[i] < lower) lo++;
    while (hi <= right && prefix[hi] - prefix[i] <= upper) hi++;
    count += hi - lo;
  }

  // 归并排序前缀和数组
  let i: number = left;
  let j: number = mid + 1;
  let k: number = left;
  while (i <= mid && j <= right) {
    if (prefix[i] <= prefix[j]) temp[k++] = prefix[i++];
    else temp[k++] = prefix[j++];
  }
  while (i <= mid) temp[k++] = prefix[i++];
  while (j <= right) temp[k++] = prefix[j++];
  for (let t: number = left; t <= right; t++) prefix[t] = temp[t];

  return count;
}

// 方法2：树状数组（离散化）
// 从左往右遍历前缀和，对每个 prefix[j] 查询已加入的 prefix[i] 满足
// prefix[j] - upper <= prefix[i] <= prefix[j] - lower 的个数
function countRangeSum2(nums: number[], lower: number, upper: number): number {
  const n: number = nums.length;
  if (n === 0) return 0;
  const prefix: number[] = new Array(n + 1);
  prefix[0] = 0;
  for (let i: number = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  // 离散化所有可能出现的值：prefix[i]、prefix[i]-lower、prefix[i]-upper
  const values: Set<number> = new Set();
  for (const p of prefix) {
    values.add(p);
    values.add(p - lower);
    values.add(p - upper);
  }
  const sorted: number[] = [...values].sort((a: number, b: number): number => a - b);
  const rank: Map<number, number> = new Map();
  for (let i: number = 0; i < sorted.length; i++) {
    rank.set(sorted[i], i + 1);
  }

  const m: number = sorted.length;
  const tree: number[] = new Array(m + 1).fill(0);

  const add = (i: number): void => {
    while (i <= m) {
      tree[i]++;
      i += i & -i;
    }
  };

  const query = (i: number): number => {
    let s: number = 0;
    while (i > 0) {
      s += tree[i];
      i -= i & -i;
    }
    return s;
  };

  let count: number = 0;
  for (let j: number = 0; j <= n; j++) {
    const lo: number = prefix[j] - upper;
    const hi: number = prefix[j] - lower;
    const rLo: number = rank.get(lo) as number;
    const rHi: number = rank.get(hi) as number;
    count += query(rHi) - query(rLo - 1);
    add(rank.get(prefix[j]) as number);
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 018. 区间和的个数 =====");
console.log("方法1:", countRangeSum1([-2, 5, -1], -2, 2)); // 期望结果: 3
console.log("方法2:", countRangeSum2([-2, 5, -1], -2, 2)); // 期望结果: 3
console.log("方法1:", countRangeSum1([0], 0, 0)); // 期望结果: 1
console.log("方法2:", countRangeSum2([0], 0, 0)); // 期望结果: 1
console.log("方法1:", countRangeSum1([-1, 2, -3, 4, -5], -3, 3)); // 期望结果: 12
console.log("方法2:", countRangeSum2([-1, 2, -3, 4, -5], -3, 3)); // 期望结果: 12
console.log("方法1:", countRangeSum1([1, 2, 3], 1, 3)); // 期望结果: 4
console.log("方法2:", countRangeSum2([1, 2, 3], 1, 3)); // 期望结果: 4

export {};
