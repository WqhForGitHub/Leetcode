// ============================================================
// 045. 统计 K-Big 索引的数量
// ============================================================
// LeetCode 2519. Count the Number of K-Big Indices
// 给定下标从 0 开始的整数数组 nums 和正整数 k。下标 i 称为 k-big 当且仅当：
// 1) 至少有 k 个下标 idx1 < i 满足 nums[idx1] < nums[i]；
// 2) 至少有 k 个下标 idx2 > i 满足 nums[idx2] < nums[i]。
// 返回 k-big 索引的数量。
// 时间复杂度：O(n log n), 空间复杂度：O(n)

// 方法1：归并排序分治（推荐）
// 分别用归并排序求出每个位置 i 的：
//   leftSmaller[i]  = i 左侧比 nums[i] 小的元素个数；
//   rightSmaller[i] = i 右侧比 nums[i] 小的元素个数。
// 若两者均 >= k 则 i 为 k-big。时间复杂度 O(n log n)，空间复杂度 O(n)
function countKBigIndices(nums: number[], k: number): number {
  const n: number = nums.length;

  // leftSmaller：升序归并，相等时先放右侧，放置右侧元素时累加已放置的左侧个数
  function countLeftSmaller(arr: number[]): number[] {
    const m: number = arr.length;
    const res: number[] = new Array<number>(m).fill(0);
    function mergeSort(a: [number, number][]): [number, number][] {
      if (a.length <= 1) return a;
      const mid: number = Math.floor(a.length / 2);
      const left: [number, number][] = mergeSort(a.slice(0, mid));
      const right: [number, number][] = mergeSort(a.slice(mid));
      const merged: [number, number][] = [];
      let i: number = 0;
      let j: number = 0;
      while (i < left.length && j < right.length) {
        if (left[i][0] < right[j][0]) {
          merged.push(left[i++]);
        } else {
          res[right[j][1]] += i; // 严格更小的左侧个数
          merged.push(right[j++]);
        }
      }
      while (i < left.length) merged.push(left[i++]);
      while (j < right.length) {
        res[right[j][1]] += i;
        merged.push(right[j++]);
      }
      return merged;
    }
    mergeSort(arr.map((v: number, idx: number): [number, number] => [v, idx]));
    return res;
  }

  // rightSmaller（右侧严格更小个数，即“右侧更小数”）：升序归并，相等时先放左侧，
  // 放置左侧元素时累加已放置的右侧个数
  function countRightSmaller(arr: number[]): number[] {
    const m: number = arr.length;
    const res: number[] = new Array<number>(m).fill(0);
    function mergeSort(a: [number, number][]): [number, number][] {
      if (a.length <= 1) return a;
      const mid: number = Math.floor(a.length / 2);
      const left: [number, number][] = mergeSort(a.slice(0, mid));
      const right: [number, number][] = mergeSort(a.slice(mid));
      const merged: [number, number][] = [];
      let i: number = 0;
      let j: number = 0;
      while (i < left.length && j < right.length) {
        if (left[i][0] <= right[j][0]) {
          res[left[i][1]] += j; // 严格更小的右侧个数
          merged.push(left[i++]);
        } else {
          merged.push(right[j++]);
        }
      }
      while (i < left.length) {
        res[left[i][1]] += j;
        merged.push(left[i++]);
      }
      while (j < right.length) merged.push(right[j++]);
      return merged;
    }
    mergeSort(arr.map((v: number, idx: number): [number, number] => [v, idx]));
    return res;
  }

  const leftSmaller: number[] = countLeftSmaller(nums);
  const rightSmaller: number[] = countRightSmaller(nums);

  let ans: number = 0;
  for (let i: number = 0; i < n; i++) {
    if (leftSmaller[i] >= k && rightSmaller[i] >= k) ans++;
  }
  return ans;
}

// 方法2：树状数组（BIT）+ 离散化
// 左到右扫描求 leftSmaller，右到左扫描求 rightSmaller，均用 BIT 维护值域频次。
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function countKBigIndicesBIT(nums: number[], k: number): number {
  const n: number = nums.length;
  // 离散化
  const sorted: number[] = [...new Set<number>(nums)].sort((a: number, b: number): number => a - b);
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

  // leftSmaller[i] = 严格小于 nums[i] 的已见值个数
  const leftSmaller: number[] = new Array<number>(n).fill(0);
  for (let i: number = 0; i < n; i++) {
    const r: number = rank.get(nums[i])!;
    leftSmaller[i] = query(r - 1); // 严格更小
    update(r, 1);
  }

  // rightSmaller[i]：右到左扫描，统计已见（右侧）中严格更小的个数
  tree.fill(0);
  const rightSmaller: number[] = new Array<number>(n).fill(0);
  for (let i: number = n - 1; i >= 0; i--) {
    const r: number = rank.get(nums[i])!;
    rightSmaller[i] = query(r - 1);
    update(r, 1);
  }

  let ans: number = 0;
  for (let i: number = 0; i < n; i++) {
    if (leftSmaller[i] >= k && rightSmaller[i] >= k) ans++;
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 045. 统计 K-Big 索引的数量 =====");
console.log(countKBigIndices([2, 3, 6, 5, 2, 3], 2)); // 期望结果: 2
console.log(countKBigIndices([1, 1, 1], 3)); // 期望结果: 0
console.log("--- 方法2测试 ---");
console.log(countKBigIndicesBIT([2, 3, 6, 5, 2, 3], 2)); // 期望结果: 2
console.log(countKBigIndicesBIT([1, 1, 1], 3)); // 期望结果: 0

export {};
