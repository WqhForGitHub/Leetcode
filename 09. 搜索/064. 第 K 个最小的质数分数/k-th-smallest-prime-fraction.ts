// ============================================================
// 064. 第 K 个最小的质数分数
// ============================================================
// LeetCode 786. K-th Smallest Prime Fraction
// 升序排列的质数数组，所有分数 arr[i]/arr[j]（i<j）中第 K 小的。

// 方法1：二分查找值域
function kthSmallestPrimeFraction(arr: number[], k: number): number[] {
  const n = arr.length;
  let left = 0;
  let right = 1;
  let p = 0;
  let q = 1;
  while (true) {
    const mid = (left + right) / 2;
    let count = 0;
    let bestP = 0;
    let bestQ = 1;
    let j = 1;
    for (let i = 0; i < n - 1; i++) {
      while (j < n && arr[i] / arr[j] >= mid) j++;
      count += n - j;
      if (j < n && arr[i] * bestQ > arr[j] * bestP) {
        bestP = arr[i];
        bestQ = arr[j];
      }
    }
    if (count === k) return [bestP, bestQ];
    if (count < k) left = mid;
    else right = mid;
    p = bestP;
    q = bestQ;
  }
}

// 方法2：最小堆
function kthSmallestPrimeFractionHeap(arr: number[], k: number): number[] {
  const n = arr.length;
  // 用数组模拟堆，存储 [分子idx, 分母idx]
  type Pair = [number, number];
  const heap: Pair[] = [];
  for (let i = 0; i < n - 1; i++) {
    heap.push([i, n - 1]);
  }
  const compare = (a: Pair, b: Pair) =>
    arr[a[0]] * arr[b[1]] - arr[b[0]] * arr[a[1]];
  for (let i = 0; i < k - 1; i++) {
    heap.sort(compare);
    const [ni, dj] = heap.shift()!;
    if (dj > ni + 1) {
      heap.push([ni, dj - 1]);
    }
  }
  heap.sort(compare);
  const [ni, dj] = heap[0];
  return [arr[ni], arr[dj]];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 064. 第 K 个最小的质数分数 =====");
console.log("二分 [1,2,3,5],3:", kthSmallestPrimeFraction([1, 2, 3, 5], 3)); // [2,5]
console.log("二分 [1,7],1:", kthSmallestPrimeFraction([1, 7], 1)); // [1,7]

export {};
