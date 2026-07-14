// ============================================================
// 024. 区间和的个数
// ============================================================
// LeetCode 327. Count of Range Sum
// 给定整数数组和区间 [lower, upper]，返回区间和在 [lower, upper] 内的子区间个数。

// 方法1：归并排序 + 前缀和（O(n log n)）
function countRangeSum(nums: number[], lower: number, upper: number): number {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  const temp = new Array(n + 1);
  return mergeCount(prefix, 0, n, lower, upper, temp);
}

function mergeCount(
  sums: number[],
  left: number,
  right: number,
  lower: number,
  upper: number,
  temp: number[],
): number {
  if (left >= right) return 0;
  const mid = Math.floor((left + right) / 2);
  let count =
    mergeCount(sums, left, mid, lower, upper, temp) +
    mergeCount(sums, mid + 1, right, lower, upper, temp);
  // 统计
  let l = mid + 1;
  let r = mid + 1;
  for (let i = left; i <= mid; i++) {
    while (l <= right && sums[l] - sums[i] < lower) l++;
    while (r <= right && sums[r] - sums[i] <= upper) r++;
    count += r - l;
  }
  // 归并
  for (let i = left; i <= right; i++) temp[i] = sums[i];
  let i = left;
  let j = mid + 1;
  let k = left;
  while (i <= mid && j <= right) {
    if (temp[i] <= temp[j]) sums[k++] = temp[i++];
    else sums[k++] = temp[j++];
  }
  while (i <= mid) sums[k++] = temp[i++];
  while (j <= right) sums[k++] = temp[j++];
  return count;
}

// 方法2：二叉索引树 / 树状数组（O(n log n)）
function countRangeSumBIT(nums: number[], lower: number, upper: number): number {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  // 收集所有需要离散化的值
  const allValues: number[] = [];
  for (const s of prefix) {
    allValues.push(s, s - lower, s - upper);
  }
  allValues.sort((a, b) => a - b);
  const rank = new Map<number, number>();
  let rankIdx = 1;
  for (const v of allValues) {
    if (!rank.has(v)) rank.set(v, rankIdx++);
  }
  const bit = new Array(rankIdx + 1).fill(0);
  function update(i: number) {
    while (i < bit.length) {
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
  let count = 0;
  update(rank.get(prefix[0])!);
  for (let i = 1; i <= n; i++) {
    const lo = rank.get(prefix[i] - upper)!;
    const hi = rank.get(prefix[i] - lower)!;
    count += query(hi) - query(lo - 1);
    update(rank.get(prefix[i])!);
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 024. 区间和的个数 =====");
console.log("归并 [-2,5,-1],-2,2:", countRangeSum([-2, 5, -1], -2, 2)); // 3
console.log("BIT [-2,5,-1],-2,2:", countRangeSumBIT([-2, 5, -1], -2, 2)); // 3
console.log("归并 [0],0,0:", countRangeSum([0], 0, 0)); // 1

export {};
