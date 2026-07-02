// ============================================================
// 023. 翻转对
// ============================================================
// LeetCode 493. Reverse Pairs
// 给定数组 nums，统计翻转对数量：满足 i < j 且 nums[i] > 2 * nums[j] 的下标对 (i, j)。
// 注意 2 * nums[j] 可能溢出 32 位，使用除法或 BigInt 比较。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：归并排序分治（推荐）
// 思路：在归并排序的合并阶段，左半和右半各自有序，统计跨左右翻转对：
//       对左半每个 nums[i]，找右半中满足 nums[i] > 2*nums[j] 的最大 j。
//       因为两边有序，可用双指针线性扫描。统计完再合并。
function reversePairs(nums: number[]): number {
  const temp = new Array<number>(nums.length);
  return mergeCount(nums, 0, nums.length - 1, temp);
}

function mergeCount(nums: number[], left: number, right: number, temp: number[]): number {
  if (left >= right) return 0;
  const mid = (left + right) >> 1;
  let count = mergeCount(nums, left, mid, temp) + mergeCount(nums, mid + 1, right, temp);

  // 统计跨左右翻转对：左半 [left..mid]，右半 [mid+1..right]，均有序
  let j = mid + 1;
  for (let i = left; i <= mid; i++) {
    // nums[i] > 2 * nums[j]，用除法避免溢出
    while (j <= right && nums[i] / 2.0 > nums[j]) {
      j++;
    }
    count += j - (mid + 1);
  }

  // 合并两个有序段
  mergeSorted(nums, left, mid, right, temp);
  return count;
}

function mergeSorted(
  nums: number[],
  left: number,
  mid: number,
  right: number,
  temp: number[],
): void {
  for (let i = left; i <= right; i++) temp[i] = nums[i];
  let i = left;
  let j = mid + 1;
  let k = left;
  while (i <= mid && j <= right) {
    if (temp[i] <= temp[j]) {
      nums[k++] = temp[i++];
    } else {
      nums[k++] = temp[j++];
    }
  }
  while (i <= mid) nums[k++] = temp[i++];
  while (j <= right) nums[k++] = temp[j++];
}

// 方法2：树状数组 + 离散化（O(n log n)）
// 思路：把所有 nums[i] 与 2*nums[i]（用浮点数避免整数溢出问题）离散化到坐标。
//       从右往左遍历，对每个 nums[i]，查询严格小于 nums[i] 的已插入元素个数，
//       再把 2*nums[i] 插入树状数组。
function reversePairsBIT(nums: number[]): number {
  const n = nums.length;
  if (n === 0) return 0;

  // 收集所有需要离散化的值：nums[i] 与 2*nums[i]
  // 使用数值本身（JS number 为双精度浮点，可表示大整数）
  const values: number[] = [];
  for (let i = 0; i < n; i++) {
    values.push(nums[i]);
    values.push(2 * nums[i]);
  }

  // 排序去重，建立坐标映射
  const sorted = Array.from(new Set(values)).sort((a, b) => a - b);
  const rank = new Map<number, number>();
  sorted.forEach((v, idx) => rank.set(v, idx + 1)); // 1-indexed
  const m = sorted.length;

  const tree = new Array<number>(m + 2).fill(0);
  const update = (i: number, delta: number): void => {
    for (; i <= m; i += i & -i) tree[i] += delta;
  };
  const query = (i: number): number => {
    let s = 0;
    for (; i > 0; i -= i & -i) s += tree[i];
    return s;
  };

  let count = 0;
  // 从右往左：对 nums[i]，查询所有已插入的 2*nums[j] 中严格小于 nums[i] 的个数
  for (let i = n - 1; i >= 0; i--) {
    // 查询 < nums[i] 的元素个数（找最大的 rank 使得 sorted[rank] < nums[i]）
    // 用二分找到第一个 >= nums[i] 的位置
    let lo = 1;
    let hi = m;
    let pos = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid - 1] < nums[i]) {
        pos = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    count += query(pos);
    // 插入 2 * nums[i]
    update(rank.get(2 * nums[i])!, 1);
  }

  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 023. 翻转对 =====");
console.log("归并 [1,3,2,3,1]:", reversePairs([1, 3, 2, 3, 1])); // 期望: 2
console.log("归并 [2,4,3,5,1]:", reversePairs([2, 4, 3, 5, 1])); // 期望: 3
console.log(
  "归并 [2147483647,2147483647,-2147483647,-2147483647]:",
  reversePairs([2147483647, 2147483647, -2147483647, -2147483647]),
); // 期望: 5（4 个正>2*负 + 1 个负>2*更负）
console.log("BIT [1,3,2,3,1]:", reversePairsBIT([1, 3, 2, 3, 1])); // 期望: 2
console.log("BIT [2,4,3,5,1]:", reversePairsBIT([2, 4, 3, 5, 1])); // 期望: 3
console.log(
  "BIT [2147483647,2147483647,-2147483647,-2147483647]:",
  reversePairsBIT([2147483647, 2147483647, -2147483647, -2147483647]),
); // 期望: 5

export {};
