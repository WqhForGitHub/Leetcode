// ============================================================
// 062. 统计合格元素的数目
// ============================================================
// 给定数组 nums 和整数 k，统计满足以下两个条件的下标 i 的数目：
//   1) i 右侧至少有 k 个元素小于 nums[i]；
//   2) i 左侧至少有 k 个元素大于 nums[i]。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：归并排序分治（推荐）
// 两趟归并：
//   第一趟统计 smallerOnRight[i]：i 右侧比 nums[i] 小的元素个数
//     （归并时，左半元素落位前已被放入的右半元素都更小）。
//   第二趟统计 largerOnLeft[i]：i 左侧比 nums[i] 大的元素个数
//     （归并时，右半元素落位时左半尚未落位的元素都更大）。
// 最后统计 smallerOnRight[i] >= k 且 largerOnLeft[i] >= k 的下标数。
function countQualifiedElements1(nums: number[], k: number): number {
  const n: number = nums.length;
  if (n === 0) return 0;

  const smallerOnRight: number[] = new Array<number>(n).fill(0);
  const largerOnLeft: number[] = new Array<number>(n).fill(0);

  // 第一趟：右侧更小元素计数
  const idx1: number[] = nums.map((_: number, i: number): number => i);
  const temp1: number[] = new Array<number>(n);
  mergeSortSmallerRight(nums, idx1, temp1, smallerOnRight, 0, n - 1);

  // 第二趟：左侧更大元素计数
  const idx2: number[] = nums.map((_: number, i: number): number => i);
  const temp2: number[] = new Array<number>(n);
  mergeSortLargerLeft(nums, idx2, temp2, largerOnLeft, 0, n - 1);

  let count: number = 0;
  for (let i: number = 0; i < n; i++) {
    if (smallerOnRight[i] >= k && largerOnLeft[i] >= k) count++;
  }
  return count;
}

// 归并统计右侧更小：归并按 nums[idx[]] 升序
function mergeSortSmallerRight(
  nums: number[],
  idx: number[],
  temp: number[],
  counts: number[],
  left: number,
  right: number,
): void {
  if (left >= right) return;
  const mid: number = (left + right) >> 1;
  mergeSortSmallerRight(nums, idx, temp, counts, left, mid);
  mergeSortSmallerRight(nums, idx, temp, counts, mid + 1, right);

  let i: number = left;
  let j: number = mid + 1;
  let p: number = left;
  let rightCount: number = 0; // 右半已落入 temp 的元素数
  while (i <= mid && j <= right) {
    if (nums[idx[j]] < nums[idx[i]]) {
      temp[p++] = idx[j++];
      rightCount++;
    } else {
      counts[idx[i]] += rightCount;
      temp[p++] = idx[i++];
    }
  }
  while (i <= mid) {
    counts[idx[i]] += rightCount;
    temp[p++] = idx[i++];
  }
  while (j <= right) {
    temp[p++] = idx[j++];
  }
  for (let t: number = left; t <= right; t++) idx[t] = temp[t];
}

// 归并统计左侧更大：右半元素落位时，左半尚未落位的元素都更大
function mergeSortLargerLeft(
  nums: number[],
  idx: number[],
  temp: number[],
  counts: number[],
  left: number,
  right: number,
): void {
  if (left >= right) return;
  const mid: number = (left + right) >> 1;
  mergeSortLargerLeft(nums, idx, temp, counts, left, mid);
  mergeSortLargerLeft(nums, idx, temp, counts, mid + 1, right);

  let i: number = left;
  let j: number = mid + 1;
  let p: number = left;
  while (i <= mid && j <= right) {
    // 等号时先放左半，避免相等被误计为“更大”
    if (nums[idx[i]] <= nums[idx[j]]) {
      temp[p++] = idx[i++];
    } else {
      // 左半剩余 [i..mid] 均大于当前右半元素
      counts[idx[j]] += mid - i + 1;
      temp[p++] = idx[j++];
    }
  }
  while (i <= mid) temp[p++] = idx[i++];
  while (j <= right) temp[p++] = idx[j++];
  for (let t: number = left; t <= right; t++) idx[t] = temp[t];
}

// 方法2：树状数组（离散化）
// 第一趟从左到右：对每个 i，已插入元素中大于 nums[i] 的个数 = 已插入总数 - query(rank)，
//   即 largerOnLeft[i]；然后插入 nums[i]。
// 第二趟从右到左：对每个 i，已插入元素中小于 nums[i] 的个数 = query(rank - 1)，
//   即 smallerOnRight[i]；然后插入 nums[i]。
// 两趟均 O(n log n)。
function countQualifiedElements2(nums: number[], k: number): number {
  const n: number = nums.length;
  if (n === 0) return 0;

  // 离散化
  const sorted: number[] = Array.from(new Set<number>(nums)).sort(
    (a: number, b: number): number => a - b,
  );
  const rank: Map<number, number> = new Map<number, number>();
  for (let i: number = 0; i < sorted.length; i++) rank.set(sorted[i], i + 1);
  const m: number = sorted.length;

  const largerOnLeft: number[] = new Array<number>(n).fill(0);
  const smallerOnRight: number[] = new Array<number>(n).fill(0);

  const tree: number[] = new Array<number>(m + 2).fill(0);
  const add = (i: number): void => {
    for (; i <= m; i += i & -i) tree[i]++;
  };
  const query = (i: number): number => {
    let s: number = 0;
    for (; i > 0; i -= i & -i) s += tree[i];
    return s;
  };

  // 第一趟：左到右，统计左侧更大
  let seen: number = 0;
  for (let i: number = 0; i < n; i++) {
    const r: number = rank.get(nums[i]) as number;
    largerOnLeft[i] = seen - query(r); // 已插入中 > nums[i] 的个数
    add(r);
    seen++;
  }

  // 重置树状数组
  for (let i: number = 0; i < tree.length; i++) tree[i] = 0;

  // 第二趟：右到左，统计右侧更小
  for (let i: number = n - 1; i >= 0; i--) {
    const r: number = rank.get(nums[i]) as number;
    smallerOnRight[i] = query(r - 1); // 已插入中 < nums[i] 的个数
    add(r);
  }

  let count: number = 0;
  for (let i: number = 0; i < n; i++) {
    if (smallerOnRight[i] >= k && largerOnLeft[i] >= k) count++;
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 062. 统计合格元素的数目 =====");
// nums=[4,3,2,1], k=1:
//   smallerOnRight=[3,2,1,0], largerOnLeft=[0,1,2,3]
//   i=1:2>=1且1>=1 合格; i=2:1>=1且2>=1 合格 => 2
console.log("方法1 [4,3,2,1] k=1:", countQualifiedElements1([4, 3, 2, 1], 1)); // 期望: 2
console.log("方法2 [4,3,2,1] k=1:", countQualifiedElements2([4, 3, 2, 1], 1)); // 期望: 2
// nums=[3,1,4,2], k=1: smallerOnRight=[2,0,1,0], largerOnLeft=[0,1,0,2] => 0
console.log("方法1 [3,1,4,2] k=1:", countQualifiedElements1([3, 1, 4, 2], 1)); // 期望: 0
console.log("方法2 [3,1,4,2] k=1:", countQualifiedElements2([3, 1, 4, 2], 1)); // 期望: 0
// nums=[5,4,3,2,1], k=2:
//   smallerOnRight=[4,3,2,1,0], largerOnLeft=[0,1,2,3,4]
//   i=2:2>=2且2>=2 合格; i=3:1<2 不合格 => 仅 i=2 => 1
console.log("方法1 [5,4,3,2,1] k=2:", countQualifiedElements1([5, 4, 3, 2, 1], 2)); // 期望: 1
console.log("方法2 [5,4,3,2,1] k=2:", countQualifiedElements2([5, 4, 3, 2, 1], 2)); // 期望: 1

export {};
