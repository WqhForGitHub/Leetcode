// ============================================================
// 164. 1 比 0 多的子数组个数
// ============================================================
// 给定二进制数组，统计 1 的个数比 0 多的子数组数目。
// 将 0 转为 -1，问题变为统计和 > 0 的子数组数目，
// 即统计前缀和数组中 prefix[j] > prefix[i] (j > i) 的对数。
// 时间复杂度 O(n log n)。

// 方法1：归并排序统计
function subarraysWithMoreOnes(nums: number[]): number {
  const n = nums.length;
  // 构建前缀和数组
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + (nums[i] === 1 ? 1 : -1);
  }
  // 统计 i < j 且 prefix[i] < prefix[j] 的对数
  return countGreaterPairs(prefix);
}

function countGreaterPairs(arr: number[]): number {
  const temp = new Array(arr.length).fill(0);
  return mergeSortCount(arr, temp, 0, arr.length - 1);
}

function mergeSortCount(arr: number[], temp: number[], lo: number, hi: number): number {
  if (lo >= hi) return 0;
  const mid = Math.floor((lo + hi) / 2);
  let count = mergeSortCount(arr, temp, lo, mid) + mergeSortCount(arr, temp, mid + 1, hi);
  // 统计跨区间对数：左区间元素 < 右区间元素
  let j = mid + 1;
  for (let i = lo; i <= mid; i++) {
    while (j <= hi && arr[j] <= arr[i]) j++;
    count += hi - j + 1;
  }
  // 归并
  let i = lo;
  j = mid + 1;
  let k = lo;
  while (i <= mid && j <= hi) {
    if (arr[i] <= arr[j]) temp[k++] = arr[i++];
    else temp[k++] = arr[j++];
  }
  while (i <= mid) temp[k++] = arr[i++];
  while (j <= hi) temp[k++] = arr[j++];
  for (let t = lo; t <= hi; t++) arr[t] = temp[t];
  return count;
}

// 方法2：树状数组（离散化 + BIT）
function subarraysWithMoreOnesBIT(nums: number[]): number {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + (nums[i] === 1 ? 1 : -1);
  }
  // 离散化
  const sorted = [...new Set(prefix)].sort((a, b) => a - b);
  const rank = new Map<number, number>();
  sorted.forEach((v, i) => rank.set(v, i + 1));
  const m = sorted.length;
  const bit = new Array(m + 1).fill(0);

  function update(i: number): void {
    for (; i <= m; i += i & -i) bit[i]++;
  }
  function query(i: number): number {
    let sum = 0;
    for (; i > 0; i -= i & -i) sum += bit[i];
    return sum;
  }

  let count = 0;
  update(rank.get(prefix[0])!);
  for (let i = 1; i <= n; i++) {
    const r = rank.get(prefix[i])!;
    // 统计之前严格小于 prefix[i] 的个数
    count += query(r - 1);
    update(r);
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 164. 1 比 0 多的子数组个数 =====");
console.log("归并 [0,1,1,0,1]:", subarraysWithMoreOnes([0, 1, 1, 0, 1])); // 9
console.log("归并 [1,0,1,0,1]:", subarraysWithMoreOnes([1, 0, 1, 0, 1])); // 7
console.log("BIT [0,1,1,0,1]:", subarraysWithMoreOnesBIT([0, 1, 1, 0, 1])); // 9
console.log("BIT [1,0,1,0,1]:", subarraysWithMoreOnesBIT([1, 0, 1, 0, 1])); // 7

export {};
